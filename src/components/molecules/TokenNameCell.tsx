"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { TokenAvatar } from "@/components/atoms/Avatar";
import { CopyableAddress } from "@/components/atoms/CopyButton";
import { Badge } from "@/components/atoms/Badge";
import { Tooltip } from "@/components/atoms/Tooltip";
import { ExternalLink } from "@/components/atoms/Icon";
import type { Token } from "@/lib/types";

interface TokenNameCellProps {
  token: Pick<Token, "name" | "symbol" | "image" | "address" | "status">;
  className?: string;
  showStatus?: boolean;
  showAddress?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Token name cell displaying avatar, name, symbol, and optional address
 * Used in table rows and token cards
 */
export const TokenNameCell = memo(function TokenNameCell({
  token,
  className,
  showStatus = false,
  showAddress = true,
  size = "md",
}: TokenNameCellProps) {
  const sizeConfig = {
    sm: { avatar: "sm" as const, name: "text-xs", symbol: "text-[10px]" },
    md: { avatar: "md" as const, name: "text-sm", symbol: "text-xs" },
    lg: { avatar: "lg" as const, name: "text-base", symbol: "text-sm" },
  };

  const config = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-3 min-w-0", className)}>
      <TokenAvatar
        src={token.image}
        symbol={token.symbol}
        size={config.avatar}
        showBadge={showStatus}
        badgeColor={
          token.status === "new"
            ? "bg-blue-400"
            : token.status === "finalStretch"
              ? "bg-yellow-400"
              : "bg-green-400"
        }
      />

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-medium text-text-primary truncate",
              config.name
            )}
          >
            {token.name}
          </span>
          {showStatus && (
            <Badge variant={token.status} size="sm">
              {token.status === "new"
                ? "New"
                : token.status === "finalStretch"
                  ? "Final"
                  : "Migrated"}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className={cn("text-text-tertiary", config.symbol)}>
            ${token.symbol}
          </span>
          {showAddress && (
            <CopyableAddress address={token.address} chars={4} />
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * Compact token name for mobile or condensed views
 */
export const TokenNameCompact = memo(function TokenNameCompact({
  token,
  className,
}: {
  token: Pick<Token, "name" | "symbol" | "image">;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TokenAvatar src={token.image} symbol={token.symbol} size="sm" />
      <span className="text-sm font-medium text-text-primary truncate">
        {token.symbol}
      </span>
    </div>
  );
});

/**
 * Token link with external link icon
 */
export const TokenLink = memo(function TokenLink({
  address,
  explorer = "solscan",
  className,
}: {
  address: string;
  explorer?: "solscan" | "solana" | "birdeye";
  className?: string;
}) {
  const explorerUrls = {
    solscan: `https://solscan.io/token/${address}`,
    solana: `https://explorer.solana.com/address/${address}`,
    birdeye: `https://birdeye.so/token/${address}`,
  };

  return (
    <Tooltip content={`View on ${explorer}`}>
      <a
        href={explorerUrls[explorer]}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1 text-text-tertiary hover:text-text-primary transition-colors",
          className
        )}
      >
        <ExternalLink className="h-3 w-3" />
      </a>
    </Tooltip>
  );
});
