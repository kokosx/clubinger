import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const main = async () => {
  await db.post.createMany({
    data: Array(100)
      .fill(0)
      .map((_, i) => ({
        createdBy: "zqyfco21f3lzi5r",
        clubId: 14,
        title: `${i}`,
      })),
  });
};

main();
