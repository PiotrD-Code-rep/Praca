const mongoose=require('mongoose');
// const { Uzytkownicy } = require('./Uzytkownicy');

const zamowieniaSchemat=mongoose.Schema({
uzytkownicy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Uzytkownicy',
    required: true,
},
produkt: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Produkty', required: true },
    quantity: { type: Number, required: true },
}],
kwota:{
    type: Number, 
    required: true
},
data_utworzenia:{
    type:Date,
    default:Date.now,
},

},{collection: 'Zamowienia'})

exports.Zamowienia =mongoose.model("Zamowienia",zamowieniaSchemat)