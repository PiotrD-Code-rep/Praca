const {Katygorie}=require('../models/Katygorie')
const express= require('express');
const router=express.Router();

//Wszystkie Katygorie
router.get('/',(req,res)=>{
    Katygorie.find()
    .then(katygorie=>{
        if(katygorie){
            return res.status(200).send(katygorie);
        }else{
            return res.status(404).json({success:false,message:'Nie znaleziono katygori'});
        }
    }).catch(err=>{
        return res.status(400).json({message:'Błąd serwera',error:err})
    })
})

//Wyszukiwanie pod id Katygori
router.get('/:id',(req,res)=>{
    Katygorie.findById(req.params.id)
    .then(katygorie=>{
        if(katygorie){
            return res.status(200).send(katygorie);
        }else{
            return res.status(404).json({success:false,message:'Nie znaleziono katygori'});
        }
    }).catch(err=>{
        return res.status(400).json({message:'Błąd serwera',error:err})
    })
})

//Aktualizacja katygori
router.put('/:id',(req,res)=>{
    Katygorie.findByIdAndUpdate(
        req.params.id,
        {
            nazwa_katygori:req.body.nazwa_katygori,
            opis_katygori:req.body.opis_katygori,
            dla_kogo:req.body.dla_kogo,
            marka:req.body.marka,
        },{new: true}
    ).then(katygorie=>{
        if(katygorie){
            return res.status(200).send(katygorie);
        }else{
            return res.status(404).json({success:false,message:'Nie znaleziono katygori'});
        }
    }).catch(err=>{
        return res.status(400).json({message:'Błąd serwera',error:err})
    })
    
})

//Dodawanie Katygorii
router.post('/',(req,res)=>{
    const katygorie= new Katygorie({
        nazwa_katygori:req.body.nazwa_katygori,
        opis_katygori:req.body.opis_katygori,
        dla_kogo:req.body.dla_kogo,
        marka:req.body.marka,
    })
    katygorie.save().then(katygorie=>{
        if(katygorie){
            return res.status(200).send(katygorie);
        }else{
            return res.status(404).json({success:false,message:'Nie dodano katygori'});
        }
    }).catch(err=>{
        res.status(400).json({message:'Błąd serwera', error:err});
    });
})

//Usuwannie Katygori
router.delete('/:id',async(req,res)=>{
    Katygorie.findByIdAndDelete(req.params.id)
        .then(katygorie=>{
            if(katygorie){
                return res.status(200).json({success:true,message:'Usunieto katygorie'});
            }else{
                return res.status(404).json({success:false,message:'Nie znaleziono katygori'});
            }
        }).catch(err=>{
            return res.status(400).json({message:'Błąd serwera',error:err});
        })
})

module.exports=router;
