const express = require('express');
const { verificaToken } = require('../middlewares/authentication');
let app = express();
let Producto = require('../models/producto');

//TODOS PUEDEN CREAR EL PRODUCTO

//====================================
//      OBTENER TODOS LOS PRODUCTOS 
//====================================
app.get('/productos', verificaToken, (req, res) =>{
    //traer todos los procutos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0; //desde es string pasarlo a numero
    desde = Number(desde); //transformamos desde a numero

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Producto.find({disponible: true})
    .skip(desde)
    .limit(limite)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        res.status(201).json({
            ok: true,
            productos
        });
    })
});


//====================================
//      OBTENER UN PRODUCTO POR ID
//====================================
app.get('/productos/:id', verificaToken, (req, res) =>{
    //populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) =>{
        ///error de la db
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //error por si no se encuentra en la base de datos
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del producto no es valido no existe'
                }
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })

    })
    
});

//====================================
//      BUSCAR UN PRODUCTO
//====================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) =>{
    
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //expresion regular

    Producto.find({nombre: regex, disponible: false})  //para agregar mas opciones de busqueda podemos agregar el atributo y su estado eje: disponible: false
    .populate('categoria', 'nombre')
    .exec((err, productos) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            productos
        })
      
    })

});



//====================================
//      CREAR UN PRODUCTO
//====================================
app.post('/productos', verificaToken, (req, res) =>{
    //Grabar el usuario
    //graba una categoria

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
        
    })

    producto.save((err, productoDB) =>{
        //error de la bd
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //error si no se creo el producto
        if(!productoDB) {
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

    
});

//====================================
//      ACTUALIZAR UN PRODUCTO
//====================================
app.put('/productos/:id', verificaToken, (req, res) =>{
    //Grabar el usuario
    //graba una categoria del listado
    let id = req.params.id;

    let body = req.body;

    //verificar que id existe

    Producto.findById(id, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //id no existe
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err:{ 
                    message: 'El producto no existe'
                }
            });
        }

        //ACTUALIZAR PRODUCTOS    
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
       

        ///GUARDAR PRODUCTO 

        productoDB.save((err, productoGuardado) => {
             if(err){
                 return res.status(500).json({
                     ok: false,
                     err
                 });
             }

             res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    })
    
});


//====================================
//      ELIMINAR UN PRODUCTO
//====================================
app.delete('/productos/:id', verificaToken, (req, res) =>{
    //Grabar el usuario
    //graba una categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){ //verificamos si existe el registro
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) =>{
            
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Desabilitado'
            });
    
        })


    })
    
});



module.exports = app;