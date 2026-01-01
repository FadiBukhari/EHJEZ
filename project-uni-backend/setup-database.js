/**
 * Database Setup Script
 * 
 * Run this script on a new computer to create all tables and seed initial data.
 * 
 * Usage: node setup-database.js
 * 
 * Make sure you have:
 * 1. PostgreSQL installed and running
 * 2. Created a database (e.g., 'ehjez' or your DB_NAME from .env)
 * 3. Updated the .env file with correct database credentials
 */

require("dotenv").config();
const { sequelize, Role, User, Client, Room, Booking, Notification, Review } = require("./models");
const bcrypt = require("bcrypt");

const setupDatabase = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connection established!\n");

    // Force sync - this will DROP all tables and recreate them
    console.log("🔄 Creating tables (this will reset all data)...");
    await sequelize.sync({ force: true });
    console.log("✅ All tables created successfully!\n");

    // Seed Roles
    console.log("🔄 Seeding roles...");
    await Role.bulkCreate([
      { id: 1, name: "user" },
      { id: 2, name: "client" },
      { id: 3, name: "admin" },
    ]);
    console.log("✅ Roles seeded: user, client, admin\n");

    // Create default admin account
    console.log("🔄 Creating default admin account...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "admin",
      email: "admin@ehjez.com",
      password: hashedPassword,
      phoneNumber: "0500000000",
      roleId: 3, // admin role
    });
    console.log("✅ Admin account created!");
    console.log("   Email: admin@ehjez.com");
    console.log("   Password: admin123\n");

    console.log("========================================");
    console.log("🎉 Database setup completed successfully!");
    console.log("========================================\n");
    console.log("You can now start the server with: npm start");
    console.log("\nDefault accounts:");
    console.log("  Admin: admin@ehjez.com / admin123");
    console.log("\nRegister new users through the app to create user/client accounts.");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database setup failed:");
    console.error(error.message);
    
    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Make sure PostgreSQL is running!");
    }
    if (error.message.includes("does not exist")) {
      console.log("\n💡 Create the database first:");
      console.log("   1. Open pgAdmin or psql");
      console.log("   2. Run: CREATE DATABASE your_db_name;");
    }
    if (error.message.includes("authentication failed")) {
      console.log("\n💡 Check your .env file credentials:");
      console.log("   DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST");
    }

    process.exit(1);
  }
};

setupDatabase();
