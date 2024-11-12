const mongoose=require('mongoose');

const katygorieSchemat=mongoose.Schema({
nazwa_katygori:{
    type:String,
    required:true,
},
opis_katygori:{
    type:String,
    required:true,
},
dla_kogo:{
    type:String,
    enum: ["mezczyzna", "kobieta", "dziecko"],
},
marka:{
    type:String,
    enum: ["Nike", "Apple", "Samsung"], 
},
},{collection: 'Katygorie'})

exports.Katygorie =mongoose.model("Katygorie",katygorieSchemat)