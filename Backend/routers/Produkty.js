const { Katygorie } = require('../models/Katygorie');
const {Produkty}=require('../models/Produkty')
const express= require('express');
const router=express.Router();


//Wszystkie produkty 
router.get('/',(req, res) => {
 Produkty.find().select('nazwa_produktu cena zdjecia_produktu opis_produktu').then(produkty=>{
    if(produkty){
      return res.status(200).send(produkty);
    }else{
      return res.status(404).json({success:false,message:'Nie znaleziono'});
    }
  }).catch(err=>{
  res.status(400).json({message:'Błąd serwera', error:err});
  });
});

//Wyszukiwanie pod id produktu
router.get('/:id',(req,res) => {
  Produkty.findById(req.params.id).then(produkty => {
    if(produkty){
        return res.status(200).send(produkty);
    }else{
        return res.status(404).json({success:false,message:'Nie znaleziono produktu'});
    }
  }).catch(err=>{
    res.status(400).json({message:'Błąd serwera', error:err});
  });
});

//Aktualizacja produktu
router.put('/:id',(req,res) => {
  //Walidacjia Katygori
  Katygorie.findById(req.body.katygoria).then(katygoria=>{
    if(!katygoria){
      return res.status(400).send('Nie poprwna katygoria');
    }
  })
  Produkty.findByIdAndUpdate(
    req.params.id,
    {
      nazwa_produktu: req.body.nazwa_produktu,
      opis_produktu:req.body.opis_produktu,
      cena:req.body.cena,
      katygoria: req.body.katygoria,
      stan_magazynowy:req.body.stan_magazynowy,
      zdjecia_produktu:req.body.zdjecia_produktu,
    },{new: true}
    ).then(produkty=>{
      if(produkty){
        return res.status(200).send(produkty);
      }else{
        return res.status(404).json({success:false,message:'Nie zaktualizowano'});
      }
    }).catch(err=>{
    res.status(400).json({message:'Błąd serwera', error:err});
    });
})


// Dodwanie produktu
router.post('/',(req, res) => {
  //Walidacjia Katygori
  Katygorie.findById(req.body.katygoria).then(katygoria=>{
    if(!katygoria){
      return res.status(400).send('Nie poprwna katygoria');
    }
  })

 const produkty = new Produkty ({
    nazwa_produktu: req.body.nazwa_produktu,
    opis_produktu:req.body.opis_produktu,
    cena:req.body.cena,
    katygoria: req.body.katygoria,
    stan_magazynowy:req.body.stan_magazynowy,
    zdjecia_produktu:req.body.zdjecia_produktu,
  });
  produkty.save().then(produkty=>{
    if(produkty){
        return res.status(200).send(produkty);
    }else{
        return res.status(404).json({success:false,message:'Nie dodano produktu'});
    }
  }).catch(err=>{
    res.status(400).json({message:'Błąd serwera', error:err});
  });
})


router.delete('/:id',(req,res)=>{
  Produkty.findByIdAndDelete(req.params.id)
      .then(produkty=>{
          if(produkty){
              return res.status(200).json({success:true,message:'Usunieto katygorie'})
          }else{
              return res.status(404).json({success:false,message:'Nie znaleziono katygori'})
          }
      }).catch(err=>{
          return res.status(400).json({success:false,error:err})
      })
})
  
module.exports=router;