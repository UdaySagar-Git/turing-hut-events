const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  for (const user of data) {
    await db.user.create({
      data: user
    });
  }
}

main().then(() => {
  console.log("Seed completed");
  db.$disconnect();
});
