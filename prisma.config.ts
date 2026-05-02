import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: "src/db/prisma/schema.prisma",
	migrations: {
		path: "src/db/prisma/migrations",
		seed: "tsx src/db/fake/seed.ts"
	},
	datasource: {
		url: env("DATABASE_URL")
	}
});
