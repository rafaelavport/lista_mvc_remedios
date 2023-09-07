const remedioModel = require('../models/remedioModel');

const listarRemedios = (req, res) => {
  const remedios = remedioModel.listarRemedios();
  res.render('index', { remedios });
};

const exibirFormulario = (req, res) => {
  res.render('cadastro');
};

const cadastrarRemedio = (req, res) => {
  const { nome, descricao, indicacao, modoDeUsar, efeitosColaterais } = req.body;
  remedioModel.cadastrarRemedio({ nome, descricao, indicacao, modoDeUsar, efeitosColaterais });
  res.redirect('/');
};

module.exports = { listarRemedios, exibirFormulario, cadastrarRemedio };
