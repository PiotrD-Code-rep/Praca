const {Zamowienie_Pozycja}=require('../models/Zamowienie_Pozycja')
const {Transakcje}=require('../models/Transakcje')
const {Produkty}=require('../models/Produkty')
const express= require('express');
const router=express.Router();
const {verifyToken ,isAdmin } = require('../middleware/auth')

// Wszystkie Zamowienie_Pozycja
router.get('/', verifyToken, isAdmin, async (req,res) => {
    try{
        const zamowienia = await Zamowienie_Pozycja.find();
        if (zamowienia){
            return res.status(200).json(zamowienia);
        } else {
            return res.status(404).json({ success: false, message: 'Nie znaleziono żadnych pozycji zamówień.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Wyszukiwanie pod ID Zamowienie_Pozycja
router.get('/:id', verifyToken, isAdmin, async (req,res) => {
    try{
        const zamowienie = await Zamowienie_Pozycja.findById(req.params.id);

        if (zamowienie){
            return res.status(200).json(zamowienie);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono pozycji zamówienia o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Aktualizacja Zamowienie_Pozycja
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try{
        const { transakcja, produkt, ilosc, cena } = req.body;

        // Walidacja transakcji
        const transakcjaDoc = await Transakcje.findById(transakcja);
        if (!transakcjaDoc){
            return res.status(400).json({ message: 'Niepoprawny identyfikator transakcji.' });
        };

        // Walidacja produktu
        const produktDoc = await Produkty.findById(produkt);
        if (!produktDoc){
            return res.status(400).json({ message: 'Niepoprawny identyfikator produktu.' });
        };

        // Aktualizacja Zamowienie_Pozycja
        const updatedZamowienie = await Zamowienie_Pozycja.findByIdAndUpdate(
            req.params.id,
            { transakcja, produkt, ilosc, cena },
            { new: true, runValidators: true }
        );

        if (updatedZamowienie){
            return res.status(200).json(updatedZamowienie);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono pozycji zamówienia do aktualizacji.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});


// Dodawanie Zamowienie_Pozycja
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try{
        const { transakcja, produkt, ilosc, cena } = req.body;

        // Walidacja transakcji
        const transakcjaDoc = await Transakcje.findById(transakcja);
        if (!transakcjaDoc){
            return res.status(400).json({ message: 'Niepoprawny identyfikator transakcji.' });
        };

        // Walidacja produktu
        const produktDoc = await Produkty.findById(produkt);
        if (!produktDoc){
            return res.status(400).json({ message: 'Niepoprawny identyfikator produktu.' });
        };

        const zamowienie = new Zamowienie_Pozycja({
            transakcja,
            produkt,
            ilosc,
            cena,
        });
        const savedZamowienie = await zamowienie.save();
        if (savedZamowienie){
            return res.status(201).json(savedZamowienie); 
        } else{
            return res.status(400).json({ success: false, message: 'Nie udało się dodać pozycji zamówienia.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Usuwanie Zamowienie_Pozycja
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try{
         const deletedZamowienie = await Zamowienie_Pozycja.findByIdAndDelete(req.params.id);
        if (deletedZamowienie){
            return res.status(200).json({ success: true, message: 'Pozycja zamówienia została pomyślnie usunięta.' });
        } else {
            return res.status(404).json({ success: false, message: 'Nie znaleziono pozycji zamówienia do usunięcia.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

module.exports=router;
