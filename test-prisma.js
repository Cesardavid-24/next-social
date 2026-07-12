const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const post = await prisma.post.findFirst();
    if (post) {
      await prisma.notification.create({
        data: {
          senderId: post.userId,
          receiverId: post.userId,
          type: "POST_LIKE",
          postId: post.id,
        }
      });
      console.log("Success");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
