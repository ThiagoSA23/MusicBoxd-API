const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    artista: { type: String, required: true, trim: true },
    genero: {
        type: String,
        required: true,
        enum: ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'R&B', 'Country', 'Metal', 'Reggae', 'Blues', 'Other']
    },
    dataLancamento: { type: Date, required: true },
    descricao: { type: String, trim: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // rating system removed
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
