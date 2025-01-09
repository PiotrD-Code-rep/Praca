const mongoose=require('mongoose');

//Schemat produktu 
const produktySchemat=mongoose.Schema({
  nazwa_produktu:{
    type:String,
    required: true,
  },
  opis_produktu:{
    type:String,
    required: true,
  },
  cena:{
    type:Number,
    required: true, 
  },
  katygoria:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Katygorie',
    required: true,
  },
  stan_magazynowy:{
    type:Number,
    required: true,
    min: 0,
    max:400,
  },
  zdjecia_produktu:[{
    type:String,
  }],
  data_utworzenia:{
    type:Date,
    default:Date.now,
  },
  },{ collection: 'Produkty' })

exports.Produkty =mongoose.model("Produkty",produktySchemat)
