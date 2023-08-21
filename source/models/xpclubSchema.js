const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const xpclubSchema = new mongoose.Schema({
    
    idusuario: { type: String, require: true  },
    xpinicial: { type: Number, require: true, default: 0 },
    xpfinal: { type: Number, require: true, default: 0 },
    xpsubtotal: { type: Number, require: true, default: 0 },
    xpadicional: { type: Number, require: true, default: 0 },
    xptotal: { type: Number, require: true, default: 0 },

})

const model = mongoose.model('Xpclub', xpclubSchema);

module.exports = model;