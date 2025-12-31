import type { Token, TokenStatus } from "@/lib/types";
import { generateId } from "@/lib/utils";

// Token name lists for realistic data
const TOKEN_NAMES = [
  "PepeCoin", "ShibaMax", "DogeMoon", "FlokiRun", "ElonPump",
  "MoonShot", "RocketFi", "DiamondHands", "ToTheMoon", "SafeMars",
  "BabyDoge", "CatCoin", "MemeLord", "YieldMax", "DegenApe",
  "PumpIt", "GreenCandle", "BullRun", "MoonWalk", "SolPunk",
  "BoredApe", "CryptoKitty", "MetaWorld", "NFTGold", "ChainLink2",
  "ApeSwap", "PancakeV3", "UniSwapX", "SushiMax", "CurveDAO",
  "AaveMax", "CompoundX", "MakerPro", "SynthetixV2", "YearnMax",
  "Arbitrum2", "OptimismX", "PolygonPro", "Avalanche2", "Fantom2",
  "Solana2", "Near2", "Cosmos2", "Polkadot2", "Cardano2",
  "Algorand2", "Tezos2", "Hedera2", "Flow2", "Mina2",
];

const TOKEN_SYMBOLS = [
  "PEPE", "SMAX", "DMOON", "FLOKI", "ELON",
  "MOON", "RKTFI", "DHAND", "TTM", "SMARS",
  "BDOGE", "CAT", "MEME", "YMAX", "DAPE",
  "PUMP", "GRNC", "BULL", "MWALK", "SPUNK",
  "BAPE", "CKIT", "META", "NFTG", "LINK2",
  "APES", "CAKE3", "UNIX", "SMAX", "CRVE",
  "AMAX", "CMPX", "MKRP", "SNX2", "YMAX",
  "ARB2", "OPX", "POLY", "AVAX2", "FTM2",
  "SOL2", "NEAR2", "ATOM2", "DOT2", "ADA2",
  "ALGO2", "XTZ2", "HBAR2", "FLOW2", "MINA2",
];

// Generate random token image (using placeholder)
function getTokenImage(symbol: string): string {
  const colors = ["8B5CF6", "3B82F6", "22C55E", "EAB308", "EF4444", "EC4899"];
  const color = colors[Math.abs(hashCode(symbol)) % colors.length];
  return `https://placehold.co/64x64/${color}/FFFFFF?text=${symbol.slice(0, 2)}`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Generate random Solana-like address
function generateAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate random number within range
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Generate random date within hours ago
function randomDateWithinHours(maxHours: number): Date {
  const now = Date.now();
  const hoursAgo = Math.random() * maxHours;
  return new Date(now - hoursAgo * 60 * 60 * 1000);
}

/**
 * Generate a single mock token
 */
export function generateMockToken(status: TokenStatus): Token {
  const index = Math.floor(Math.random() * TOKEN_NAMES.length);
  const name = TOKEN_NAMES[index] ?? "Unknown";
  const symbol = TOKEN_SYMBOLS[index] ?? "UNK";
  
  // Status-specific configurations
  const statusConfig: Record<TokenStatus, {
    bondingRange: [number, number];
    ageHours: number;
    holdersRange: [number, number];
    liquidityRange: [number, number];
  }> = {
    new: {
      bondingRange: [0, 30],
      ageHours: 1,
      holdersRange: [10, 500],
      liquidityRange: [1000, 50000],
    },
    finalStretch: {
      bondingRange: [80, 99],
      ageHours: 12,
      holdersRange: [500, 5000],
      liquidityRange: [50000, 500000],
    },
    migrated: {
      bondingRange: [100, 100],
      ageHours: 48,
      holdersRange: [1000, 50000],
      liquidityRange: [100000, 5000000],
    },
  };

  const config = statusConfig[status];

  const price = randomInRange(0.000001, 0.1);
  const priceChange = randomInRange(-50, 100);
  const bondingProgress = randomInRange(config.bondingRange[0], config.bondingRange[1]);
  const holders = Math.floor(randomInRange(config.holdersRange[0], config.holdersRange[1]));
  const liquidity = randomInRange(config.liquidityRange[0], config.liquidityRange[1]);
  const marketCap = liquidity * randomInRange(2, 10);
  const volume24h = liquidity * randomInRange(0.5, 3);

  return {
    id: generateId(),
    name: name + Math.floor(Math.random() * 1000),
    symbol: symbol + Math.floor(Math.random() * 100),
    address: generateAddress(),
    image: getTokenImage(symbol),
    price,
    priceChange24h: priceChange,
    volume24h,
    marketCap,
    liquidity,
    holders,
    createdAt: randomDateWithinHours(config.ageHours),
    bondingProgress,
    status,
    chain: "sol",
  };
}

/**
 * Generate multiple mock tokens for a specific status
 */
export function generateMockTokens(status: TokenStatus, count: number): Token[] {
  return Array.from({ length: count }, () => generateMockToken(status));
}

/**
 * Generate all mock data for the three columns
 */
export function generateAllMockData(countPerColumn: number = 20): {
  newPairs: Token[];
  finalStretch: Token[];
  migrated: Token[];
} {
  return {
    newPairs: generateMockTokens("new", countPerColumn),
    finalStretch: generateMockTokens("finalStretch", countPerColumn),
    migrated: generateMockTokens("migrated", countPerColumn),
  };
}

/**
 * Simulate a price update for a token
 */
export function simulatePriceUpdate(token: Token): Token {
  const changePercent = randomInRange(-5, 5) / 100;
  const newPrice = token.price * (1 + changePercent);
  const newPriceChange = token.priceChange24h + randomInRange(-2, 2);

  return {
    ...token,
    price: newPrice,
    priceChange24h: Math.max(-99, Math.min(999, newPriceChange)),
  };
}

/**
 * Simulate bonding progress update
 */
export function simulateBondingUpdate(token: Token): Token {
  if (token.status === "migrated") return token;

  const progressIncrease = randomInRange(0.1, 2);
  const newProgress = Math.min(100, token.bondingProgress + progressIncrease);
  
  // Status transition
  let newStatus: TokenStatus = token.status;
  if (newProgress >= 100) {
    newStatus = "migrated";
  } else if (newProgress >= 80 && token.status === "new") {
    newStatus = "finalStretch";
  }

  return {
    ...token,
    bondingProgress: newProgress,
    status: newStatus,
  };
}

// Pre-generated mock data for SSR
let cachedMockData: ReturnType<typeof generateAllMockData> | null = null;

export function getMockData(countPerColumn: number = 20) {
  if (!cachedMockData) {
    cachedMockData = generateAllMockData(countPerColumn);
  }
  return cachedMockData;
}

export function resetMockData() {
  cachedMockData = null;
}
