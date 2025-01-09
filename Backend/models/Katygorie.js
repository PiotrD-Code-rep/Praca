const mongoose=require('mongoose');

const katygorieSchemat=mongoose.Schema({
nazwa_katygori:{
    type:String,
    required:true,
},
},{collection: 'Katygorie'})

exports.Katygorie =mongoose.model("Katygorie",katygorieSchemat)