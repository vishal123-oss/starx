import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../config/env";
import * as schema from "./schema/index";

// Make database connection optional for MVP
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

try {
    if (env.DATABASE_URL && env.DATABASE_URL !== "postgresql://localhost:5432/xangoes") {
        pool = new Pool({
            connectionString: env.DATABASE_URL,
        });
        db = drizzle(pool, { schema });
    }
} catch (error) {
    console.warn("Database connection not available, using mock data");
}

export { db };

export const resetDbConnection = async () => {
    if (pool) {
        await pool.end();
        if (env.DATABASE_URL) {
            pool = new Pool({ connectionString: env.DATABASE_URL });
            db = drizzle(pool, { schema });
        }
    }
};
