/**
 * Seed Presentation Data
 * 
 * Creates all study houses and rooms from MAKE these.md for presentation
 * 
 * Usage: node seed-presentation-data.js
 */

require("dotenv").config();
const { sequelize, Role, User, Client, Room } = require("./models");
const bcrypt = require("bcrypt");

const seedData = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected!\n");

    // ============================================
    // STUDY HOUSE 1: URUK
    // ============================================
    console.log("📍 Creating URUK study house...");
    const urukPassword = await bcrypt.hash("Uruk@2026", 10);
    const urukUser = await User.create({
      username: "URUK",
      email: "uruk@gmail.com",
      password: urukPassword,
      phoneNumber: "0781255281",
      roleId: 2, // client
    });
    
    const urukClient = await Client.create({
      userId: urukUser.id,
      openingHours: "00:00:00",
      closingHours: "23:59:00",
      latitude: 32.0155065,
      longitude: 35.86742,
    });

    // URUK Rooms
    await Room.bulkCreate([
      {
        roomNumber: "URUK-1",
        roomType: "classroom",
        capacity: 30,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: urukClient.id,
      },
      {
        roomNumber: "URUK-2",
        roomType: "meeting_room",
        capacity: 10,
        basePrice: 10,
        status: "available",
        description: "The best room for your meeting",
        hasWhiteboard: false,
        hasWifi: true,
        hasProjector: false,
        hasTV: true,
        hasAC: true,
        clientId: urukClient.id,
      },
      {
        roomNumber: "URUK-3",
        roomType: "meeting_room",
        capacity: 8,
        basePrice: 10,
        status: "available",
        description: "The best room for your meeting",
        hasWhiteboard: false,
        hasWifi: true,
        hasProjector: false,
        hasTV: true,
        hasAC: true,
        clientId: urukClient.id,
      },
      {
        roomNumber: "URUK-4",
        roomType: "classroom",
        capacity: 20,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: urukClient.id,
      },
      {
        roomNumber: "URUK-5",
        roomType: "classroom",
        capacity: 15,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: urukClient.id,
      },
    ]);
    console.log("✅ URUK created with 5 rooms\n");

    // ============================================
    // STUDY HOUSE 2: WISDOW
    // ============================================
    console.log("📍 Creating WISDOW study house...");
    const wisdowPassword = await bcrypt.hash("Wisdw@2026", 10);
    const wisdowUser = await User.create({
      username: "WISDOW",
      email: "wisdow@gmail.com",
      password: wisdowPassword,
      phoneNumber: "0791238760",
      roleId: 2,
    });
    
    const wisdowClient = await Client.create({
      userId: wisdowUser.id,
      openingHours: "08:00:00",
      closingHours: "03:00:00",
      latitude: 32.0112478,
      longitude: 35.8699147,
    });

    // WISDOW Rooms
    await Room.bulkCreate([
      {
        roomNumber: "WISDOW-1",
        roomType: "classroom",
        capacity: 30,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: wisdowClient.id,
      },
      {
        roomNumber: "WISDOW-2",
        roomType: "meeting_room",
        capacity: 10,
        basePrice: 10,
        status: "available",
        description: "The best room for your meeting",
        hasWhiteboard: false,
        hasWifi: true,
        hasProjector: false,
        hasTV: true,
        hasAC: true,
        clientId: wisdowClient.id,
      },
      {
        roomNumber: "WISDOW-3",
        roomType: "meeting_room",
        capacity: 8,
        basePrice: 10,
        status: "available",
        description: "The best room for your meeting",
        hasWhiteboard: false,
        hasWifi: true,
        hasProjector: false,
        hasTV: true,
        hasAC: true,
        clientId: wisdowClient.id,
      },
      {
        roomNumber: "WISDOW-4",
        roomType: "classroom",
        capacity: 20,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: wisdowClient.id,
      },
    ]);
    console.log("✅ WISDOW created with 4 rooms\n");

    // ============================================
    // STUDY HOUSE 3: المعجم (Almujam)
    // ============================================
    console.log("📍 Creating المعجم study house...");
    const almujamPassword = await bcrypt.hash("Almujam@2026", 10);
    const almujamUser = await User.create({
      username: "المعجم",
      email: "almujam@gmail.com",
      password: almujamPassword,
      phoneNumber: "0774567820",
      roleId: 2,
    });
    
    const almujamClient = await Client.create({
      userId: almujamUser.id,
      openingHours: "10:00:00",
      closingHours: "22:00:00",
      latitude: 32.0111471,
      longitude: 35.8703272,
    });

    // Almujam Rooms
    await Room.bulkCreate([
      {
        roomNumber: "ALMUJAM-1",
        roomType: "classroom",
        capacity: 30,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: almujamClient.id,
      },
      {
        roomNumber: "ALMUJAM-2",
        roomType: "meeting_room",
        capacity: 10,
        basePrice: 10,
        status: "available",
        description: "The best room for your meeting",
        hasWhiteboard: false,
        hasWifi: true,
        hasProjector: false,
        hasTV: true,
        hasAC: true,
        clientId: almujamClient.id,
      },
      {
        roomNumber: "ALMUJAM-3",
        roomType: "classroom",
        capacity: 20,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: almujamClient.id,
      },
    ]);
    console.log("✅ المعجم created with 3 rooms\n");

    // ============================================
    // STUDY HOUSE 4: FIKAR
    // ============================================
    console.log("📍 Creating FIKAR study house...");
    const fikarPassword = await bcrypt.hash("Fikar@2026", 10);
    const fikarUser = await User.create({
      username: "FIKAR",
      email: "fikar@gmail.com",
      password: fikarPassword,
      phoneNumber: "0771872984",
      roleId: 2,
    });
    
    const fikarClient = await Client.create({
      userId: fikarUser.id,
      openingHours: "08:00:00",
      closingHours: "00:00:00",
      latitude: 32.0111613,
      longitude: 35.871009,
    });

    // FIKAR Rooms
    await Room.bulkCreate([
      {
        roomNumber: "FIKAR-1",
        roomType: "classroom",
        capacity: 30,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: fikarClient.id,
      },
    ]);
    console.log("✅ FIKAR created with 1 room\n");

    // ============================================
    // STUDY HOUSE 5: LUMINA
    // ============================================
    console.log("📍 Creating LUMINA study house...");
    const luminaPassword = await bcrypt.hash("Lumina@2026", 10);
    const luminaUser = await User.create({
      username: "LUMINA",
      email: "lumina@gmail.com",
      password: luminaPassword,
      phoneNumber: "0781284563",
      roleId: 2,
    });
    
    const luminaClient = await Client.create({
      userId: luminaUser.id,
      openingHours: "08:00:00",
      closingHours: "23:00:00",
      latitude: 32.0120,
      longitude: 35.8710,
    });

    // LUMINA Rooms
    await Room.bulkCreate([
      {
        roomNumber: "LUMINA-1",
        roomType: "classroom",
        capacity: 30,
        basePrice: 15,
        status: "available",
        description: "Good classroom for training, courses or training",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: luminaClient.id,
      },
    ]);
    console.log("✅ LUMINA created with 1 room\n");

    // ============================================
    // CREATE TEST USERS
    // ============================================
    console.log("📍 Creating test users...");
    const testUserPassword = await bcrypt.hash("Test@2026", 10);
    
    await User.bulkCreate([
      {
        username: "Ahmed",
        email: "ahmed@test.com",
        password: testUserPassword,
        phoneNumber: "0781111111",
        roleId: 1,
      },
      {
        username: "Sara",
        email: "sara@test.com",
        password: testUserPassword,
        phoneNumber: "0782222222",
        roleId: 1,
      },
      {
        username: "Mohammed",
        email: "mohammed@test.com",
        password: testUserPassword,
        phoneNumber: "0783333333",
        roleId: 1,
      },
    ]);
    console.log("✅ Created 3 test users\n");

    // ============================================
    // SUMMARY
    // ============================================
    console.log("========================================");
    console.log("🎉 PRESENTATION DATA SEEDED SUCCESSFULLY!");
    console.log("========================================\n");
    
    console.log("📚 STUDY HOUSES (Client Login):");
    console.log("  1. URUK - uruk@gmail.com / Uruk@2026 (5 rooms)");
    console.log("  2. WISDOW - wisdow@gmail.com / Wisdw@2026 (4 rooms)");
    console.log("  3. المعجم - almujam@gmail.com / Almujam@2026 (3 rooms)");
    console.log("  4. FIKAR - fikar@gmail.com / Fikar@2026 (1 room)");
    console.log("  5. LUMINA - lumina@gmail.com / Lumina@2026 (1 room)");
    
    console.log("\n👤 TEST USERS:");
    console.log("  - ahmed@test.com / Test@2026");
    console.log("  - sara@test.com / Test@2026");
    console.log("  - mohammed@test.com / Test@2026");
    
    console.log("\n🔐 ADMIN:");
    console.log("  - admin@ehjez.com / admin123");
    
    console.log("\n📊 TOTAL: 5 Study Houses, 14 Rooms, 3 Test Users");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    console.error(error);
    process.exit(1);
  }
};

seedData();
