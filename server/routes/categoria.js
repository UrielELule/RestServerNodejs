const express = require('express');
let {verificaToken, verificarAdmin_ROLE} = require('../middlewares/authentication');
let app = express();
let Categoria = require('../models/categoria');


///===============================
//Mostrar todas las categorias
//================================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
    .sort('descripcion') //orbenamos los datos
    .populate('usuario', 'nombre email')  //con pupule podemos traer quien registro la categoria y datos en concreto
    .exec((err, categorias) =>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });

    })

});

//================================ 
//Mostrar una categoria por id
//================================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
   
    Categoria.findById(id, (err, categoriaDB)=>{
        ///error de la db
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //error si no se creo la categoria !=sino
        if(!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'el id no es valido'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//================================ 
//Crear una nueva categoria 
//================================

app.post('/categoria', verificaToken,  (req, res) => { //Bien
    //Regresa la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) =>{ 
        //error de la bd
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //error si no se creo la categoria !=sino
        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    
        res.json({
            ok: true,
            categoria:categoriaDB
        });

    });

    
});

//================================ 
//actualizar categoria
//================================
app.put('/categoria/:id', (req, res) => {

    let id = req.params.id; //obtenemos el id}

    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true},  (err, categoriaDB) => {
        
        //error de la bd
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // !=sino existe la categoria en la bd
        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

//================================ 
//Borrar categorias eliminar 
//================================

app.delete('/categoria/:id', [verificaToken, verificarAdmin_ROLE], (req, res) => {
    //solo el administrador puede borrar categoria
    //Categoria.findByIdAndRemove

    let id = req.params.id;

   Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(!categoriaBorrada){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    });
    



});


module.exports = app; 