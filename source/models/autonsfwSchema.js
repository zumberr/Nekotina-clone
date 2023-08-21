const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const autonsfwSchema = new mongoose.Schema({
    
    idserver: { type: String, require: true, unique: true },
    idcanal: { type: String, require: true  },
    intervalo: { type: Number, require: true, default: 1 },
    modo: { type: Boolean, requiere: true, default: false },

})

const model = mongoose.model('AutoNsfw', autonsfwSchema);

module.exports = model;