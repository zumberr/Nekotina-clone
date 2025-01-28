///si usas replit o alguna nube este es super necesario 
const express = require("express");
const server = express();

server.all("/", (req, res) => {
  res.send("Hola si ves esto estas viendo un ejemplo de la web!");
});

function keepAlive() {
  server.listen(3000, () => {
    //console.log("S!");
  });
}

module.exports = keepAlive; 
