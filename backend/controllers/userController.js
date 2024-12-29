const { sql } = require("../config/db");
const {
  hashPassword,
  comparePasswords,
  generateToken,
} = require("../utils/auth");

// Signup Controller
const signupController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    // Check if the username or email already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE username = ${username} OR email = ${email};
    `;

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    const hashedPassword = await hashPassword(password);

    await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${hashedPassword})
    `;

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Login Controller
const loginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await comparePasswords(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken({ id: user[0].id, role: user[0].role });
    res.status(200).json({ token, role: user[0].role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = { signupController, loginController };
