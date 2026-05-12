require("dotenv").config();
const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  try {
    const name = "Admin User";
    const email = "admin@gmail.com"; // change as needed
    const password = "12345678";
    const role = "admin";

    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        // no active field here
      },
    });

    console.log("Admin created successfully:", admin);
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
