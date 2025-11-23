const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    }
}, { timestamps: true });

// Hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) return next();
    this.senha = await bcrypt.hash(this.senha, 10);
    next();
});

// Compare password
userSchema.methods.matchPassword = async function(password) {
    return bcrypt.compare(password, this.senha);
};

module.exports = mongoose.model('User', userSchema);
