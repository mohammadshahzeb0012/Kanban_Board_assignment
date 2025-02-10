const generateToken = require('../utils/generateToken');
const { emailRegex, userModel } = require('../models/User');
const { boardModel } = require('../models/Board');
const { default: mongoose } = require('mongoose');
const { listModel, init } = require('../models/List');

const register = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        let { email, password, fullName } = req.body;

        // Checking email, password, and fullName availability
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All required data must be provided' });
        }

        // Checking if they are strings
        if (typeof email !== 'string' || typeof password !== 'string' || typeof fullName !== 'string') {
            return res.status(400).json({ message: 'Invalid data' });
        }

        // Trim input values to remove accidental spaces
        email = email.trim();
        password = password.trim();
        fullName = fullName.trim();

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Check if user already exists
        let userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        session.startTransaction();

        // Create new user instance
        const user = new userModel({ fullName, email, password });

        // Save user to the database
        await user.save({ session });

        // Create a default board for the user
        const initBoard = new boardModel({
            owner: user._id
        });

        const boardId = initBoard._id;
        // By default, user gets 3 lists
        const lists = [
            { title: 'To-Do', board: boardId },
            { title: 'In-Progress', board: boardId },
            { title: 'Done', board: boardId }
        ];

        // Save the lists in the database
        const savedLists = await listModel.insertMany(lists, { session });
        const listIds = savedLists.map(list => list._id);

        // Assign listIds to the board
        initBoard.lists = listIds;

        // Save the board to the database
        await initBoard.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        return res.status(201).json({
            message: "User registration successful",
            token: generateToken(user._id),
            user: { id: user._id, email: user.email },
            board: initBoard,
        });

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
};



const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        // Checking email and password are available or not
        if (!email || !password) {
            return res.status(400)
                .json({ message: 'Email and password must be provided' });
        }

        // Checking email and password are strings
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400)
                .json({ message: 'Invalid email or password ' });
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400)
                .json({ message: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400)
                .json({ message: 'Invalid email or password' });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Get user's board
        const board = await boardModel.findOne({ owner: user._id });

        return res.json({
            token: generateToken(user._id),
            user: { id: user._id, email: user.email },
            board,
        });
    } catch (error) {
        return res.status(500)
            .json({ message: error.message });
    }
};

module.exports = {
    register,
    login
}