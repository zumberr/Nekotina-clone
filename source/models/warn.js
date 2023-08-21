const { Schema, model } = require('mongoose');

const sch = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    reason: { type: String },
    warning: { type: Number },
    staffId: { type: String }
});

module.exports = model('warnings', sch);