/**
 * Complete Database Seed File
 * 
 * This file seeds all necessary data for the EHJEZ booking system.
 * Use this to set up the database on a new machine or reset to default state.
 * 
 * Usage: node seed-complete-data.js
 * 
 * WARNING: This will clear ALL existing data and create fresh data.
 */

require("dotenv").config();
const { sequelize, Role, User, Client, Room, Booking, Review, Notification } = require("./models");
const bcrypt = require("bcrypt");

const seedCompleteData = async () => {
  try {
    console.log("🔄 Starting complete database seed...\n");
    console.log("⚠️  WARNING: This will DELETE all existing data!\n");
    
    // Connect to database
    console.log("🔄 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected!\n");

    // Sync database (force: true will drop all tables and recreate)
    console.log("🔄 Resetting database schema...");
    await sequelize.sync({ force: true });
    console.log("✅ Database schema reset!\n");

    // ============================================
    // CREATE ROLES
    // ============================================
    console.log("📍 Creating roles...");
    const [userRole, clientRole, adminRole] = await Role.bulkCreate([
      { id: 1, name: "user" },
      { id: 2, name: "client" },
      { id: 3, name: "admin" },
    ]);
    console.log("✅ Created 3 roles\n");

    // ============================================
    // CREATE ADMIN
    // ============================================
    console.log("📍 Creating admin user...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "Admin",
      email: "admin@ehjez.com",
      password: adminPassword,
      phoneNumber: "0790000000",
      roleId: adminRole.id,
    });
    console.log("✅ Created admin user\n");

    // ============================================
    // CREATE TEST USERS
    // ============================================
    console.log("📍 Creating test users...");
    const testUserPassword = await bcrypt.hash("Test@2026", 10);
    
    const [ahmed, sara, mohammed] = await User.bulkCreate([
      {
        username: "Ahmed",
        email: "ahmed@test.com",
        password: testUserPassword,
        phoneNumber: "0781111111",
        roleId: userRole.id,
      },
      {
        username: "Sara",
        email: "sara@test.com",
        password: testUserPassword,
        phoneNumber: "0782222222",
        roleId: userRole.id,
      },
      {
        username: "Mohammed",
        email: "mohammed@test.com",
        password: testUserPassword,
        phoneNumber: "0783333333",
        roleId: userRole.id,
      },
    ]);
    console.log("✅ Created 3 test users\n");

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
      roleId: clientRole.id,
    });
    
    const urukClient = await Client.create({
      userId: urukUser.id,
      openingHours: "06:00:00",
      closingHours: "23:00:00",
      latitude: 32.0155065,
      longitude: 35.86742,
    });

    const urukRooms = await Room.bulkCreate([
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
      roleId: clientRole.id,
    });
    
    const wisdowClient = await Client.create({
      userId: wisdowUser.id,
      openingHours: "08:00:00",
      closingHours: "22:00:00",
      latitude: 32.0112478,
      longitude: 35.8699147,
    });

    const wisdowRooms = await Room.bulkCreate([
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
        capacity: 12,
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
        roomType: "classroom",
        capacity: 25,
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
    console.log("✅ WISDOW created with 3 rooms\n");

    // ============================================
    // STUDY HOUSE 3: المعجم (ALMUJAM)
    // ============================================
    console.log("📍 Creating المعجم study house...");
    const almujamPassword = await bcrypt.hash("Almujam@2026", 10);
    const almujamUser = await User.create({
      username: "المعجم",
      email: "almujam@gmail.com",
      password: almujamPassword,
      phoneNumber: "0786543210",
      roleId: clientRole.id,
    });
    
    const almujamClient = await Client.create({
      userId: almujamUser.id,
      openingHours: "07:00:00",
      closingHours: "23:00:00",
      latitude: 32.0145,
      longitude: 35.8680,
    });

    const almujamRooms = await Room.bulkCreate([
      {
        roomNumber: "ALMUJAM-1",
        roomType: "meeting_room",
        capacity: 15,
        basePrice: 10,
        status: "available",
        description: "Modern meeting room with all facilities",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: true,
        hasAC: true,
        clientId: almujamClient.id,
      },
      {
        roomNumber: "ALMUJAM-2",
        roomType: "classroom",
        capacity: 20,
        basePrice: 12,
        status: "available",
        description: "Spacious classroom perfect for workshops",
        hasWhiteboard: true,
        hasWifi: true,
        hasProjector: true,
        hasTV: false,
        hasAC: true,
        clientId: almujamClient.id,
      },
    ]);
    console.log("✅ المعجم created with 2 rooms\n");

    // ============================================
    // STUDY HOUSE 4: FIKAR
    // ============================================
    console.log("📍 Creating FIKAR study house...");
    const fikarPassword = await bcrypt.hash("Fikar@2026", 10);
    const fikarUser = await User.create({
      username: "FIKAR",
      email: "fikar@gmail.com",
      password: fikarPassword,
      phoneNumber: "0779876543",
      roleId: clientRole.id,
    });
    
    const fikarClient = await Client.create({
      userId: fikarUser.id,
      openingHours: "09:00:00",
      closingHours: "22:00:00",
      latitude: 32.0160,
      longitude: 35.8690,
    });

    await Room.create({
      roomNumber: "FIKAR-1",
      roomType: "classroom",
      capacity: 25,
      basePrice: 12,
      status: "available",
      description: "Comfortable classroom with modern amenities",
      hasWhiteboard: true,
      hasWifi: true,
      hasProjector: true,
      hasTV: false,
      hasAC: true,
      clientId: fikarClient.id,
    });
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
      phoneNumber: "0771234567",
      roleId: clientRole.id,
    });
    
    const luminaClient = await Client.create({
      userId: luminaUser.id,
      openingHours: "08:00:00",
      closingHours: "21:00:00",
      latitude: 32.0140,
      longitude: 35.8695,
    });

    await Room.create({
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
    });
    console.log("✅ LUMINA created with 1 room\n");

    // ============================================
    // CREATE PAST BOOKINGS FOR REVIEW TESTING
    // ============================================
    console.log("📍 Creating past bookings for review testing...");
    
    await Booking.bulkCreate([
      {
        customerId: ahmed.id,
        roomId: urukRooms[0].id,
        date: "2025-12-15",
        checkInTime: "09:00:00",
        checkOutTime: "12:00:00",
        totalPrice: 45,
        status: "approved",
      },
      {
        customerId: ahmed.id,
        roomId: wisdowRooms[0].id,
        date: "2025-12-20",
        checkInTime: "14:00:00",
        checkOutTime: "17:00:00",
        totalPrice: 45,
        status: "approved",
      },
      {
        customerId: sara.id,
        roomId: almujamRooms[0].id,
        date: "2025-12-28",
        checkInTime: "10:00:00",
        checkOutTime: "13:00:00",
        totalPrice: 30,
        status: "approved",
      },
      {
        customerId: sara.id,
        roomId: urukRooms[0].id,
        date: "2026-01-03",
        checkInTime: "08:00:00",
        checkOutTime: "11:00:00",
        totalPrice: 45,
        status: "approved",
      },
    ]);
    console.log("✅ Created 4 past approved bookings\n");

    // ============================================
    // CREATE REVIEWS
    // ============================================
    console.log("📍 Creating reviews...");
    
    await Review.bulkCreate([
      {
        userId: ahmed.id,
        clientId: urukClient.id,
        bookingId: 1,
        rating: 5,
        comment: "Excellent study space! Very clean and well-equipped.",
      },
      {
        userId: ahmed.id,
        clientId: wisdowClient.id,
        bookingId: 2,
        rating: 4,
        comment: "Great facilities, comfortable environment for studying.",
      },
      {
        userId: sara.id,
        clientId: almujamClient.id,
        bookingId: 3,
        rating: 5,
        comment: "Perfect for our group meeting, highly recommended!",
      },
      {
        userId: sara.id,
        clientId: urukClient.id,
        bookingId: 4,
        rating: 4,
        comment: "Good room with all necessary amenities.",
      },
    ]);
    console.log("✅ Created 4 reviews\n");

    // ============================================
    // CREATE NOTIFICATIONS
    // ============================================
    console.log("📍 Creating sample notifications...");
    
    await Notification.bulkCreate([
      {
        senderId: urukUser.id,
        receiverId: ahmed.id,
        message: "Your booking has been approved!",
        readAt: new Date("2025-12-14T10:00:00"),
        createdAt: new Date("2025-12-14T10:00:00"),
        updatedAt: new Date("2025-12-14T10:00:00"),
      },
      {
        senderId: wisdowUser.id,
        receiverId: ahmed.id,
        message: "Your booking has been approved!",
        readAt: new Date("2025-12-19T10:00:00"),
        createdAt: new Date("2025-12-19T10:00:00"),
        updatedAt: new Date("2025-12-19T10:00:00"),
      },
      {
        senderId: almujamUser.id,
        receiverId: sara.id,
        message: "Your booking has been approved!",
        readAt: new Date("2025-12-27T10:00:00"),
        createdAt: new Date("2025-12-27T10:00:00"),
        updatedAt: new Date("2025-12-27T10:00:00"),
      },
      {
        senderId: urukUser.id,
        receiverId: sara.id,
        message: "Your booking has been approved!",
        readAt: null, // unread
        createdAt: new Date("2026-01-02T10:00:00"),
        updatedAt: new Date("2026-01-02T10:00:00"),
      },
      {
        senderId: ahmed.id,
        receiverId: urukUser.id,
        message: "Thank you for the excellent service!",
        readAt: null, // unread
        createdAt: new Date("2025-12-15T14:00:00"),
        updatedAt: new Date("2025-12-15T14:00:00"),
      },
    ]);
    console.log("✅ Created 5 notifications\n");

    // ============================================
    // SUMMARY
    // ============================================
    console.log("========================================");
    console.log("🎉 COMPLETE DATABASE SEEDED SUCCESSFULLY!");
    console.log("========================================\n");
    
    console.log("📊 DATABASE SUMMARY:");
    console.log("  • 3 Roles (user, client, admin)");
    console.log("  • 1 Admin user");
    console.log("  • 3 Test users");
    console.log("  • 5 Study Houses (clients)");
    console.log("  • 12 Rooms total");
    console.log("  • 4 Past bookings for testing");
    console.log("  • 4 Reviews");
    console.log("  • 5 Notifications\n");

    console.log("🔐 LOGIN CREDENTIALS:\n");
    
    console.log("👨‍💼 ADMIN:");
    console.log("  Email: admin@ehjez.com");
    console.log("  Password: admin123\n");
    
    console.log("👤 TEST USERS:");
    console.log("  • ahmed@test.com / Test@2026 (2 bookings)");
    console.log("  • sara@test.com / Test@2026 (2 bookings)");
    console.log("  • mohammed@test.com / Test@2026\n");
    
    console.log("🏢 STUDY HOUSES (Client Login):");
    console.log("  1. URUK - uruk@gmail.com / Uruk@2026 (5 rooms)");
    console.log("  2. WISDOW - wisdow@gmail.com / Wisdw@2026 (3 rooms)");
    console.log("  3. المعجم - almujam@gmail.com / Almujam@2026 (2 rooms)");
    console.log("  4. FIKAR - fikar@gmail.com / Fikar@2026 (1 room)");
    console.log("  5. LUMINA - lumina@gmail.com / Lumina@2026 (1 room)\n");

    console.log("✅ Database is ready to use!");
    console.log("🚀 You can now run your application!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    console.error(error);
    process.exit(1);
  }
};

seedCompleteData();
