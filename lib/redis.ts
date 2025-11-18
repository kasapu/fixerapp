import Redis from "ioredis"

// In-memory cache fallback
class InMemoryCache {
  private cache: Map<string, { value: string; expiry?: number }>
  private timers: Map<string, NodeJS.Timeout>

  constructor() {
    this.cache = new Map()
    this.timers = new Map()
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key)
    if (!item) return null

    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string> {
    const expiry = duration ? Date.now() + duration * 1000 : undefined

    this.cache.set(key, { value, expiry })

    if (duration) {
      // Clear existing timer if any
      const existingTimer = this.timers.get(key)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      // Set new timer
      const timer = setTimeout(() => {
        this.cache.delete(key)
        this.timers.delete(key)
      }, duration * 1000)

      this.timers.set(key, timer)
    }

    return "OK"
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0
    for (const key of keys) {
      if (this.cache.delete(key)) {
        count++

        // Clear timer if exists
        const timer = this.timers.get(key)
        if (timer) {
          clearTimeout(timer)
          this.timers.delete(key)
        }
      }
    }
    return count
  }

  async exists(...keys: string[]): Promise<number> {
    return keys.filter((key) => this.cache.has(key)).length
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.cache.get(key)
    if (!item) return 0

    item.expiry = Date.now() + seconds * 1000

    // Clear existing timer
    const existingTimer = this.timers.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.cache.delete(key)
      this.timers.delete(key)
    }, seconds * 1000)

    this.timers.set(key, timer)

    return 1
  }

  async ttl(key: string): Promise<number> {
    const item = this.cache.get(key)
    if (!item) return -2

    if (!item.expiry) return -1

    const remaining = Math.ceil((item.expiry - Date.now()) / 1000)
    return remaining > 0 ? remaining : -2
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key)
    const value = current ? parseInt(current, 10) + 1 : 1
    await this.set(key, value.toString())
    return value
  }

  async quit(): Promise<string> {
    this.cache.clear()
    this.timers.forEach((timer) => clearTimeout(timer))
    this.timers.clear()
    return "OK"
  }
}

// Create Redis client or fallback to in-memory cache
let redisClient: Redis | InMemoryCache

try {
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn("Redis connection failed, falling back to in-memory cache")
          return null // Stop retrying
        }
        return Math.min(times * 200, 2000)
      },
    })

    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message)
    })

    redisClient.on("connect", () => {
      console.log("✓ Connected to Redis")
    })
  } else {
    console.log("⚠ No Redis URL provided, using in-memory cache")
    redisClient = new InMemoryCache()
  }
} catch (error) {
  console.error("Failed to initialize Redis, using in-memory cache:", error)
  redisClient = new InMemoryCache()
}

export const redis = redisClient

// Cache helper functions
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached) as T
    }

    // Fetch fresh data
    const data = await fetcher()

    // Cache the result
    await redis.set(key, JSON.stringify(data), "EX", ttl)

    return data
  } catch (error) {
    console.error("Cache error:", error)
    // If cache fails, just return fresh data
    return fetcher()
  }
}

export async function invalidateCache(pattern: string) {
  try {
    if (redisClient instanceof InMemoryCache) {
      // For in-memory cache, we can't use pattern matching easily
      // Just clear specific keys if needed
      return
    }

    // For Redis, use SCAN to find and delete keys
    const keys: string[] = []
    let cursor = "0"

    do {
      const [nextCursor, matchedKeys] = await (redisClient as Redis).scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      )
      cursor = nextCursor
      keys.push(...matchedKeys)
    } while (cursor !== "0")

    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error("Cache invalidation error:", error)
  }
}

export default redis
