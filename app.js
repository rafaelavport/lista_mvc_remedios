const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const remediosController = require('./controllers/remediosController');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', 
  port: 3306,
  user: 'usuario',
  password: '123456',
  database: 'lista-tarefas', 
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão ao banco de dados MySQL bem-sucedida');
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'batatinha',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.render('login');
  });
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (username>0 && password>0) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/cadastro');
    } else {
      res.send('Credenciais inválidas. <a href="/login">Tente novamente</a>');
    }
  })

  app.get('/restrito', (req, res) => {
    if (req.session.loggedin) {
      res.send(`Bem-vindo, ${req.session.username}! <a href="/logout">Logout</a>`);
    } else {
      res.send('Você não está autenticado. <a href="/login">Faça login</a>');
    }
  })
  
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
});

app.get('/', remediosController.listarRemedios)
app.get('/cadastro', remediosController.exibirFormulario)
app.post('/cadastro', remediosController.cadastrarRemedio)

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})
