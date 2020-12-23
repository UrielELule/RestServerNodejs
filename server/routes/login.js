const express = require('express'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) =>{ //fndOne = BUSCAR UNO comparamos email con el body.email si son iguales 

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

//CONFIGURACIONES DE GOOGLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

  //funcion asincrono con async y await  post de gooogle login

app.post('/google', async (req, res) =>{

 let token = req.body.idtoken;

//verificamos token de google si no es valido no se ejecuta
 let googleUser = await verify(token).catch(err =>{
    return res.status(403).json({
         ok: false,
         err: err
     });
 });

 //buscamos y verificamos si exite el correo 
 Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{

    if(err){
        return res.status(500).json({
             ok: false,
             err
        });
    };

    // si existe ese usuario evita que se registre con google,  o que usuario se logue con el registro de la base de datos mongodb biseversa con los 2 loguin
    if(usuarioDB){
        if(usuarioDB.google === false){
            return res.status(400).json({
                ok: false,
                err: {
                   messaje: 'Usuario ya autenticado prueba con otro metodo'
                }
           }); 
        } else {
            // usuario autenticado con google solo renovamos el token
            let token = jwt.sign({  
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
            
            return res.json({ //se guarda en la base de datos para indicar que si es creeado con login google 
                ok: true,
                usuario: usuarioDB,
                token,
            });

        }
    } else { //usuario de la base de datos no existe la primera ves que se loguea y se crea = nuevo usuario

        let usuario = new Usuario();
        usuario.nombre = googleUser.nombre;
        usuario.email = googleUser.email;
        usuario.img = googleUser.img;
        usuario.google = true;
        usuario.password = ':)'; //carita feliz es un ejemplo ya que no podemos guardar su contrasena de google solo sustituimos asi validamos la contrasena en la db recuerda}
        
        /*guardamos en la base de datos*/
        usuario.save((err, usuarioDB)=> {
            if(err){
                return res.status(500).json({
                     ok: false,
                     err
                });
            };

            let token = jwt.sign({  
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
            
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token,
            });

        });
    }

 });

});

module.exports = app;