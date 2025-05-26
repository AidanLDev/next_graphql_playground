import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { depthLimit } from "@/lib/graph-ql-depth-limit";
import { KeyValueCache } from "@apollo/utils.keyvaluecache";
import responseCachePlugin from "@apollo/server-plugin-response-cache";

class InMemoryCache implements KeyValueCache {
  private readonly cache = new Map<string, string>();
  constructor() {
    console.log("InMemoryCache instantiated");
  }

  async get(key: string): Promise<string | undefined> {
    const value = this.cache.get(key);
    if (value === undefined) {
      console.log(`[InMemoryCache] MISS for key: ${key}`);
      return undefined;
    }
    console.log(`[InMemoryCache] HIT for key: ${key}, value: ${value}`);
    return value;
  }

  async set(
    key: string,
    value: string,
    options?: { ttl?: number }
  ): Promise<void> {
    if (typeof value !== "string" || value === "") {
      console.warn(
        `[InMemoryCache] Attempt to set invalid value for key: ${key}`
      );
      return;
    }
    this.cache.set(key, value);

    // Handle TTL if provided
    if (options?.ttl) {
      setTimeout(() => {
        this.cache.delete(key);
      }, options.ttl * 1000);
    }
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)], // Set your desired max depth here

  // Enable query caching
  cache: new InMemoryCache(),

  plugins: [
    // Response caching plugin
    responseCachePlugin({
      // Cache everything for 1 hour by default
      sessionId: async () => null, // No session-based caching
      shouldReadFromCache: async () => true,
      shouldWriteToCache: async () => true,
    }),
  ],

  // Enable persisted queries (APQ)
  persistedQueries: {
    cache: new InMemoryCache(),
    ttl: 900, // 15 minutes for persisted queries
  },
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export async function GET(req: Request): Promise<Response> {
  try {
    return await handler(req);
  } catch (err) {
    console.error("GraphQL GET error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    return await handler(req);
  } catch (err) {
    console.error("GraphQL POST error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
