const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const remediosController = require('./controllers/remediosController');
const mysql = require('mysql2');
const md5 = require('md5');
const multer = require('multer');

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
          res.redirect('/cadastro');
          
        });
      }
    });
  } catch (err) {
    console.error('Erro no cadastro do usuário: ' + err.message);
    res.status(500).send('Erro interno no 3servidor');
  }
});

  app.get('/restrito', (req, res) => {
    if (req.session.loggedin) {
      res.send(`Bem-vindo, ${req.session.username}! <a href="/logout">Logout</a>`);
    } else {
      res.send('Você não está autenticado. <a href="/login">Faça login</a>');
    }
  })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/cadastrar', upload.single('foto'), (req, res) => {
  const { nome, descricao, indicacao, modoDeUsar, efeitosColaterais } = req.body;
  const foto = req.file.filename; // Nome do arquivo de imagem gerado pelo multer

const insertRemedioQuery = `INSERT INTO remedios (nome, foto, descricao, indicacao, modoDeUsar, efeitosColaterais) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(
    insertRemedioQuery,
    [nome, foto, descricao, indicacao, modoDeUsar, efeitosColaterais],
    (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar o remédio: ' + err.message);
        res.status(500).send('Erro 1 interno no servidor');
        return;
      }

      console.log('Remédio cadastrado com sucesso.');
      res.redirect('/cadastro');
    }
  );
});

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
