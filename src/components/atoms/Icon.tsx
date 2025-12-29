import {
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
  ExternalLink,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  Wallet,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Droplet,
  Zap,
  Star,
  AlertCircle,
  Info,
  Settings,
  Menu,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Re-export commonly used icons
export {
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
  ExternalLink,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  Wallet,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Droplet,
  Zap,
  Star,
  AlertCircle,
  Info,
  Settings,
  Menu,
};

// Type for icon names
export type IconName =
  | "arrowUpRight"
  | "arrowDownRight"
  | "copy"
  | "check"
  | "externalLink"
  | "search"
  | "x"
  | "chevronDown"
  | "chevronUp"
  | "chevronRight"
  | "chevronLeft"
  | "moreHorizontal"
  | "refreshCw"
  | "filter"
  | "sortAsc"
  | "sortDesc"
  | "wallet"
  | "users"
  | "clock"
  | "trendingUp"
  | "trendingDown"
  | "droplet"
  | "zap"
  | "star"
  | "alertCircle"
  | "info"
  | "settings"
  | "menu";

// Icon map for dynamic rendering
const iconMap: Record<IconName, LucideIcon> = {
  arrowUpRight: ArrowUpRight,
  arrowDownRight: ArrowDownRight,
  copy: Copy,
  check: Check,
  externalLink: ExternalLink,
  search: Search,
  x: X,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  moreHorizontal: MoreHorizontal,
  refreshCw: RefreshCw,
  filter: Filter,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  wallet: Wallet,
  users: Users,
  clock: Clock,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  droplet: Droplet,
  zap: Zap,
  star: Star,
  alertCircle: AlertCircle,
  info: Info,
  settings: Settings,
  menu: Menu,
};

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
  className?: string;
}

/**
 * Dynamic Icon component that renders icons by name
 */
export function Icon({ name, className, ...props }: IconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      className={cn("h-4 w-4 shrink-0", className)}
      {...props}
    />
  );
}

/**
 * Trend icon that shows up/down based on value
 */
export function TrendIcon({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  if (value > 0) {
    return <TrendingUp className={cn("h-4 w-4 text-success", className)} />;
  }
  if (value < 0) {
    return <TrendingDown className={cn("h-4 w-4 text-danger", className)} />;
  }
  return null;
}

/**
 * Sort icon that reflects current sort direction
 */
export function SortIcon({
  direction,
  className,
}: {
  direction: "asc" | "desc" | null;
  className?: string;
}) {
  if (direction === "asc") {
    return <SortAsc className={cn("h-4 w-4 text-accent-primary", className)} />;
  }
  if (direction === "desc") {
    return <SortDesc className={cn("h-4 w-4 text-accent-primary", className)} />;
  }
  return (
    <SortAsc className={cn("h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity", className)} />
  );
}

/**
 * Chain logo icon
 */
export function ChainIcon({
  chain,
  className,
}: {
  chain: "sol" | "eth" | "base";
  className?: string;
}) {
  const chainColors = {
    sol: "text-purple-400",
    eth: "text-blue-400",
    base: "text-blue-500",
  };

  return (
    <div
      className={cn(
        "h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold",
        chainColors[chain],
        className
      )}
    >
      {chain.toUpperCase().slice(0, 1)}
    </div>
  );
}
