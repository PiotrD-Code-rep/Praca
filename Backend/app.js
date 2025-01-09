const dotenv = require('dotenv');
dotenv.config();
process.env.TZ = 'Europe/Warsaw';
const express = require('express');
const morgan = require('morgan');
const mongoose=require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const {verifyToken ,isAdmin } = require('./middleware/auth')

//Middleware
app.use(express.json()); //Zamiast bodyparser w Express 5 (Zalecany)
app.use(morgan('tiny')); //express.logger w starszych wresja Express zalecany morgan
app.use(cors({
  origin: ['http://127.0.0.1:3000/', 'http://localhost:3000/','http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 


//Tarasy 
const ProduktyTrasa=require('./routers/Produkty');
app.use('/api/Produkty',ProduktyTrasa);
const KatygorieTrasa=require('./routers/Katygorie');
app.use('/api/Katygorie',KatygorieTrasa);
const UzytkownicyTasa=require('./routers/Uzytkownicy');
app.use('/api/Uzytkownicy',UzytkownicyTasa);
const TransakcjeTasa=require('./routers/Transakcje');
app.use('/api/Transakcje',TransakcjeTasa);
const Zamowienie_PozycjaTasa=require('./routers/Zamowienie_Pozycja');
app.use('/api/Zamowienie_Pozycja',Zamowienie_PozycjaTasa);

const OrdersTrasa=require('./routers/Orders');
app.use('/Orders',OrdersTrasa);
const AdminTrasa=require('./routers/Admin');
app.use('/AdminPanel',AdminTrasa);

// Middleware do serwowania plików statycznych
app.use(express.static(path.join(__dirname, '../public')));

// Obsługa stron (np. index.html jako główny plik)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/index.html'));
});


//Schemat bazy danych
const ProduktyModel=require('./models/Produkty');
const KatygorieModel=require('./models/Katygorie');
const UzytkownicyModel=require('./models/Uzytkownicy');
const TransakcjeModel=require('./models/Transakcje');
const Zamowienie_PozycjaModel=require('./models/Zamowienie_Pozycja');



mongoose.connect(process.env.MONGO,{
})
 .then(()=>{
   console.log('Udalo sie polaczyc z baza danych');
 })
 .catch((err)=>{
  console.log(err);
 })



app.listen(process.env.PORT_SERVER, () => {
  console.log(`Example app listening on port http://127.0.0.1:${process.env.PORT_SERVER}`);
  console.log('Lokalny czas:', new Date().toString());
})