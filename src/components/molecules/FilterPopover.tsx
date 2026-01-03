"use client";

import { memo, useState, useCallback } from "react";
import { Popover } from "@/components/atoms/Popover";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";
import type { TokenStatus } from "@/lib/types";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterPopoverProps {
  /** Currently selected filters */
  selected: string[];
  /** Available filter options */
  options: FilterOption[];
  /** Callback when selection changes */
  onChange: (selected: string[]) => void;
  /** Label for the filter button */
  label?: string;
  /** Whether multiple selection is allowed */
  multiple?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Filter popover with checkbox/radio options
 */
export const FilterPopover = memo(function FilterPopover({
  selected,
  options,
  onChange,
  label = "Filter",
  multiple = true,
  className,
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(
    (id: string) => {
      if (multiple) {
        const newSelected = selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id];
        onChange(newSelected);
      } else {
        onChange([id]);
        setIsOpen(false);
      }
    },
    [selected, onChange, multiple]
  );

  const handleClear = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const handleSelectAll = useCallback(() => {
    onChange(options.map((o) => o.id));
  }, [options, onChange]);

  const activeCount = selected.length;

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5",
            activeCount > 0 && "text-accent-primary",
            className
          )}
        >
          <Icon name="filter" size="sm" />
          {label}
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-accent-primary/20 text-accent-primary">
              {activeCount}
            </span>
          )}
          <Icon
            name="chevronDown"
            size="sm"
            className={cn(
              "transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      }
      placement="bottom"
      align="start"
      className="min-w-[200px]"
    >
      <div className="p-2">
        {/* Header with actions */}
        {multiple && (
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className="text-xs text-text-tertiary">
              {activeCount} of {options.length} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="text-xs text-accent-primary hover:underline"
              >
                All
              </button>
              <button
                onClick={handleClear}
                className="text-xs text-text-secondary hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Options list */}
        <div className="space-y-0.5">
          {options.map((option) => (
            <FilterOption
              key={option.id}
              option={option}
              isSelected={selected.includes(option.id)}
              onToggle={() => handleToggle(option.id)}
              multiple={multiple}
            />
          ))}
        </div>
      </div>
    </Popover>
  );
});

/**
 * Individual filter option
 */
function FilterOption({
  option,
  isSelected,
  onToggle,
  multiple,
}: {
  option: FilterOption;
  isSelected: boolean;
  onToggle: () => void;
  multiple: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
        "hover:bg-bg-hover",
        isSelected && "bg-bg-hover"
      )}
    >
      {/* Checkbox/Radio indicator */}
      <span
        className={cn(
          "flex-shrink-0 w-4 h-4 rounded border transition-colors",
          multiple ? "rounded" : "rounded-full",
          isSelected
            ? "bg-accent-primary border-accent-primary"
            : "border-border-secondary"
        )}
      >
        {isSelected && (
          <Icon
            name="check"
            size="sm"
            className="text-white"
          />
        )}
      </span>

      {/* Label */}
      <span className={cn(
        "flex-1 text-left",
        isSelected ? "text-text-primary" : "text-text-secondary"
      )}>
        {option.label}
      </span>

      {/* Count badge */}
      {option.count !== undefined && (
        <span className="text-xs text-text-tertiary">
          {option.count}
        </span>
      )}
    </button>
  );
}

/**
 * Chain selector popover
 */
interface ChainSelectorProps {
  selected: string;
  onChange: (chain: string) => void;
  className?: string;
}

const CHAINS = [
  { id: "all", label: "All Chains", icon: "globe" },
  { id: "solana", label: "Solana", icon: "solana" },
  { id: "ethereum", label: "Ethereum", icon: "ethereum" },
  { id: "base", label: "Base", icon: "base" },
  { id: "bsc", label: "BNB Chain", icon: "bnb" },
];

export const ChainSelector = memo(function ChainSelector({
  selected,
  onChange,
  className,
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedChain = CHAINS.find((c) => c.id === selected) || CHAINS[0];

  const handleSelect = useCallback(
    (chainId: string) => {
      onChange(chainId);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
          <ChainIcon chain={selectedChain?.id || "eth"} />
          <span className="hidden sm:inline">{selectedChain?.label || "Ethereum"}</span>
          <Icon
            name="chevronDown"
            size="sm"
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </Button>
      }
      placement="bottom"
      align="start"
      className="min-w-[180px]"
    >
      <div className="py-1">
        {CHAINS.map((chain) => (
          <button
            key={chain.id}
            onClick={() => handleSelect(chain.id)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
              "hover:bg-bg-hover",
              selected === chain.id && "bg-bg-hover text-accent-primary"
            )}
          >
            <ChainIcon chain={chain.id} />
            <span>{chain.label}</span>
            {selected === chain.id && (
              <Icon name="check" size="sm" className="ml-auto" />
            )}
          </button>
        ))}
      </div>
    </Popover>
  );
});

/**
 * Chain icon component
 */
function ChainIcon({ chain, className }: { chain: string; className?: string }) {
  const colors: Record<string, string> = {
    all: "text-text-secondary",
    solana: "text-purple-400",
    ethereum: "text-blue-400",
    base: "text-blue-500",
    bsc: "text-yellow-400",
  };

  return (
    <div
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center",
        "bg-bg-tertiary",
        colors[chain] || "text-text-secondary",
        className
      )}
    >
      <Icon name="wallet" size="sm" />
    </div>
  );
}

/**
 * Status filter tabs
 */
interface StatusTabsProps {
  selected: TokenStatus | "all";
  onChange: (status: TokenStatus | "all") => void;
  counts?: Record<TokenStatus | "all", number>;
  className?: string;
}

export const StatusTabs = memo(function StatusTabs({
  selected,
  onChange,
  counts,
  className,
}: StatusTabsProps) {
  const tabs: { id: TokenStatus | "all"; label: string; color: string }[] = [
    { id: "all", label: "All", color: "text-text-secondary" },
    { id: "new", label: "New Pairs", color: "text-success" },
    { id: "finalStretch", label: "Final Stretch", color: "text-warning" },
    { id: "migrated", label: "Migrated", color: "text-info" },
  ];

  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-bg-tertiary", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            selected === tab.id
              ? "bg-bg-secondary text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <span className={selected === tab.id ? tab.color : undefined}>
            {tab.label}
          </span>
          {counts && counts[tab.id] !== undefined && (
            <span className="ml-1.5 text-xs text-text-tertiary">
              {counts[tab.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
});

/**
 * Sort selector dropdown
 */
interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  className?: string;
}

export const SortSelector = memo(function SortSelector({
  value,
  onChange,
  options,
  className,
}: SortSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.id === value) ?? options[0];
  const label = selectedOption?.label ?? "Sort";

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button variant="ghost" size="sm" className={cn("gap-1.5", className)}>
          <Icon name="sortAsc" size="sm" />
          <span className="hidden sm:inline">{label}</span>
          <Icon
            name="chevronDown"
            size="sm"
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </Button>
      }
      placement="bottom"
      align="end"
      className="min-w-[160px]"
    >
      <div className="py-1">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              onChange(option.id);
              setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
              "hover:bg-bg-hover text-left",
              value === option.id && "text-accent-primary"
            )}
          >
            {option.label}
            {value === option.id && (
              <Icon name="check" size="sm" className="ml-auto" />
            )}
          </button>
        ))}
      </div>
    </Popover>
  );
});
