import "dotenv/config";
import { seedFakeData } from "@/fake/seed";

async function main() {
	const resources = await seedFakeData();
	console.log(`Seeded ${resources.length} resources`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
