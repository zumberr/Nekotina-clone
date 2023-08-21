const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    gid: {type: String, unique: true},
    responses: {type: Map, default: new Map()},
    bindings: {type: Map, default: new Map()}
});

module.exports = mongoose.model('responses', ResponseSchema);