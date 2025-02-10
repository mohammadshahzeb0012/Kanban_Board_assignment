const { boardModel } = require("../models/Board");

const getBoard = async (req, res) => {
    const ownerId = req.user.id
    try {
        // Each user has one board.
        const board = await boardModel.findOne({ owner: ownerId }).populate({
            path: 'lists',
            populate: { path: 'tasks' }
        });
        return res.status(200)
            .json(board);
    } catch (error) {
        return res.status(500)
            .json({ message: error.message });
    }
};

const updateBoard = async (req, res) => {
    try {
        const { title } = req.body;
        
        //validate title
        if (!title || title !== 'string' || title.length < 3) {
            return res.status(400)
                .json({ message: 'Invalid title' });
        }

        const board = await boardModel.findOneAndUpdate(
            { owner: req.user.id },
            { title },
            { new: true }
        );
        return res.json(board);
    } catch (error) {
        return res.status(500)
            .json({ message: error.message });
    }
};

module.exports = {
    getBoard,
    updateBoard
}