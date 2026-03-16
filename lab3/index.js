const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- เริ่มการทำงาน ---");

  //1. สร้าง Author พร้อม Book
  const newAuthor = await prisma.author.create({
    data: {
      name: "J.K. Rowling",
      books: {
        create: {
          title: "Harry Potter and the Philosopher's Stone",
        },
      },
    },
    include: { books: true } // ให้ดึงข้อมูลหนังสือที่สร้างเสร็จแล้วออกมาดูด้วย
  });
  console.log("สร้าง Author และ Book สำเร็จ:", newAuthor);

  // 2. สร้าง Category และ Update Book เพื่อเชื่อมต่อกัน
  // 2.1 สร้าง Category
  const fantasyCategory = await prisma.category.create({
    data: { name: "Fantasy" },
  });

  // 2.2 อัปเดต Book เล่มที่เพิ่งสร้าง (สมมติว่าใช้ ID จากตัวแปรด้านบน)
  const updatedBook = await prisma.book.update({
    where: { id: newAuthor.books[0].id },
    data: {
      categories: {
        connect: { id: fantasyCategory.id },
      },
    },
    include: { categories: true }
  });
  console.log("อัปเดต Book เชื่อมกับ Category สำเร็จ:", updatedBook);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });