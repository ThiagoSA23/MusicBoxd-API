const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

router.post('/register', [
    body('nome').trim().notEmpty(),
    body('email').isEmail(),
    body('senha').isLength({ min: 6 })
], validate, register);

router.post('/login', [
    body('email').isEmail(),
    body('senha').notEmpty()
], validate, login);

module.exports = router;
