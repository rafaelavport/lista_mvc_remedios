const remedios = [];

const listarRemedios = () => {
  return remedios;
};

const cadastrarRemedio = (remedio) => {
  remedios.push(remedio);
};

module.exports = { listarRemedios, cadastrarRemedio };
