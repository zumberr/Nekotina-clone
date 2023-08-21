const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const blSchema = new mongoose.Schema({
    
    idusuario: { type: String, require: true, unique: true },
    reason: { type: String, require: true, default: null }

})

const model = mongoose.model('bl', blSchema);

module.exports = model;
