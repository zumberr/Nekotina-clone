const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const usersSchema = new mongoose.Schema({

    idusuario: { type: String, require: true, unique: true },
    username: { type: String, require: true, default: null },
    vip: { type: Boolean, requiere: true, default: false },
    nivel: { type: Number, require: true, default: 0 },
    exp: { type: Number, require: true, default: 0 },
    marry: { type: String, require: true, default: 'Soltero(a)' },
    rep: { type: Number, require: true, default: 0 },
    pat: { type: Number, require: true, default: 0 },
    hug: { type: Number, require: true, default: 0 },
    sape: { type: Number, require: true, default: 0 },
    color: { type: String, require: true, default: '#607D8B' },
    frase: { type: String, require: true, default: 'No hay frase agregada' },
    foto: { type: String, require: true, default: 'https://c.tenor.com/FLR3dFSlH1sAAAAC/bully-tierno.gif' },
    dinero: { type: Number, require: true, default: 0 },
    banco: { type: Number, require: true, default: 0 },
    total: { type: Number, require: true, default: 0 },
    work: { type: Date, require: true, default: Date.now },
    crime: { type: Date, require: true, default: Date.now },
    rob: { type: Date, require: true, default: Date.now },
    daily: { type: Date, require: true, default: Date.now },
    crep: { type: Date, require: true, default: Date.now },
    ck: { type: Number, require: true, default: 0 },

})

const model = mongoose.model('Usuarios', usersSchema);

module.exports = model;

//type: string, number, boolean, buffer, date, array, Schema.Types.ObjectId
//default: fv