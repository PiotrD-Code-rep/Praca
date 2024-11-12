const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose=require('mongoose');
const auth=require('./middleware/auth')
const errors=require('./middleware/errors')
const cors = require('cors');
const port = 3000
//Middleware
app.use(express.json()); //Zamiast bodyparser w Express 5 (Zalecany)
app.use(morgan('tiny')); //express.logger w starszych wresja Express zalecany morgan
app.use(auth());           //Express jwt i jsonwebtoken do weryfikacji dostepu 
app.use(errors)          //Przechwytywanie bledow
app.use(cors());


//Tarasy 
const ProduktyTrasa=require('./routers/Produkty');
app.use('/Produkty',ProduktyTrasa);
const KatygorieTrasa=require('./routers/Katygorie');
app.use('/Katygorie',KatygorieTrasa);
const UzytkownicyTasa=require('./routers/Uzytkownicy');
app.use('/Uzytkownicy',UzytkownicyTasa);
const ZamowieniaTasa=require('./routers/Zamowienia');
app.use('/Uzytkownicy',ZamowieniaTasa);

//Schemat bazy danych
const ProduktyModel=require('./models/Produkty');
const KatygorieModel=require('./models/Katygorie');
const UzytkownicyModel=require('./models/Uzytkownicy');
const ZamowieniaModel=require('./models/Zamowienia');





mongoose.connect('mongodb://localhost:27017/Sklep',{

})
 .then(()=>{
   console.log('Udalo sie polaczyc z baza danych');
 })
 .catch((err)=>{
  console.log(err);
 })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})