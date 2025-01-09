const dotenv = require('dotenv');
dotenv.config();
const {Uzytkownicy}=require('../models/Uzytkownicy')
const express= require('express');
const router=express.Router();
const bcrypt= require('bcryptjs');
const {createAccessToken,sendAccessToken}= require('../helpers/token');
const {verifyToken ,isAdmin } = require('../middleware/auth')

// Wszystkie użytkownicy
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try{
        const uzytkownicy = await Uzytkownicy.find().select('-haslo');
        if (uzytkownicy){
            return res.status(200).json(uzytkownicy);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono użytkowników.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Wyszukiwanie pod ID użytkownika
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
    try{
        const uzytkownik = await Uzytkownicy.findById(req.params.id).select('-haslo');
        if (uzytkownik){
            return res.status(200).json(uzytkownik);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono użytkownika o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Dodawanie użytkownika
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try{
        const { imie, nazwisko, email, haslo, adres } = req.body;
        // Sprawdzenie wymaganych pól
        if (!imie || !nazwisko || !email || !haslo || !adres){
            return res.status(400).json({ message: 'Pola "imie", "nazwisko", "email", "haslo" i "adres" są wymagane.' });
        }

        // Sprawdzenie, czy użytkownik o podanym email już istnieje
        const existUzytkownik = await Uzytkownicy.findOne({ email });
        if (existUzytkownik) {
            return res.status(400).json({ message: 'Użytkownik o podanym email już istnieje.' });
        }
        // Hashowanie hasła
        const hashHaslo = await bcrypt.hash(haslo, 10);
        const newUzytkownik = new Uzytkownicy({
            imie,
            nazwisko,
            email,
            haslo: hashHaslo,
            adres,
        });

        const savedUzytkownik = await newUzytkownik.save();
        if (savedUzytkownik){
            return res.status(201).json(savedUzytkownik); 
        } else{
            return res.status(400).json({ success: false, message: 'Nie udało się dodać użytkownika.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Edycja użytkownika
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try{
        const { imie, nazwisko, email, haslo, adres } = req.body;
        if (!imie || !nazwisko || !email || !adres){
            return res.status(400).json({ message: 'Pola "imie", "nazwisko", "email" i "adres" są wymagane.' });
        }
        const updatedData = {
            imie,
            nazwisko,
            email,
            adres,
        };
        if (haslo){
            updatedData.haslo = await bcrypt.hash(haslo, 10);
        }
        const updatedUser = await Uzytkownicy.findByIdAndUpdate(req.params.id, updatedData, { new: true }).select('-haslo');
        if (updatedUser){
            return res.status(200).json(updatedUser);
        } else{
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Usuwanie użytkownika
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try{
        const deletedUser = await Uzytkownicy.findByIdAndDelete(req.params.id);
        if (deletedUser){
            return res.status(200).json({ message: 'Użytkownik został usunięty.' });
        } else{
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

// Logowanie użytkownika
router.post('/Logowanie', async (req, res) => {
    try{
        const { email, haslo } = req.body;
        // Sprawdzenie, czy email i hasło są dostarczone
        if (!email || !haslo){
            return res.status(400).json({ error: 'Email i hasło są wymagane.' });
        }

        const user = await Uzytkownicy.findOne({ email });

        if (!user){
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
        }

        const passwordMatch = await bcrypt.compare(haslo, user.haslo);
        if (!passwordMatch){
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
        }

        const token = createAccessToken(user._id, user.admin);
        console.log('Serwerowy czas teraz:', new Date().toISOString());
        // console.log('Czas wygaśnięcia tokena:', new Date(Date.now() + 3600 * 1000).toISOString());
        sendAccessToken(res,token);
    }catch (error){
        res.status(500).json({ error: 'Błąd podczas logowania.' });
    }
});

// Rejestracja użytkownika
router.post('/Rejestracja', async (req, res) => {
    try{
        const { imie, nazwisko, email, haslo,  adres } = req.body;
        // Sprawdzenie wymaganych pól
        if (!imie || !nazwisko || !email || !haslo || !adres){
            return res.status(400).json({ message: 'Pola "imie", "nazwisko", "email", "haslo"  i "adres" są wymagane.' });
        }
        // Sprawdzenie, czy użytkownik o podanym email już istnieje
        const existUzytkownik = await Uzytkownicy.findOne({ email });
        if (existUzytkownik){
            return res.status(400).json({ message: 'Użytkownik o podanym email już istnieje.' });
        }
        // Hashowanie hasła
        const hashHaslo = await bcrypt.hash(haslo, 10);
        const newUzytkownik = new Uzytkownicy({
            imie,
            nazwisko,
            email,
            haslo: hashHaslo,
            adres,
        });

        const savedUzytkownik = await newUzytkownik.save();
        if (savedUzytkownik){
            return res.status(201).json(savedUzytkownik); 
        } else{
            return res.status(400).json({ success: false, message: 'Nie udało się dodać użytkownika.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
});

module.exports=router;
