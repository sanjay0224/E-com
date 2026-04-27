const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  { 
    _id: new mongoose.Types.ObjectId("64f1a3c0a1b2c3d4e5f67891"),
    name: "Smartphone", 
    category: "Electronics", 
    price: 19999, 
    discount: 10, 
    rating: 4, 
    description: "Sleek smartphone with high-resolution display and great camera", 
    image: "/images/mob.jpg" 
  },
  { 
    _id: new mongoose.Types.ObjectId("64f1a3c0a1b2c3d4e5f67892"),
    name: "Laptop", 
    category: "Electronics", 
    price: 49999, 
    discount: 15, 
    rating: 5, 
    description: "High-performance laptop for gaming and productivity", 
    image: "/images/lap.jpg" 
  },
  { 
    _id: new mongoose.Types.ObjectId("64f1a3c0a1b2c3d4e5f67893"),
    name: "Headphones", 
    category: "Electronics", 
    price: 2999, 
    discount: 0,
    rating: 4, 
    description: "Wireless headphones with noise cancellation", 
    image: "/images/headphones.jpg" 
  },
  { 
    _id: new mongoose.Types.ObjectId("64f1a3c0a1b2c3d4e5f67894"),
    name: "Smart TV", 
    category: "Electronics", 
    price: 27999, 
    discount: 20, 
    rating: 3, 
    description: '42" 4K UHD Smart TV with streaming apps built-in', 
    image: "/images/tv.jpg" 
  },
  { 
    _id: new mongoose.Types.ObjectId("64f1a3c0a1b2c3d4e5f67895"),
    name: "Air Conditioner", 
    category: "Electronics", 
    price: 35999, 
    discount: 0,
    rating: 5, 
    description: "1.5 Ton Split AC with fast cooling technology", 
    image: "/images/ac.jpg" 
  },
  { 
    _id: new mongoose.Types.ObjectId("64f1a3c0a1b2c3d4e5f67896"),
    name: "Lipstick", 
    category: "Beauty", 
    price: 599, 
    discount: 5, 
    rating: 4, 
    description: "Long-lasting matte lipstick in various shades", 
    image: "/images/lipsticks.jpg" 
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected for Seeding");

    await Product.deleteMany({});
    console.log("🧹 Cleared existing products");

    await Product.insertMany(products);
    console.log("🌱 Successfully seeded products collection!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedDB();
