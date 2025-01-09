const { Katygorie } = require('../models/Katygorie');
const {Produkty}=require('../models/Produkty')
const express= require('express');
const router=express.Router();
const {verifyToken ,isAdmin } = require('../middleware/auth')

// Wszystkie produkty
router.get('/', async (req, res) => {
  try{
      const produkty = await Produkty.find().select('nazwa_produktu cena zdjecia_produktu opis_produktu');
      if (produkty){
          return res.status(200).json(produkty);
      } else {
          return res.status(404).json({ success: false, message: 'Nie znaleziono produktów.' });
      }
  }catch (err){
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
  }
});

// Wyszukiwanie pod ID produktu
router.get('/:id', async (req, res) => {
  try{
      const produkt = await Produkty.findById(req.params.id).select('nazwa_produktu cena zdjecia_produktu opis_produktu katygoria stan_magazynowy');
      if (produkt){
          return res.status(200).json(produkt);
      } else{
          return res.status(404).json({ success: false, message: 'Nie znaleziono produktu o podanym ID.' });
      }
  }catch (err){
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
  }
});

// Aktualizacja produktu
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try{
      const { katygoria, nazwa_produktu, opis_produktu, cena, stan_magazynowy, zdjecia_produktu } = req.body;
      // Walidacja kategorii
      const katygoriaDoc = await Katygorie.findById(katygoria);
      if (!katygoriaDoc){
          return res.status(400).json({ message: 'Niepoprawny identyfikator kategorii.' });
      }

      // Aktualizacja produktu
      const updatedProdukt = await Produkty.findByIdAndUpdate(
          req.params.id,
          {
              nazwa_produktu,
              opis_produktu,
              cena,
              katygoria,
              stan_magazynowy,
              zdjecia_produktu,
          },
          { new: true, runValidators: true }
      );

      if (updatedProdukt){
          return res.status(200).json(updatedProdukt);
      } else{
          return res.status(404).json({ success: false, message: 'Nie znaleziono produktu do aktualizacji.' });
      }
  }catch (err){
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
  }
});

// Dodawanie produktu
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try{
      const { katygoria, nazwa_produktu, opis_produktu, cena, stan_magazynowy, zdjecia_produktu } = req.body;

      // Sprawdzenie wymaganych pól
      if (!katygoria || !nazwa_produktu || !opis_produktu || cena === undefined || stan_magazynowy === undefined){
          return res.status(400).json({ message: 'Pola "katygoria", "nazwa_produktu", "opis_produktu", "cena", "stan_magazynowy" są wymagane.' });
      }
      // Walidacja kategorii
      const katygoriaDoc = await Katygorie.findById(katygoria);
      if (!katygoriaDoc){
          return res.status(400).json({ message: 'Niepoprawny identyfikator kategorii.' });
      }
      // Tworzenie nowego produktu
      const produkt = new Produkty({
          katygoria,
          nazwa_produktu,
          opis_produktu,
          cena,
          stan_magazynowy,
          zdjecia_produktu,
      });

      const savedProdukt = await produkt.save();
      if (savedProdukt){
          return res.status(201).json(savedProdukt);
      } else{
          return res.status(400).json({ success: false, message: 'Nie udało się dodać produktu.' });
      }
  }catch (err){
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
  }
});

// Usuwanie produktu
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try{
      const deletedProdukt = await Produkty.findByIdAndDelete(req.params.id);
      if (deletedProdukt){
          return res.status(200).json({ success: true, message: 'Produkt został pomyślnie usunięty.' });
      } else{
          return res.status(404).json({ success: false, message: 'Nie znaleziono produktu do usunięcia.' });
      }
  }catch (err){
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
  }
});
  
module.exports=router;