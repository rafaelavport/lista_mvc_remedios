const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const remediosController = require('./controllers/remediosController');
const mysql = require('mysql2');

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
      const query = `SELECT * FROM usuario WHERE username = ? AND password = ?`;
      const hashedPassword = md5(password);

      db.query(query, [username, hashedPassword], (err, results) => {
          if (err) {
              console.error('Erro na consulta ao banco de dados: ' + err.message);
              res.status(500).send('Erro interno no servidor');
              return;
          }

          if (results.length > 0) {
              res.send('Login bem-sucedido');
          } else {
              res.send('Login falhou. Verifique suas credenciais.');
          }
      });
  } catch (err) {
      console.error('Erro no login: ' + err.message);
      res.status(500).send('Erro interno no servidor');
  }
});


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
