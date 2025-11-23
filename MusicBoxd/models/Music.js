const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    artista: { type: String, required: true, trim: true },
    genero: {
        type: String,
        required: true,
        enum: ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'R&B', 'Country', 'Metal', 'Reggae', 'Blues', 'Other']
    },
    duracao: { type: Number, required: true, min: 1 },
    dataLancamento: { type: Date, required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // rating system removed
}, { timestamps: true });

module.exports = mongoose.model('Music', musicSchema);
