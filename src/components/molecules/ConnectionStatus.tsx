"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { selectIsConnected, selectLastUpdate } from "@/features/tokens";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Badge } from "@/components/atoms/Badge";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface ConnectionStatusProps {
  className?: string;
  variant?: "badge" | "indicator" | "detailed";
}

/**
 * Connection status indicator showing WebSocket state and last update time
 */
export const ConnectionStatus = memo(function ConnectionStatus({
  className,
  variant = "badge",
}: ConnectionStatusProps) {
  const isConnected = useAppSelector(selectIsConnected);
  const lastUpdate = useAppSelector(selectLastUpdate);

  if (variant === "indicator") {
    return (
      <Tooltip
        content={
          <div className="text-xs space-y-1">
            <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
            {lastUpdate && <div>Last update: {formatTimeAgo(new Date(lastUpdate))}</div>}
          </div>
        }
      >
        <div className={cn("flex items-center gap-1.5", className)}>
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-success animate-pulse" : "bg-danger"
            )}
          />
          {isConnected ? (
            <Wifi className="h-3.5 w-3.5 text-success" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-danger" />
          )}
        </div>
      </Tooltip>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              isConnected ? "bg-success animate-pulse" : "bg-danger"
            )}
          />
          <span className={cn(
            "text-sm font-medium",
            isConnected ? "text-success" : "text-danger"
          )}>
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>
        {lastUpdate && (
          <span className="text-xs text-text-tertiary">
            Updated {formatTimeAgo(new Date(lastUpdate))}
          </span>
        )}
      </div>
    );
  }

  // Default badge variant
  return (
    <Badge
      variant={isConnected ? "success" : "danger"}
      size="sm"
      withDot
      className={className}
    >
      {isConnected ? "Live" : "Offline"}
    </Badge>
  );
});

/**
 * Last update timestamp display
 */
export const LastUpdateTime = memo(function LastUpdateTime({
  className,
}: {
  className?: string;
}) {
  const lastUpdate = useAppSelector(selectLastUpdate);

  if (!lastUpdate) return null;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-text-tertiary", className)}>
      <RefreshCw className="h-3 w-3" />
      <span>Updated {formatTimeAgo(new Date(lastUpdate))}</span>
    </div>
  );
});

/**
 * Connection status with reconnect button
 */
export const ConnectionStatusWithAction = memo(function ConnectionStatusWithAction({
  onReconnect,
  className,
}: {
  onReconnect?: () => void;
  className?: string;
}) {
  const isConnected = useAppSelector(selectIsConnected);
  const lastUpdate = useAppSelector(selectLastUpdate);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Tooltip
        content={
          <div className="text-xs space-y-1">
            <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
            {lastUpdate && (
              <div>Last update: {formatTimeAgo(new Date(lastUpdate))}</div>
            )}
          </div>
        }
      >
        <Badge
          variant={isConnected ? "success" : "danger"}
          size="sm"
          withDot
          className="cursor-help"
        >
          {isConnected ? "Live" : "Offline"}
        </Badge>
      </Tooltip>

      {!isConnected && onReconnect && (
        <button
          type="button"
          onClick={onReconnect}
          className="text-xs text-accent-primary hover:text-accent-primary/80 transition-colors"
        >
          Reconnect
        </button>
      )}
    </div>
  );
});
