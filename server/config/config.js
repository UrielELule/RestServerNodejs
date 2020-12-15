

//===============================
//          PUERTO
//===============================

process.env.PORT = process.env.PORT || 3000;


//===============================
//          ENTORNO
//===============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================
//         DATA BASE
//===============================

let urlBD;

if (process.env.NODE_ENV === 'dev'){
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://luleudemy:3UV0jPY6tuf889qx@cluster0.v39uw.mongodb.net/cafe';
} 

process.env.URLDB = urlBD;