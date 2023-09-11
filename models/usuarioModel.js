const database = require('./database');
const md5 = require('md5');

class UsuarioModel{
    constructor(id, username, password){
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static async autenticar(username, password){
        console.log(username, password);
        let username = await database.query(`SELECT * FROM usuario WHERE username = '${username}' AND password = '${md5(password)}'`);
       
        return usuario;
    }
}

module.exports = UsuarioModel;