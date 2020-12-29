const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({

   descripcion :{
        type: String,
        unique: true,
        required:[true, 'Tipo de categoria necesaria']
    },
    usuario:{
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    }
});


module.exports = mongoose.model('Categoria', categoriaSchema);