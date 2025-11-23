const express = require('express');
const { body, validationResult } = require('express-validator');
const { createAlbum, getAllAlbums, getAlbumById, updateAlbum, deleteAlbum } = require('../controllers/albumController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

const albumValidation = [
    body('titulo').trim().notEmpty(),
    body('artista').trim().notEmpty(),
    body('genero').isIn(['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'R&B', 'Country', 'Metal', 'Reggae', 'Blues', 'Other']),
    body('dataLancamento').isISO8601()
];

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.post('/', protect, albumValidation, validate, createAlbum);
router.put('/:id', protect, albumValidation, validate, updateAlbum);
router.delete('/:id', protect, deleteAlbum);

module.exports = router;
