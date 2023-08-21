const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const kissSchema = new mongoose.Schema({
    
    u1: { type: String, require: true  },
    u2: { type: String, require: true  },
    c: { type: Number, require: true, default: 0 },

})

const model = mongoose.model('Kiss', kissSchema);

module.exports = model;

//type: string, number, boolean, buffer, date, array, Schema.Types.ObjectId
//default: fv