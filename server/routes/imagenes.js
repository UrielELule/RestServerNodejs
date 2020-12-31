const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/authentication');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) =>{  //verificamos que solo usuario logueados y validados inicien con verifica token img

    let tipo = req.params.tipo;
    let img = req.params.img;

    //configuramos path osea indicamos donde busque //validamos tipo y img que existan
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`); ///con esta lineas verificamos que exista imagen

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen); //si existe muestra imagen
    } else { 
        //si no existe manda imagen default
        let noImagePath =path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath); //sendFile ES LO IDONEO
    }



});



module.exports = app;