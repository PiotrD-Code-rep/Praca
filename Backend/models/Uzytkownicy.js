const mongoose=require('mongoose');
// const { Zamowienia } = require('./Zamowienia');

const uzytkownicySchemat=mongoose.Schema({
    imie:{
        type:String,
        required: true,
      },
    nazwisko:{
        type:String,
        required: true,
      },
    email:{
        type:String,
        required: true,   
      },
    haslo:{
        type:String,
        required: true,   
    },
    admin:{
        type:Boolean,
        default: false,
    },
    adres:{
        ulica: String,
        miejscowosc:String,
        kod_pocztowy:String,
        panstwo:String
    },
    zamowienia:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Zamowienia',
    }],
    data_utworzenia:{
        type:Date,
        default:Date.now,
    },
},{collection: 'Uzytkownicy'})

exports.Uzytkownicy =mongoose.model("Uzytkownicy",uzytkownicySchemat)