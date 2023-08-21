const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const rmSchema = new mongoose.Schema({
    
    idserver: { type: String, require: true, default: null },
    idusuario: { type: String, require: true, default: null },
    idcanal: { type: String, require: true, default: null },
    tiempo: { type: Date, require: true },
    recordatorio: { type: String, requiere: true, default: null },
    dm: { type: Boolean, requiere: true, default: false },

})

const model = mongoose.model('rm', rmSchema);

module.exports = model;
