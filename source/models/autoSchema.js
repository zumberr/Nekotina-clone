const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const autoSchema = new mongoose.Schema({
    
    idcc: { type: String, required: true, unique: true },
    idserver: { type: String, required: true },
    trigger: { type: String, required: true  },
    response: { type: String, required: true },

})

const model = mongoose.model('Auto', autoSchema);

module.exports = model;
