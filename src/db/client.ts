import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/db/generated/client";

const dbName = process.env.DB_NAME ?? "plurihub-db";
const connectionString =
	process.env.DATABASE_URL ?? `postgresql://postgres:postgres@localhost:5432/${dbName}`;

export const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString })
});
