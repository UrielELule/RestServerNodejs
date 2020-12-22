const express = require('express'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) =>{ //fndOne BUSCAR UNO comparamos email con el body.email si son iguales 

        if(err){
            return res.status(500).json({
                 ok: false,
                 err
            });
         }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    messaje: '(Usuario) o password incorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)) { //regresa un true si hace macht != si no
            return res.status(400).json({
                ok: false,
                err:{
                    messaje: 'Usuario o (password) incorrectos'
                }
            });
        }

        let token = jwt.sign({  
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});  //60 minutos * 60 segundos * 24 hora * 30 dias expira

        res.json({
            ok: true,
            Usuario : usuarioDB,
            token: token
        });

    });

});

module.exports = app;