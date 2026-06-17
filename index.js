const express = require('express');
const { engine } = require('express-handlebars');
const { Produto, Usuario, Video } = require('./models');
const sequelize = require('./db');

const app = express();

// Configuração do Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

// Rota Principal - Listar Vídeos (findAll)
app.get('/', async (req, res) => {
  try {
    const videos = await Video.findAll({ raw: true });
    res.render('home', { videos });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Cadastrar Vídeo (create)
app.post('/videos/novo', async (req, res) => {
  try {
    const { titulo, descricao, url } = req.body;
    await Video.create({ titulo, descricao, url });
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Deletar Vídeo (destroy)
app.post('/videos/deletar', async (req, res) => {
  try {
    const { id } = req.body;
    await Video.destroy({ where: { id } });
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Exercício 4: Criar 3 produtos e listar todos
app.get('/exercicio4', async (req, res) => {
  try {
    await Produto.create({ nome: 'Teclado', preco: 150.0 });
    await Produto.create({ nome: 'Mouse', preco: 80.0 });
    await Produto.create({ nome: 'Monitor', preco: 900.0 });

    const produtos = await Produto.findAll();
    console.log('--- Exercício 4: Todos os Produtos ---');
    console.log(JSON.stringify(produtos, null, 2));
    
    res.send('Exercício 4: Produtos criados e listados no terminal.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Exercício 5: Buscar produto por ID (findByPk)
app.get('/exercicio5', async (req, res) => {
  try {
    const produto = await Produto.findByPk(1);
    if (produto) {
      console.log('--- Exercício 5: Produto por ID ---');
      console.log(`Nome: ${produto.nome}, Preço: ${produto.preco}`);
      res.send(`Exercício 5: Produto encontrado - ${produto.nome}`);
    } else {
      res.send('Exercício 5: Produto não encontrado.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Exercício 6: Atualizar preço usando save()
app.get('/exercicio6', async (req, res) => {
  try {
    const produto = await Produto.findByPk(1);
    if (produto) {
      produto.preco = 199.99;
      await produto.save();
      console.log('--- Exercício 6: Produto Atualizado ---');
      console.log(`Novo preço do ${produto.nome}: ${produto.preco}`);
      res.send('Exercício 6: Preço atualizado com sucesso.');
    } else {
      res.send('Exercício 6: Produto não encontrado para atualizar.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Exercício 7: Deletar produto usando destroy()
app.get('/exercicio7', async (req, res) => {
  try {
    const produto = await Produto.findByPk(2);
    if (produto) {
      await produto.destroy();
      console.log('--- Exercício 7: Produto Deletado ---');
      const produtosRestantes = await Produto.findAll();
      console.log('Produtos restantes:');
      console.log(JSON.stringify(produtosRestantes, null, 2));
      res.send('Exercício 7: Produto deletado e lista atualizada no terminal.');
    } else {
      res.send('Exercício 7: Produto não encontrado para deletar.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
