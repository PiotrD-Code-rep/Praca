const mongoose = require('mongoose');

const pozycjaSchema = new mongoose.Schema({
    transakcja: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transakcje',
        required: true,
    },
    produkt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produkty',
        required: true,
    },
    ilosc: {
        type: Number,
        required: true,
        min: 1,
    },
    cena: {
        type: Number,
        required: true,
    },
}, { collection: 'Zamowienie_Pozycja' });

module.exports = mongoose.model('Zamowienie_Pozycja', pozycjaSchema);
