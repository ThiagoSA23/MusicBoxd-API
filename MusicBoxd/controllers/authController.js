const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Usuário com este email já existe'
            });
        }

        const user = await User.create({
            nome,
            email,
            senha
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso',
            data: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        const user = await User.findOne({ email }).select('+senha');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
        }

        const isPasswordValid = await user.matchPassword(senha);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};
