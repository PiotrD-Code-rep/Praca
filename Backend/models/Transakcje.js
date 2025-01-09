const mongoose = require('mongoose');

const transakcjeSchema = new mongoose.Schema({
    typ_transakcji: {
        type: String,
        enum: ['zakup', 'dostawa'], // Możesz dodać więcej typów, np. "zwrot"
        required: true,
    },
    uzytkownik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Uzytkownicy',
        required: function () {
            return this.typ_transakcji === 'zakup'; // Użytkownik wymagany tylko dla zakupów
        },
    },
    kwota: {
        type: Number,
        required: false, // Opcjonalne w przypadku np. dostaw
    },
    data_transakcji: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'Transakcje' });

module.exports = mongoose.model('Transakcje', transakcjeSchema);
