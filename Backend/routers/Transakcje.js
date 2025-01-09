const {Transakcje}=require('../models/Transakcje')
const {Uzytkownicy}= require('../models/Uzytkownicy')
const express= require('express');
const router=express.Router();
const {verifyToken ,isAdmin } = require('../middleware/auth')

// Wszystkie Transakcje
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try{
        const transakcje = await Transakcje.find();
        if (transakcje){
            return res.status(200).json(transakcje);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono żadnych transakcji.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
})

// Wyszukiwanie pod ID Transakcji
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
    try{
        const transakcja = await Transakcje.findById(req.params.id);

        if (transakcja){
            return res.status(200).json(transakcja);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono transakcji o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Aktualizacja Transakcji
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try{
        const { typ_transakcji, uzytkownik, kwota } = req.body;

        // Walidacja użytkownika
        if (!uzytkownik){
            return res.status(400).json({ message: 'Pole "uzytkownik" jest wymagane.' });
        }

        const uzytkownikDoc = await Uzytkownicy.findById(uzytkownik);
        if (!uzytkownikDoc){
            return res.status(400).json({ message: 'Niepoprawny identyfikator użytkownika.' });
        }

        // Aktualizacja Transakcji
        const updatedTransakcja = await Transakcje.findByIdAndUpdate(
            req.params.id,
            { typ_transakcji, uzytkownik, kwota },
            { new: true, runValidators: true }
        );

        if (updatedTransakcja){
            return res.status(200).json(updatedTransakcja);
        } else {
            return res.status(404).json({ success: false, message: 'Nie znaleziono transakcji do aktualizacji.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Dodawanie Transakcji
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try{
        const { typ_transakcji, uzytkownik, kwota } = req.body;

        // Sprawdzenie wymaganych pól
        if (!typ_transakcji || !uzytkownik || kwota === undefined){
            return res.status(400).json({ message: 'Pola "typ_transakcji", "uzytkownik" i "kwota" są wymagane.' });
        }

        // Walidacja użytkownika
        const uzytkownikDoc = await Uzytkownicy.findById(uzytkownik);
        if (!uzytkownikDoc){
            return res.status(400).json({ message: 'Niepoprawny identyfikator użytkownika.' });
        }

        const transakcja = new Transakcje({
            typ_transakcji,
            uzytkownik,
            kwota,
        });

        const savedTransakcja = await transakcja.save();
        if (savedTransakcja){
            return res.status(201).json(savedTransakcja);
        } else{
            return res.status(400).json({ success: false, message: 'Nie udało się dodać transakcji.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});;

// Usuwanie Transakcji
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try{
        const deletedTransakcja = await Transakcje.findByIdAndDelete(req.params.id);
        if (deletedTransakcja){
            return res.status(200).json({ success: true, message: 'Transakcja została pomyślnie usunięta.' });
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono transakcji do usunięcia.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});


module.exports=router;
