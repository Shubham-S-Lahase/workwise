const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { checkConnection } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const seatRoutes = require("./routes/seatRoutes");
const { hashPassword } = require("./utils/auth");
const { sql } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Train Booking API"));
app.use("/api/users", userRoutes);
app.use("/api/seats", seatRoutes);

const seedAdminUser = async () => {
  const adminUsername = "admin";
  const adminEmail = "shubhamlahase@gmail.com";
  const adminPassword = "admin@123";
  const adminRole = "admin";

  try {
    // Check if admin user already exists
    const existingAdmin = await sql`
        SELECT * FROM users WHERE username = ${adminUsername} AND role = ${adminRole};
      `;

    if (existingAdmin.length === 0) {
      // Hash the password and insert the admin user
      const hashedPassword = await hashPassword(adminPassword);
      await sql`
          INSERT INTO users (username, email, password, role) 
          VALUES (${adminUsername}, ${adminEmail}, ${hashedPassword}, ${adminRole});
        `;
      console.log("Default admin user created.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};
(async () => {
  await checkConnection();
  await seedAdminUser();
})();

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
