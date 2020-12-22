

//===============================
//          PUERTO
//===============================

process.env.PORT = process.env.PORT || 3000;


//===============================
//          ENTORNO
//===============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================
//        VENCIMIENTO DE TOKEN
//===============================

//60 segundos por 60 minutos por 24 horas por 30 minutos
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//===============================
//       SEED de autentication
//===============================

process.env.SEED = process.env.MONGO_SEED || 'este-es-el-seed-desarrollo';  //process.ev.SEED INDICAMOS VARIABLE GLOBAL

//===============================
//         DATA BASE
//===============================

let urlBD;

if (process.env.NODE_ENV === 'dev'){
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI; ///variable global de heroku  para ocultar password y database   cmd: heroku config
} 

process.env.URLDB = urlBD;

//////////////////////////////
//// comandos para variables globales
//////////////////////////////

/**
 heroku config: ver variables globales

 heroku config:set nombrevariables="LINEA QUE SE QUIERE OCULTAR" 

 ejemplo

 heroku config:set MONGO_URI="mongodb+srv://luleudemy:3UV0jPY6tuf889qx@cluster0.v39uw.mongodb.net/cafe"

 **/