const database = require('./database');
const md5 = require('md5');

class UsuarioModel{
    constructor(id, nome, senha){
        this.id = id;
        this.nome = nome;
        this.senha = senha;
    }

    static async autenticar(nome, senha){
        console.log(nome, senha);
        let usuario = await database.query(`SELECT * FROM usuario WHERE email = '${email}' AND senha = '${md5(senha)}'`);
       
        return usuario;
    }
}

module.exports = UsuarioModel;