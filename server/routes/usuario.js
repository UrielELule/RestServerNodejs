const express = require('express'); 
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificarAdmin_ROLE } = require('../middlewares/authentication');
const app = express();

app.get('/usuario', verificaToken,  (req, res) => {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limit || 20;
    limite = Number(limite);

    Usuario.find({}, 'nombre email role estado google img').skip(desde).limit(limite).exec((err, usuarios)=> { //filtra el json para que mande solo lo necesario

        if(err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }

         Usuario.count({}, (err, conteo) => {

            res.json({
                ok: true,
                usuarios,
                cuantos : conteo
            });

         });

    });

});
  
app.post('/usuario', [verificaToken, verificarAdmin_ROLE], (req, res)  => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => { //UN CALLBACK
        if(err){
           return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null; para no mostrar datos en la peticion post

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});
    
app.put('/usuario/:id', [verificaToken, verificarAdmin_ROLE], function (req, res) {
      let id = req.params.id; //obtenemos el id
      let body = _.pick(req.body,  ['nombre','email','img','role','estado'] ); /**utilizamos pick para indicar en cadena las que queremos actualizar 2 manera**/

      //evitar que se actualicen cierto campos 1 manera
      //delete body.password;
      //delete body.google;

      Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

        if(err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }

        res.json({
            ok: true,
            usuario: usuarioDB
      });

    });
});
  
app.delete('/usuario/:id', [verificaToken, verificarAdmin_ROLE], function (req, res) {

    let id = req.params.id; //obtenemos el id3

    let cambiaEstado = {
        estado : false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        
        if(err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         };

         if (!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                }
            });
         }

         res.json({
             ok: true,
             usuario: usuarioBorrado
         });

    });

});
    
module.exports = app;
