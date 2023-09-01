module.exports = function enlace (protocolo, ip, puerto) {
    return `${protocolo}://${ip}:${puerto}/`
}