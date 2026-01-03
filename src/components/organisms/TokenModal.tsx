"use client";

import { memo } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from "@/components/atoms/Modal";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { PriceText } from "@/components/atoms/PriceText";
import { Progress } from "@/components/atoms/Progress";
import { CopyButton } from "@/components/atoms/CopyButton";
import { Icon } from "@/components/atoms/Icon";
import type { Token } from "@/lib/types";
import { formatCompact, formatTimeAgo, truncateAddress } from "@/lib/utils";

interface TokenModalProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: (tokenId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (tokenId: string) => void;
}

/**
 * Token detail modal with comprehensive information
 */
export const TokenModal = memo(function TokenModal({
  token,
  isOpen,
  onClose,
  onBuy,
  isFavorite = false,
  onToggleFavorite,
}: TokenModalProps) {
  // Don't render if no token
  if (!token) return null;

  const statusConfig = {
    new: { label: "New Pair", color: "success" as const },
    finalStretch: { label: "Final Stretch", color: "warning" as const },
    migrated: { label: "Migrated", color: "info" as const },
  };

  const status = statusConfig[token.status];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel={`${token.name} token details`}
    >
      <ModalHeader className="pb-0">
        {/* Token header */}
        <div className="flex items-start gap-4">
          <Avatar src={token.image} alt={token.symbol} size="xl" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ModalTitle>{token.name}</ModalTitle>
              <Badge variant={status.color} size="sm">
                {status.label}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mt-1 text-text-secondary">
              <span className="font-mono text-sm">{token.symbol}</span>
              <span className="text-text-muted">•</span>
              <span className="text-xs uppercase">{token.chain}</span>
            </div>

            {/* Contract address */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs text-text-tertiary font-mono">
                {truncateAddress(token.address)}
              </span>
              <CopyButton value={token.address} size="sm" />
            </div>
          </div>

          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(token.id)}
              className="p-2 rounded-lg hover:bg-bg-hover transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Icon
                name="star"
                size="md"
                className={isFavorite ? "text-warning fill-warning" : "text-text-tertiary"}
              />
            </button>
          )}
        </div>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Price section */}
        <section>
          <h3 className="text-sm font-medium text-text-secondary mb-3">Price</h3>
          <div className="flex items-baseline gap-3">
            <PriceText
              value={token.price}
              className="text-2xl font-bold"
            />
            <PriceText
              value={token.priceChange24h}
              isPercentage
              showSign
            />
          </div>
        </section>

        {/* Stats grid */}
        <section>
          <h3 className="text-sm font-medium text-text-secondary mb-3">Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              label="Market Cap"
              value={`$${formatCompact(token.marketCap)}`}
            />
            <StatCard
              label="Liquidity"
              value={`$${formatCompact(token.liquidity)}`}
            />
            <StatCard
              label="Volume (24h)"
              value={`$${formatCompact(token.volume24h)}`}
            />
            <StatCard
              label="Holders"
              value={formatCompact(token.holders)}
            />
            <StatCard
              label="Age"
              value={formatTimeAgo(token.createdAt)}
            />
          </div>
        </section>

        {/* Progress section */}
        {token.status !== "migrated" && (
          <section>
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              Bonding Curve Progress
            </h3>
            <div className="space-y-2">
              <Progress
                value={token.bondingProgress}
                showLabel
                colorByProgress
              />
              <p className="text-xs text-text-tertiary">
                {token.bondingProgress >= 100
                  ? "Bonding complete - Ready for migration"
                  : `${(100 - token.bondingProgress).toFixed(1)}% remaining until migration`}
              </p>
            </div>
          </section>
        )}

        {/* Social links */}
        {token.social && (token.social.website || token.social.twitter || token.social.telegram) && (
          <section>
            <h3 className="text-sm font-medium text-text-secondary mb-3">Links</h3>
            <div className="flex flex-wrap gap-2">
              {token.social.website && (
                <SocialLink href={token.social.website} label="Website" />
              )}
              {token.social.twitter && (
                <SocialLink href={token.social.twitter} label="Twitter" />
              )}
              {token.social.telegram && (
                <SocialLink href={token.social.telegram} label="Telegram" />
              )}
            </div>
          </section>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        {onBuy && (
          <Button variant="primary" onClick={() => onBuy(token.id)}>
            <Icon name="zap" size="sm" className="mr-1.5" />
            Quick Buy
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
});

/**
 * Stat card for token details
 */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-bg-tertiary">
      <p className="text-xs text-text-tertiary mb-1">{label}</p>
      <p className="text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

/**
 * Social link button
 */
function SocialLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors text-sm"
    >
      <Icon name="externalLink" size="sm" />
      {label}
    </a>
  );
}
