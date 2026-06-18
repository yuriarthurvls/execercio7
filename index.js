
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

/*Exercício 8
Crie uma rota GET /produtos que busque todos os produtos no banco e retorne um JSON com os resultados.*/

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.findAll();

        res.json(produtos);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});



/*Exercício 9
Crie uma rota POST /produtos que receba nome e preco pelo req.body e salve no banco usando create().*/
app.post('/produtos', async (req, res) => {
    try {
        const { nome, preco } = req.body;

        await Produto.create({
            nome,
            preco
        });

        res.json({
            mensagem: 'Produto cadastrado com sucesso!'
        });

    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});







/*Exercício 10
Crie uma rota que receba um id como parâmetro de rota e delete o registro correspondente no banco.*/

app.get('/produtos/deletar/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await Produto.destroy({
            where: {
                id
            }
        });

        res.json({
            mensagem: 'Produto removido com sucesso!'
        });

    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});




/*Exercício 11
Crie uma rota GET /usuarios que busque todos os usuários no banco e renderize uma view usuarios.handlebars com a lista usando ``.*/

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            raw: true
        });

        res.render('usuarios', {
            usuarios
        });

    } catch (erro) {
        res.send(erro);
    }
});



/*Exercício 12
Crie um formulário em cadastrarUsuario.handlebars com campos para nome, email e idade.

A rota POST deve salvar o usuário no banco e redirecionar para /usuarios.*/

app.get('/cadastrarUsuario', (req, res) => {
    res.render('cadastrarUsuario');
});

app.post('/cadastrarUsuario', async (req, res) => {
    try {
        const { nome, email, idade } = req.body;

        await Usuario.create({
            nome,
            email,
            idade
        });

        res.redirect('/usuarios');

    } catch (erro) {
        res.send(erro);
    }
});




/*Exercício 13
Adicione um botão de remoção na listagem de usuários.

Ao clicar, o usuário deve ser removido do banco e a página deve ser redirecionada para /usuarios.*/


app.get('/usuarios/remover/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await Usuario.destroy({
            where: {
                id
            }
        });

        res.redirect('/usuarios');

    } catch (erro) {
        res.send(erro);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
