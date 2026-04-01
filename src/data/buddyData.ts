import type { BuddySpecies } from '../types'

// --- PRNG ---
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashUserId(userId: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < userId.length; i++) {
    hash ^= userId.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

// --- Species data ---
export interface BuddySpeciesData extends BuddySpecies {
  rarity: string
  rarityWeight: number
  color: string
}

export const SPECIES: BuddySpeciesData[] = [
  {
    name: 'duck',
    rarity: 'common',
    rarityWeight: 60,
    color: '#d29922',
    ascii: `   __
 <(o )>
  |  |
  | /|
  |_||`
  },
  {
    name: 'goose',
    rarity: 'common',
    rarityWeight: 60,
    color: '#e6edf3',
    ascii: `  ___
 / o \\
|  >  |
|_____|
 |   |`
  },
  {
    name: 'blob',
    rarity: 'common',
    rarityWeight: 60,
    color: '#58a6ff',
    ascii: `  ____
 /o  o\\
( ~  ~ )
 \\____/
  |  |`
  },
  {
    name: 'cat',
    rarity: 'common',
    rarityWeight: 60,
    color: '#f0883e',
    ascii: `/\\_/\\
( o.o )
 > ^ <
/|   |\\
 |___|`
  },
  {
    name: 'penguin',
    rarity: 'common',
    rarityWeight: 60,
    color: '#8b949e',
    ascii: `  ___
 (o o)
 (   )
  | |
 /___\\`
  },
  {
    name: 'turtle',
    rarity: 'common',
    rarityWeight: 60,
    color: '#3fb950',
    ascii: `  ___
 /. .\\
| (_) |
 \\_^_/
  | |`
  },
  {
    name: 'snail',
    rarity: 'common',
    rarityWeight: 60,
    color: '#bc8cff',
    ascii: `  __
 /  \\
| () |
 \\__/~
  ~~~~`
  },
  {
    name: 'rabbit',
    rarity: 'common',
    rarityWeight: 60,
    color: '#e6edf3',
    ascii: ` /\\ /\\
( o  o)
(  <>  )
 \\____/
  |  |`
  },
  {
    name: 'octopus',
    rarity: 'uncommon',
    rarityWeight: 25,
    color: '#bc8cff',
    ascii: `  ____
 / ** \\
(  <>  )
/|||||\\
~ ~ ~ ~`
  },
  {
    name: 'owl',
    rarity: 'uncommon',
    rarityWeight: 25,
    color: '#d29922',
    ascii: ` /\\_/\\
(O   O)
 ( ^ )
 /   \\
(_____)
  | |`
  },
  {
    name: 'cactus',
    rarity: 'uncommon',
    rarityWeight: 25,
    color: '#3fb950',
    ascii: ` _|_
| o |
|___|
  |
__|__`
  },
  {
    name: 'mushroom',
    rarity: 'uncommon',
    rarityWeight: 25,
    color: '#f85149',
    ascii: `  ___
 /o o\\
/     \\
 | . |
 |___|`
  },
  {
    name: 'chonk',
    rarity: 'uncommon',
    rarityWeight: 25,
    color: '#f0883e',
    ascii: `  ____
 /O  O\\
| ~oo~ |
|______|
 |  | |`
  },
  {
    name: 'axolotl',
    rarity: 'rare',
    rarityWeight: 10,
    color: '#f85149',
    ascii: `  _  _
 (o)(o)
~(    )~
  \\  /
   \\/ `
  },
  {
    name: 'capybara',
    rarity: 'rare',
    rarityWeight: 10,
    color: '#d29922',
    ascii: ` _____
(o   o)
| --- |
|_____|
 |  | `
  },
  {
    name: 'ghost',
    rarity: 'epic',
    rarityWeight: 4,
    color: '#8b949e',
    ascii: `  ___
 /o o\\
(  ^  )
|~~~~~|
 \\_|_/`
  },
  {
    name: 'robot',
    rarity: 'epic',
    rarityWeight: 4,
    color: '#58a6ff',
    ascii: ` [___]
 |o_o|
 | = |
/|___|\\
 |   |`
  },
  {
    name: 'dragon',
    rarity: 'legendary',
    rarityWeight: 1,
    color: '#39d2c0',
    ascii: `/\\_____
< o   o)
 \\  ~ /
/(   )\\
/__| |`
  }
]

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#8b949e',
  uncommon: '#3fb950',
  rare: '#58a6ff',
  epic: '#bc8cff',
  legendary: '#f0883e'
}

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  uncommon: '少见',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
}

// Rarity tiers as selection pools
const RARITY_POOLS: { rarity: Rarity; names: string[]; weight: number }[] = [
  {
    rarity: 'common',
    weight: 60,
    names: ['duck', 'goose', 'blob', 'cat', 'penguin', 'turtle', 'snail', 'rabbit']
  },
  {
    rarity: 'uncommon',
    weight: 25,
    names: ['octopus', 'owl', 'cactus', 'mushroom', 'chonk']
  },
  {
    rarity: 'rare',
    weight: 10,
    names: ['axolotl', 'capybara']
  },
  {
    rarity: 'epic',
    weight: 4,
    names: ['ghost', 'robot']
  },
  {
    rarity: 'legendary',
    weight: 1,
    names: ['dragon']
  }
]

// --- Stats ---
export type StatKey = 'DEBUGGING' | 'PATIENCE' | 'CHAOS' | 'WISDOM' | 'SNARK'
export type BuddyStats = Record<StatKey, number>

export const STAT_LABELS: Record<StatKey, string> = {
  DEBUGGING: '调试力',
  PATIENCE: '耐心值',
  CHAOS: '混乱度',
  WISDOM: '智慧值',
  SNARK: '嘲讽力'
}

export const STAT_COLORS: Record<StatKey, string> = {
  DEBUGGING: '#58a6ff',
  PATIENCE: '#3fb950',
  CHAOS: '#f85149',
  WISDOM: '#bc8cff',
  SNARK: '#f0883e'
}

// --- Accessories ---
export type HatType = 'none' | 'crown' | 'tophat' | 'beanie' | 'party'
export type EyeType = 'normal' | 'star' | 'sparkle' | 'heart' | 'diamond'

export const HAT_LABELS: Record<HatType, string> = {
  none: '无帽子',
  crown: '皇冠',
  tophat: '高帽',
  beanie: '毛线帽',
  party: '派对帽'
}

export const EYE_CHARS: Record<EyeType, string> = {
  normal: 'o',
  star: '*',
  sparkle: '✦',
  heart: '♥',
  diamond: '◆'
}

export const EYE_LABELS: Record<EyeType, string> = {
  normal: '普通',
  star: '星星',
  sparkle: '闪光',
  heart: '爱心',
  diamond: '钻石'
}

const HAT_WEIGHTS: Record<HatType, number> = {
  none: 50,
  crown: 10,
  tophat: 15,
  beanie: 15,
  party: 10
}

const EYE_WEIGHTS: Record<EyeType, number> = {
  normal: 50,
  star: 15,
  sparkle: 15,
  heart: 12,
  diamond: 8
}

// --- Buddy Names ---
const BUDDY_NAMES = [
  'Pixel', 'Glitch', 'Byte', 'Flux', 'Null', 'Qubit', 'Cache', 'Stack',
  'Token', 'Vector', 'Tensor', 'Lambda', 'Async', 'Defer', 'Mutex', 'Spawn',
  'Fiber', 'Shard', 'Pivot', 'Blob', 'Chunk', 'Heap', 'Pager', 'Proxy',
  'Latch', 'Patch', 'Macro', 'Scope', 'Trait', 'Monad'
]

// --- Weighted selection helper ---
function weightedSelect<T extends string>(
  rng: () => number,
  options: { key: T; weight: number }[]
): T {
  const total = options.reduce((s, o) => s + o.weight, 0)
  let r = rng() * total
  for (const opt of options) {
    r -= opt.weight
    if (r <= 0) return opt.key
  }
  return options[options.length - 1].key
}

// --- Main generation function ---
export interface GeneratedBuddy {
  species: BuddySpeciesData
  name: string
  stats: BuddyStats
  hat: HatType
  eyes: EyeType
  userId: string
  seed: number
}

export function generateBuddy(userId: string): GeneratedBuddy {
  const seed = hashUserId(userId)
  const rng = mulberry32(seed)

  // Step 1: Select rarity tier
  const rarityOptions = RARITY_POOLS.map((p) => ({ key: p.rarity, weight: p.weight }))
  const selectedRarity = weightedSelect(rng, rarityOptions)

  // Step 2: Select species within rarity tier
  const pool = RARITY_POOLS.find((p) => p.rarity === selectedRarity)!
  const speciesIdx = Math.floor(rng() * pool.names.length)
  const speciesName = pool.names[speciesIdx]
  const species = SPECIES.find((s) => s.name === speciesName)!

  // Step 3: Generate stats
  const stats: BuddyStats = {
    DEBUGGING: Math.floor(rng() * 10) + 1,
    PATIENCE: Math.floor(rng() * 10) + 1,
    CHAOS: Math.floor(rng() * 10) + 1,
    WISDOM: Math.floor(rng() * 10) + 1,
    SNARK: Math.floor(rng() * 10) + 1
  }

  // Step 4: Select hat
  const hatOptions = (Object.keys(HAT_WEIGHTS) as HatType[]).map((k) => ({
    key: k,
    weight: HAT_WEIGHTS[k]
  }))
  const hat = weightedSelect(rng, hatOptions)

  // Step 5: Select eyes
  const eyeOptions = (Object.keys(EYE_WEIGHTS) as EyeType[]).map((k) => ({
    key: k,
    weight: EYE_WEIGHTS[k]
  }))
  const eyes = weightedSelect(rng, eyeOptions)

  // Step 6: Select name
  const nameIdx = Math.floor(rng() * BUDDY_NAMES.length)
  const name = BUDDY_NAMES[nameIdx]

  return { species, name, stats, hat, eyes, userId, seed }
}

export function randomUserId(): string {
  return 'user_' + Math.random().toString(36).slice(2, 10)
}
