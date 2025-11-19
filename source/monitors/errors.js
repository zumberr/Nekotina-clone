let array = new Array();

array[3184] = "Permisos insuficientes.\n\nSoluciones recomendadas: Ve a las opciones del servidor, roles y sube el rol de Sally como el rol mas alto para poder solucionarlo, si esto no funciona, asegurate de que el permiso que requiere el comando se cumpla.",
array[5621] = "El comando errorsinfo no reconoce el error colocado."

function getError(err) {
    let id;
    switch(err) {
        case "Permisos insuficientes.":
            id = "3148"
            break;
        default:
            return "No he podido reconocer el mensaje."
    }
    return id;
}

function findError(id) {
    let fix = array[id];
    if (fix != undefined) {
        return fix;
    } else {
        return "El Error ID no es válido. \n\nMas información: \n`errorsinfo | errors <5621> `"
    }
}

module.exports = {
    getError,
    findError
}