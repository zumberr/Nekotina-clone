function mstotime(ms) {
    var hours = Math.floor(ms / (1000 * 60 * 60));
    var minutes = Math.floor(ms / (1000 * 60)) % 60;
    var s = Math.floor(ms / 1000) % 60;

    return ((hours < 1 ? '' : ` ${hours} hora/horas`) + (minutes < 1 ? '' : ` ${minutes} minuto/minutos`) + (s < 1 ? '' : ` ${s} segundo/segundos`)).trim();
}

module.exports = {
    mstotime
}