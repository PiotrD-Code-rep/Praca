const {Uzytkownicy}=require('../models/Uzytkownicy')
const express= require('express');
const router=express.Router();
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET='4d2c9d17ab134f5eacee0f1c8bb9ff8e17c93d5b7b62280729a5a9f8dc6013a77c12e0bde6b68ab3c07e8f5e1bcd68df2e5747c1e1db4d349b9f1f9ad3b3e8b4';

//Wyszyscy uzytkownicy
router.get('/',(req,res)=>{
    Uzytkownicy.find().select('-haslo')
        .then(uzytkownicy=>{
            if(uzytkownicy){
                return res.status(200).send(uzytkownicy);
            }else{
              return res.status(404).json({success:false,message:'Nie znaleziono'});
            }
          }).catch(err=>{
          res.status(400).json({message:'Błąd serwera', error:err});
          });
});
//Wyszukiwanie pod id Uzytkowanika
router.get('/:id',(req,res)=>{
    Uzytkownicy.findById(req.params.id).select('-haslo')
    .then(uzytkownicy=>{
        if(uzytkownicy){
            return res.status(200).send(uzytkownicy);
        }else{
            return res.status(404).json({success:false,message:'Nie znaleziono katygori'});
        }
    }).catch(err=>{
        return res.status(400).json({message:'Błąd serwera',error:err});
    });
});

//Dowanie Użytkownika
router.post('/',(req, res) => {
   const uzytkownicy = new Uzytkownicy ({
      imie: req.body.imie,
      nazwisko:req.body.nazwisko,
      email:req.body.email,
      haslo: bcrypt.hashSync(req.body.haslo,10),
      admin:req.body.admin,
      adres:req.body.adres,
    });
    uzytkownicy.save().then(uzytkownicy=>{
      if(uzytkownicy){
          return res.status(200).send(uzytkownicy);
      }else{
          return res.status(404).json({success:false,message:'Nie dodano uzytkownicy'});
      }
    }).catch(err=>{
      res.status(400).json({message:'Błąd serwera', error:err});
    });
});

//Ogrniete z https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49
// User login
router.post('/Logowanie', async (req, res) => {
 try {
    const { email, haslo} = req.body;
    const user = await Uzytkownicy.findOne({ email });

    if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(haslo, user.haslo);

    if (!passwordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ userId: user._id, admin: user.admin  }, JWT_SECRET, {expiresIn: '1h',});
    
    res.status(200).json({user:user.email,token: token });
    }catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }
});
router.post('/Rejestracja',(req, res) => {
    const uzytkownicy = new Uzytkownicy ({
       imie: req.body.imie,
       nazwisko:req.body.nazwisko,
       email:req.body.email,
       haslo: bcrypt.hashSync(req.body.haslo,10),
       admin:req.body.admin,
       adres:req.body.adres,
     });
     uzytkownicy.save().then(uzytkownicy=>{
       if(uzytkownicy){
           return res.status(200).send(uzytkownicy);
       }else{
           return res.status(404).json({success:false,message:'Nie dodano uzytkownicy'});
       }
     }).catch(err=>{
       res.status(400).json({message:'Błąd serwera', error:err});
     });
 });
module.exports=router;
