import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbName = process.env.DB_NAME ?? "plurihub-db";
const dbUrl = process.env.DATABASE_URL ?? `postgresql://postgres:postgres@localhost:5432/${dbName}`;

export default defineConfig({
	schema: "src/db/prisma/schema.prisma",
	migrations: {
		path: "src/db/prisma/migrations",
		seed: "tsx src/db/fake/seed.ts"
	},
	datasource: {
		url: dbUrl
	}
});
