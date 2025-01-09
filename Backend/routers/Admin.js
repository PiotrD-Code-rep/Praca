const dotenv = require('dotenv');
dotenv.config();
const express= require('express');
const router=express.Router();
const path = require('path');
const {verifyToken ,isAdmin } = require('../middleware/auth')

//Trasa dostępna tylko dla administratorów
router.get('/', verifyToken, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/AdminPanel.html'));
});

// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../public/pages/AdminPanel.html'));
// });



module.exports=router;