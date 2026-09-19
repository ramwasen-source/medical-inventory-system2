const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    const result = await sql.query`
      SELECT Id, Username, PasswordHash, Role
      FROM Users
      WHERE Username = ${username}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }

    const user = result.recordset[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.PasswordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }

    const token = jwt.sign(
      {
        id: user.Id,
        username: user.Username,
        role: user.Role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.Id,
        username: user.Username,
        role: user.Role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

module.exports = router;