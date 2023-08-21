function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    if(h == Infinity) h = "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "Horas Infinitas.";
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " segundo." : " segundos.") : "";
    return hDisplay + mDisplay + sDisplay;
}

module.exports = {
    secondsToHms
}