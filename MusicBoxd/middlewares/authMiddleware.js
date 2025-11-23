const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado, token não fornecido'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Não autorizado, token inválido'
        });
    }
};

module.exports = { protect };
