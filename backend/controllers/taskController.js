const mongoose = require("mongoose")
const { priorityEnums, taskModel } = require("../models/Task");
const { listModel } = require("../models/List");

const createTask = async (req, res) => {
    try {
        const { title, listId, description, dueDate, priority } = req.body;
        const payLoad = {}
        if (!title || typeof title !== 'string' || title.length < 3) {
            return res.status(400)
                .json({ message: 'Invalid title' });
        }
        payLoad.title = title

        if (!listId || !mongoose.Types.ObjectId.isValid(listId)) {
            return res.status(400)
                .json({ message: 'Invalid list id' });
        }
        payLoad.list = listId

        if (!priority || typeof priority !== 'string' || !priorityEnums.includes(priority?.toLowerCase())) {
            return res.status(400)
                .json({ message: 'Invalid priority' });
        }
        payLoad.priority = priority

        if (description) {
            if (typeof description !== 'string' || description.length < 3) {
                return res.status(400)
                    .json({ message: 'Invalid description' });
            }
            payLoad.description = description
        }

        if (dueDate) {
            payLoad.dueDate = dueDate
        }


        // Ensure the list exists
        const list = await listModel.findById(listId);
        if (!list) {
            return res.status(404)
                .json({ message: 'List not found' });
        }

        const task = await taskModel.create(payLoad);

        // Add the task to the list's tasks array
        list.tasks.push(task._id);
        await list.save();

        return res.status(201)
            .json(task);
    } catch (error) {
        return res.status(500)
            .json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority } = req.body;
        const payLoad = {}

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400)
                .json({ message: 'Invalid task id' });
        }

        if (title) {
            if (typeof title !== 'string' || title.length < 3) {
                return res.status(400)
                    .json({ message: 'Invalid title' });
            }
            payLoad.title = title
        }

        if (description) {
            if (typeof description !== 'string' || description.length < 3) {
                return res.status(400)
                    .json({ message: 'Invalid description' });
            }
            payLoad.description = description
        }

        if (dueDate) {
            payLoad.dueDate = dueDate
        }

        if (priority) {
            if (typeof priority !== 'string' || !priorityEnums.includes(priority?.toLowerCase())) {
                return res.status(400)
                    .json({ message: 'Invalid priority' });
            }
            payLoad.priority = priority
        }

        if (Object.keys(payLoad).length === 0) {
            return res.status(400)
                .json({ message: 'Atleast one field is required to update' });
        }

        const task = await taskModel.findByIdAndUpdate(
            id,
            payLoad,
            { new: true }
        );

        return res.json(task);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400)
                .json({ message: 'Invalid task id' });
        }

        // Start the transaction
        session.startTransaction();

        const task = await taskModel.findOneAndDelete({ _id: id }).session(session);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const listId = task.list;

        await listModel.updateOne(
            { _id: listId },
            { $pull: { tasks: task._id } },
            { session }
        );

        await session.commitTransaction();

        return res.status(200)
            .json({ message: 'Task deleted', task });
    } catch (error) {
        await session.abortTransaction();
        return res.status(500)
            .json({ message: error.message });
    } finally {
        session.endSession();
    }
};


const moveTask = async (req, res) => {
    try {
        const { taskId, newListId } = req.body;

        if (
            !taskId || !mongoose.Types.ObjectId.isValid(taskId) ||
            !newListId || !mongoose.Types.ObjectId.isValid(newListId)
        ) {
            return res.status(400)
                .json({ message: 'Invalid taskId or newListId' });
        }

        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404)
                .json({ message: 'Task not found' });
        }

        // Remove task from old list
        const oldList = await listModel.findById(task.list);

        if (!oldList) {
            return res.status(404)
                .json({ message: 'Old list not found' });
        }


        oldList.tasks = oldList.tasks.filter(id => id.toString() !== taskId);
        await oldList.save();


        // Add task to new list
        const newList = await listModel.findById(newListId);
        if (!newList) {
            return res.status(404)
                .json({ message: 'Destination list not found' });
        }

        newList.tasks.push(taskId);
        await newList.save();

        // Update task list reference
        task.list = newListId;
        await task.save();

        return res.json(task);
    } catch (error) {
        return res.status(500)
            .json({ message: error.message });
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    moveTask
}