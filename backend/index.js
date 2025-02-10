const express = require("express")
const cors = require("cors")
const connectDB = require('./config/db');

// environment variables from .env file
require("dotenv").config()

//file imports
const authRoutes = require("./routes/authRoutes")
const boardRoutes = require("./routes/boardRoutes")
const listRoutes = require("./routes/listRoutes");
const taskRoutes = require("./routes/taskRoutes")
const isAuth = require("./middlewares/isAuth");

const app = express()

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// API Routes
app.use('/api/auth', authRoutes);
// protected routes
app.use('/api/board', isAuth, boardRoutes);
app.use('/api/lists', isAuth, listRoutes);
app.use('/api/tasks', isAuth, taskRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`server is ruuing on PORT ${PORT}`)
})