const dotenv = require("dotenv");
dotenv.config();


const express = require("express");
const cors = require("cors");
const { checkConnection } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  await checkConnection();
})();

app.get("/", (req, res) => res.send("Train Booking API"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
