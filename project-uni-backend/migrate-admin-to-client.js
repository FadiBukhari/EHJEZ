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

async function migrateAdminToClient() {
  try {
    console.log("Starting migration: admin -> client...");

    // Step 1: Convert role column to VARCHAR temporarily
    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN role TYPE VARCHAR(255);
    `);
    console.log("✓ Converted role column to VARCHAR");

    // Step 2: Update existing 'admin' users to 'client'
    await sequelize.query(`
      UPDATE "Users" 
      SET role = 'client' 
      WHERE role = 'admin';
    `);
    console.log("✓ Updated all admin users to client");

    // Step 3: Drop the default constraint first
    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN role DROP DEFAULT;
    `);
    console.log("✓ Dropped default constraint");

    // Step 4: Drop the old enum type with CASCADE
    await sequelize.query(`
      DROP TYPE IF EXISTS "enum_Users_role" CASCADE;
    `);
    console.log("✓ Dropped old enum type");

    // Step 5: Create new enum type
    await sequelize.query(`
      CREATE TYPE "enum_Users_role" AS ENUM ('user', 'client');
    `);
    console.log("✓ Created new enum type with 'user' and 'client'");

    // Step 6: Convert column back to enum
    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN role TYPE "enum_Users_role" 
      USING role::"enum_Users_role";
    `);
    console.log("✓ Applied new enum type to role column");

    // Step 7: Re-add the default
    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN role SET DEFAULT 'user'::"enum_Users_role";
    `);
    console.log("✓ Re-added default value");

    // Step 8: Add new columns for client operating hours
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "openingHours" TIME,
      ADD COLUMN IF NOT EXISTS "closingHours" TIME;
    `);
    console.log("✓ Added openingHours and closingHours columns");

    console.log("\n✅ Migration completed successfully!");
    console.log("All 'admin' users have been migrated to 'client' role.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await sequelize.close();
  }
}

migrateAdminToClient();
