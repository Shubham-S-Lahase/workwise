const postgres = require("postgres");

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

const checkConnection = async () => {
  try {
    const result = await sql`SELECT 1 + 1 AS result`;
    if (result) {
      console.log("Database connected successfully:", result);
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = {
  sql,
  checkConnection,
};
