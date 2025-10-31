const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  }
);

async function seedAdmin() {
  try {
    console.log("Starting admin setup...\n");

    // Step 1: Update enum to include 'admin'
    console.log("Step 1: Updating role enum...");

    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN role DROP DEFAULT;
    `);
    console.log("✓ Dropped default constraint");

    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN role TYPE VARCHAR(255);
    `);
    console.log("✓ Converted role column to VARCHAR");

    await sequelize.query(`
      DROP TYPE IF EXISTS "enum_Users_role" CASCADE;
    `);
    console.log("✓ Dropped old enum type");

    await sequelize.query(`
      CREATE TYPE "enum_Users_role" AS ENUM ('user', 'client', 'admin');
    `);
    console.log("✓ Created new enum type with 'user', 'client', and 'admin'");

    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN role TYPE "enum_Users_role" 
      USING role::"enum_Users_role";
    `);
    console.log("✓ Applied new enum type to role column");

    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN role SET DEFAULT 'user'::"enum_Users_role";
    `);
    console.log("✓ Re-added default value\n");

    // Step 2: Check if admin already exists
    console.log("Step 2: Checking for existing admin...");
    const [existingAdmins] = await sequelize.query(`
      SELECT * FROM "Users" WHERE role = 'admin' LIMIT 1;
    `);

    if (existingAdmins.length > 0) {
      console.log("⚠️  Admin user already exists:");
      console.log(`   Email: ${existingAdmins[0].email}`);
      console.log(`   Username: ${existingAdmins[0].username}\n`);
      console.log("Skipping admin creation.\n");
    } else {
      // Step 3: Create admin user
      console.log("Step 3: Creating admin user...");

      const adminData = {
        username: "admin",
        email: "admin@ehjez.com",
        password: "admin123", // Change this in production!
        role: "admin",
      };

      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      await sequelize.query(
        `
        INSERT INTO "Users" (username, email, password, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW());
      `,
        {
          bind: [
            adminData.username,
            adminData.email,
            hashedPassword,
            adminData.role,
          ],
        }
      );

      console.log("✓ Admin user created successfully!\n");
      console.log("📧 Admin Credentials:");
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
      console.log(
        "\n⚠️  IMPORTANT: Change the admin password after first login!\n"
      );
    }

    console.log("✅ Admin setup completed successfully!");
  } catch (error) {
    console.error("❌ Admin setup failed:", error);
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
