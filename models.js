const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const Video = sequelize.define('Video', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sincronizando os modelos (Exercício 2)
async function syncModels() {
  await sequelize.sync();
  console.log('Modelos sincronizados com o banco de dados.');
}

syncModels();

module.exports = { Produto, Usuario, Video };
