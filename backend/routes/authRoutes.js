// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

router.get("/",(req,res)=>{
    return res.send("server  is ruuning")
})

// POST /api/auth/login
router.post('/login', login);

module.exports = router;