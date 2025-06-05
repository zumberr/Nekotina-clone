const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const xpclubSchema = new mongoose.Schema({
    
    idusuario: { type: String, required: true  },
    xpinicial: { type: Number, required: true, default: 0 },
    xpfinal: { type: Number, required: true, default: 0 },
    xpsubtotal: { type: Number, required: true, default: 0 },
    xpadicional: { type: Number, required: true, default: 0 },
    xptotal: { type: Number, required: true, default: 0 },

})

const model = mongoose.model('Xpclub', xpclubSchema);

module.exports = model;
