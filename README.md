E-Com – Full Stack E-Commerce Application

A full-stack e-commerce web application built with modern web technologies. This project includes user authentication, product management, cart functionality, and a responsive user interface for a smooth shopping experience.

**Features**

User Authentication (JWT)
Product Listing and Details
Add to Cart / Remove from Cart
Wishlist Functionality
Search and Filter Products
Responsive Design
REST API Integration
Tech Stack
Frontend
React.js
Next.js
Tailwind CSS
Backend
Node.js
Express.js
Database
MongoDB

**Project Structure**
E-com/
│
├── client/          # Frontend
├── server/          # Backend
├── components/      # Reusable UI Components
├── pages/           # Application Pages
├── public/          # Static Assets
└── README.md

**Installation**
Clone the Repository
git clone https://github.com/sanjay0224/E-com.git

Navigate to the Project
cd E-com

Install Dependencies
Frontend
cd client
npm install

Backend
cd server
npm install
Environment Variables

Create a .env file inside the server directory.

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
Run the Application

Start Backend
cd server
npm start

Start Frontend
cd client
npm run dev

**Future Improvements**Payment Gateway Integration
Admin Dashboard
Order History
Product Reviews and Ratings
Inventory Management
Contributing
Fork the repository
Create a new branch
git checkout -b feature-name
Commit changes
git commit -m "Added new feature"
Push to GitHub
git push origin feature-name
Create a Pull Request

Author
Developed by Sanjay Kumar
