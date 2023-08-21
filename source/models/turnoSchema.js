const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const turnoSchema = new mongoose.Schema({
    
    idusuario: { type: String, require: true  },
    mensajes: { type: Number, require: true, default: 0 },
    diamantes: { type: Number, require: true, default: 0 },

})

const model = mongoose.model('Turno', turnoSchema);

module.exports = model;