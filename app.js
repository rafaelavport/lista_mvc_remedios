const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const remediosController = require('./controllers/remediosController');
const mysql = require('mysql2');
const md5 = require('md5');

const connection = mysql.createConnection({
  host: "sql10.freemysqlhosting.net",
  user: "sql10645653",
  password: "MwTchJcYu3",
  database: "sql10645653"
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão ao banco de dados MySQL bem-sucedida');
});

app.use(express.static('public'));
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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const checkUserQuery = `SELECT * FROM usuario WHERE username = ?`;

    connection.query(checkUserQuery, [username], (err, results) => {
      if (err) {
        console.error('Erro na consulta ao banco de dados: ' + err.message);
        res.status(500).send('Erro interno no 1servidor');
        return;
      }

      if (results.length > 0) {
        res.send('Nome de usuário já existe. Escolha outro nome de usuário.');
      } else {
        const insertUserQuery = `INSERT INTO usuario (username, password) VALUES (?, ?)`;
        const hashedPassword = md5(password);

        connection.query(insertUserQuery, [username, hashedPassword], (err, result) => {
          if (err) {
            console.error('Erro na inserção do usuário: ' + err.message);
            res.status(500).send('Erro interno no 2servidor');
            return;
          }

          console.log('Usuário cadastrado com sucesso.');
          
        });
      }
    });
  } catch (err) {
    console.error('Erro no cadastro do usuário: ' + err.message);
    res.status(500).send('Erro interno no 3servidor');
  }
});

  res.render('/cadastro');

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

app.get('/cadastro', remediosController.listarRemedios)
app.get('/formulario', remediosController.exibirFormulario)
app.post('/cadastrar', remediosController.cadastrarRemedio)

app.listen(10000, () => {
  console.log('Servidor rodando em http://0.0.0.0:10000')
})
