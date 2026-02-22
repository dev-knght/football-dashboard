import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export function getRedisClient(): RedisClientType | null {
  if (client) return client;

  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    client = createClient({
      url,
    });

    client.on('error', (err) => console.error('Redis Client Error', err));
    client.connect().catch((err) => {
      console.error('Redis connection failed:', err);
      client = null;
    });
  } catch (err) {
    console.error('Failed to create Redis client:', err);
    client = null;
  }

  return client;
}
