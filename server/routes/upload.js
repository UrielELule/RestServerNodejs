const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const producto = require('../models/producto');
const fs = require('fs');
const path = require('path');//para movernos entre rutas

app.use( fileUpload( {useTempFiles: true} ) );

app.put('/upload/:tipo/:id', function(req, res){

    let tipo = req.params.tipo;
    let id= req.params.id;

    //validacion si existe archivos
    if(!req.files) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Ningun archivo ha sido seleccionado'
            }
        });

    }

    //valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf( tipo ) < 0 ){
        
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Los tipo permitidos son ' + tiposValidos.join(', ')
            }
        });
    }
   
    //segmentamos el nombre del archivo obtenemos la extencion del archivo
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length-1];

    //extensiones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];   
    
    //validamos que solo podamos subir con las extenciones permitidas
   if(extencionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'la extension permitidas son ' + extencionesValidas.join(', '), ext: extension
            }
        });
   }

   //cambiar nombre el archivo

   let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`; 

   //subimos el archivo y cambiamos el nombre por el nombre del archivo
   //varible tipo para que se guarde en la imagen ya sea en prodcutos o usuarios segun indique la peticion put
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        ///Imagen ya cargada hasta este punto ariba
        if(tipo === 'usuarios'){            //se  valida si es usuario o productos SI LLEGARAN A SER MAS SE USA SWITCH
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
       
    });

});

    function imagenUsuario(id, res, nombreArchivo){
        Usuario.findById(id, (err, usuarioDB) =>{

            if(err){
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            if(!usuarioDB){
                borraArchivo(nombreArchivo, 'usuarios'); //evitamos que se llene el servidor de basura
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'Usuario no existe'  
                    }
                });
            }

            borraArchivo(usuarioDB.img, 'usuarios');

            usuarioDB.img = nombreArchivo;

            usuarioDB.save((err, usuarioGuardado) => {

                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombreArchivo
                });

            });

        });
    }

    //funcion para guardar imagen del producto

    function imagenProducto(id, res, nombreArchivo){

        producto.findById(id, (err, productoDB) =>{

            if(err){
                borraArchivo(nombreArchivo, 'productos');
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            if(!productoDB){
                borraArchivo(nombreArchivo, 'productos'); //evitamos que se llene el servidor de basura
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'Producto no existe'  
                    }
                });
            }

            borraArchivo(productoDB.img, 'productos');

            productoDB.img = nombreArchivo;

            productoDB.save((err, productoGuardado) => {

                res.json({
                    ok: true,
                    producto: productoGuardado,
                    img: nombreArchivo
                });

            });

        });

    }

    function borraArchivo(nombreImagen, tipo){
           //configuramos path osea indicamos donde busque
           let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); 

           //confirmar que existe el archivo
           if(fs.existsSync(pathImagen)){ //regresa un true o false
               fs.unlinkSync(pathImagen);
           }
    }

    
        

module.exports = app;