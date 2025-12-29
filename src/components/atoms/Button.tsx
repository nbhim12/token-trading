import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-primary text-white hover:bg-accent-primary/90 active:bg-accent-primary/80",
        secondary:
          "bg-bg-tertiary text-text-primary hover:bg-bg-hover active:bg-bg-active border border-border-primary",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-bg-hover active:bg-bg-active",
        danger:
          "bg-danger/10 text-danger hover:bg-danger/20 active:bg-danger/30 border border-danger/20",
        success:
          "bg-success/10 text-success hover:bg-success/20 active:bg-success/30 border border-success/20",
        link: "text-accent-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-6 text-sm",
        icon: "h-8 w-8",
        iconSm: "h-6 w-6",
        iconLg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders as child component (Slot) */
  asChild?: boolean;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Button component with multiple variants and sizes
 * Supports asChild pattern for composition with other components
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

/**
 * Icon button variant for action buttons
 */
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "size"> & { size?: "sm" | "md" | "lg" }
>(({ size = "md", ...props }, ref) => {
  const sizeMap = {
    sm: "iconSm" as const,
    md: "icon" as const,
    lg: "iconLg" as const,
  };

  return <Button ref={ref} size={sizeMap[size]} {...props} />;
});

IconButton.displayName = "IconButton";
