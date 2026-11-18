const os = require("os");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Student = require("../src/models/studentModel");

let mongoServer;

// Increase Jest timeout
jest.setTimeout(60000);

beforeAll(async () => {
  try {
    console.log("Starting MongoDB Memory Server...");

    mongoServer = await MongoMemoryServer.create();


    await mongoose.connect(mongoServer.getUri(), {
      runtimeAdapters: {
        os,
      },
    });

    console.log("Test MongoDB connected successfully");
  } catch (error) {
    console.error("Test database connection failed:", error);
    throw error;
  }
}, 60000);

// Clear collection after every test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Student.deleteMany({});
  }
});

// Close database and stop MongoDB
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }

  console.log("Test database disconnected");
}, 30000);
