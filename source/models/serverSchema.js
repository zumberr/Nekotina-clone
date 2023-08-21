const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const serverSchema = new mongoose.Schema({
    
    idserver: { type: String, require: true, unique: true },
    servername: { type: String, require: true, default: null },
    ownerid: { type: String, require: true, default: null },
    ownername: { type: String, require: true, default: null },
    prefix: { type: String, require: true, default: '_' },
    premium: { type: Boolean, requiere: true, default: false },
    rmneko: { type: Boolean, requiere: true, default: false },

})

const model = mongoose.model('server', serverSchema);

module.exports = model;
