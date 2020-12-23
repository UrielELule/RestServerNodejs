require('./config/config');

const express = require('express'); 
const mongoose = require('mongoose');
const path = require('path');//paquete por defecto de node



const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

///Configurac global de rutas
 app.use(require('./routes/index'));

 //habilitar carpeta public para ser accedida
 app.use(express.static(path.resolve(__dirname, '../public')));


mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err) => {
  if (err) {
    throw err;
  }
  console.log('Online DB mongo');
});


///ver que el puerto este escuchando
app.listen(process.env.PORT, ()=>{
    console.log('Escuchamdo el puerto', process.env.PORT);
}); 