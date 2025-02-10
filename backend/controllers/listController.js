const mongoose = require("mongoose")
const { boardModel } = require("../models/Board");
const { listModel } = require("../models/List");
const { taskModel } = require("../models/Task");

const createList = async (req, res) => {

    try {
        const { title } = req.body;

        if (!title || typeof title !== 'string' || title.length < 3) {
            return res.status(400)
                .json({ message: 'Invalid title' });
        }

        // Find the board associated with the user
        const board = await boardModel.findOne({ owner: req.user.id });
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        // Create new list
        const list = await listModel.create({ title, board: board._id });

        // Add the list to the board's lists array
        board.lists.push(list._id);
        await board.save();

        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateList = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        //validate title
        if (!title || typeof title !== 'string' || title.length < 3) {
            return res.status(400)
                .json({ message: 'Invalid title' });
        }

        //validate id
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400)
                .json({ message: 'Invalid list id' });
        }

        const list = await listModel.findByIdAndUpdate(id, { title }, { new: true });
        return res.json(list);
    } catch (error) {
        return res.status(500)
            .json({ message: error.message });
    }
};

const deleteList = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400)
                .json({ message: 'Invalid list id' });
        }

        const taskIds = await taskModel.aggregate([
            {
                $match: { list: new mongoose.Types.ObjectId(id) }
            },
            {
                $project: {
                    _id: 1
                }
            }
        ])

        // delete all tasks related to this list list if available
        if (taskIds && taskIds.length > 0) {
            await taskModel.deleteMany({ _id: { $in: taskIds } })
        }

        const list = await listModel.findByIdAndDelete(id);
        return res.json({ message: 'List deleted', list });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createList,
    updateList,
    deleteList
}