const express= require('express');
const router=express.Router();
const path = require('path');
const {verifyToken ,isAdmin } = require('../middleware/auth')

router.get('/', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/Orders.html'));
});


module.exports=router;
