const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const autoSchema = new mongoose.Schema({
    
    idcc: { type: String, require: true, unique: true },
    idserver: { type: String, require: true },
    trigger: { type: String, require: true  },
    response: { type: String, require: true },

})

const model = mongoose.model('Auto', autoSchema);

module.exports = model;