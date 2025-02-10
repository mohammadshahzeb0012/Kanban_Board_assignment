const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model('User', UserSchema);

module.exports = {
    userModel,
    emailRegex
}