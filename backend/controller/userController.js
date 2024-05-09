const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../model/User');

const secrettKey = process.env.SECRET
const Register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) res.status(400).json({
      status: false,
      message: "All fields are required"
    })
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ status: true, user: user });
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ status: false, message: 'Internal server error', error: error });

  }
}

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, secrettKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id }, secrettKey, { expiresIn: '365d' });
    res.json({ status: true, token: token, refreshToken: refreshToken });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ status: false, message: 'Internal server error', error: error });
  }
}

const GetUser = async (req, res) => {

  const id = req.params.id;
  console.log("getting user details", id);
  try {
    let user;
    if (id.includes("@")) {
      user = await User.findOne({ where: { email: id } });
    }
    else
      user = await User.findOne({ where: { id: id } });
    if (!user) {
      res.status(404).json({ status: false, message: "invalid userId or EmailId provided" });
    } else {
      res.status(200).json({ status: true, message: "user details fetched successfully", user: user });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ status: false, message: 'Internal server error', error: error });
  }
}

const UpdateUser = async (req, res) => {
  const id = req.params.id;
  const { username, email, password } = req.body;
  try {
    let user;
    if (id.includes("@")) {
      user = await User.findOne({ where: { email: id } });
    }
    else
      user = await User.findOne({ where: { id: id } });
    // const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
    } else {
      user.username = username || user.username;
      user.email = email || user.email;
      user.password = password ? await bcrypt.hash(password, 10) : user.password;
      await user.save();
      res.status(200).json({ status: true, message: "user details updated successfully", user: user });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ status: false, message: 'Internal server error', error: error });
  }
}

const GetAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ status: true, users: users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ status: false, message: 'Internal server error', error: error });
  }
}


const DeleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    let user;
    if (id.includes("@")) {
      user = await User.findOne({ where: { email: id } });
    }
    else
      user = await User.findOne({ where: { id: id } });
    // const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
    } else {
      await user.destroy();
      res.status(200).json({ status: true, message: "User deleted successfully" });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: false, message: 'Internal server error', error: error });
  }
}


const GetAccessToken = (req, res) => {
  const { refreshToken } = req.body
  try {
    if (!refreshToken)
      res.status(400).json({
        status: false,
        message: "refresh token not found"
      })
    else {
      jwt.verify(refreshToken, process.env.SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid token' });
        }
        else {
          const _id = decoded.userId
          const user = await User.findOne({ where: { id: _id } });

          if (!user)
            return res.status(400).json({ status: "failed", message: "Invalid Token" })
          else {
            const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '1h' });
            return res.json({
              status : true,
              token : token
            })

          }
        }

      })
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message })
  }
}



module.exports = { Register, Login, GetUser, UpdateUser, GetAllUsers, DeleteUser, GetAccessToken }


