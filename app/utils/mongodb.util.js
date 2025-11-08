const { MongoClient } = require("mongodb");
const dotenv = require("dotenv"); // <--- THÊM DÒNG NÀY

dotenv.config(); // <--- đọc biến môi trường từ file .env

class MongoDB {
  static client;

  static async connect(uri = process.env.MONGODB_URI) {
    // <--- mặc định lấy từ .env
    if (this.client) return this.client;

    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB:", uri);
    return this.client;
  }
}

module.exports = MongoDB;
