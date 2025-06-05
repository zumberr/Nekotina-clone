const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const autonsfwSchema = new mongoose.Schema({
    
    idserver: { type: String, required: true, unique: true },
    idcanal: { type: String, required: true  },
    intervalo: { type: Number, required: true, default: 1 },
    modo: { type: Boolean, required: true, default: false },

})

const model = mongoose.model('AutoNsfw', autonsfwSchema);

module.exports = model;
