const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const mongoose = require('mongoose')
const router = express.Router()

// OTP and reset OTP collections (written by n8n)
const Otp = mongoose.connection.collection('otps')
const ResetCodes = mongoose.connection.collection('reset-codes')

// Helper: sign JWT
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  )
}

// 1. Verify OTP (signup)
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP required' })
  const record = await Otp.findOne({ email, otp })
  if (!record) return res.status(400).json({ msg: 'Invalid OTP' })
  res.json({ success: true })
})

// 2. Register user (after OTP)
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, age, gender, occupation, city, state, phone } = req.body
  if (!email || !password) return res.status(400).json({ msg: 'Email and password required' })
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ msg: 'User already exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = new User({ email, password: hash, firstName, lastName, age, gender, occupation, city, state, phone })
  await user.save()
  res.json({ success: true })
})

// 3. Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ msg: 'User not found' })
  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ msg: 'Incorrect password' })
  const token = signToken(user)
  res.json({ token, user: { email: user.email, firstName: user.firstName, lastName: user.lastName } })
})

// 4. Verify reset OTP
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP required' })
  const record = await ResetCodes.findOne({ email, otp })
  if (!record) return res.status(400).json({ msg: 'Invalid OTP' })
  res.json({ success: true })
})

// 5. Reset password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body
  if (!email || !newPassword) return res.status(400).json({ msg: 'Email and new password required' })
  const hash = await bcrypt.hash(newPassword, 10)
  const user = await User.findOneAndUpdate({ email }, { password: hash })
  if (!user) return res.status(404).json({ msg: 'User not found' })
  res.json({ success: true })
})

module.exports = router