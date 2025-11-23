const express = require('express');
const { body, validationResult } = require('express-validator');
const { createMusic, getAllMusics, getMusicById, updateMusic, deleteMusic } = require('../controllers/musicController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

const musicValidation = [
    body('titulo').trim().notEmpty(),
    body('artista').trim().notEmpty(),
    body('genero').isIn(['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'R&B', 'Country', 'Metal', 'Reggae', 'Blues', 'Other']),
    body('duracao').isInt({ min: 1 }),
    body('dataLancamento').isISO8601()
];

router.get('/', getAllMusics);
router.get('/:id', getMusicById);
router.post('/', protect, musicValidation, validate, createMusic);
router.put('/:id', protect, musicValidation, validate, updateMusic);
router.delete('/:id', protect, deleteMusic);

module.exports = router;
