const restify = require("restify");
const errors = require("restify-errors");

const corsMiddleware = require("restify-cors-middleware2");

const cors = corsMiddleware({
   origins: ['*']
});

const servidor = restify.createServer({
    name : 'Loja' ,
    version : '1.0.0'
});

servidor.use( restify.plugins.acceptParser(servidor.acceptable) );
servidor.use( restify.plugins.queryParser() );
servidor.use( restify.plugins.bodyParser() );

servidor.listen(8080, function(){
    console.log("%s executando em %s", servidor.name, servidor.url);
} );

var knex = require('knex')({
    client : 'mysql' ,
    connection : {
        host : 'localhost' ,
        user : 'root' ,
        password : 'black71826' ,
        database : 'loja'
    }
});

// clientes end points

servidor.get( '/' , (req, res, next) => {
    res.send('Bem-vindo(a) a Loja!');
});

servidor.get( '/produtosDisponiveis' , (req, res, next) => {
    knex('produtos').then( (dados) =>{
        res.send( dados );
    }, next) ; 
});

servidor.post('/cadastroCliente', (req, res, next) => {
  knex('clientes')
      .insert(req.body)
      .then((dados) => {
        res.send(dados);
      })
      .catch(next);
      res.send( "Cliente cadastrado!" );
  });



servidor.post( '/fazerPedido' , (req, res, next) => {
    knex('pedidos')
      .insert(req.body)
      .then((dados) => {
        res.send(dados);
      })
      .catch(next);
  });

servidor.get( '/pedidosFeitos' , (req, res, next) => {
    knex('pedidos').then( (dados) =>{
        res.send( dados );
    }, next) ; 
});

servidor.del( '/exclusaoPedido/:idPedido' , (req, res, next) => {
    const idPedido = req.params.idPedido;
    knex('pedidos')
        .where('id', idPedido)
        .delete()
        .then( (dados) =>{
            if( !dados ){
                return res.send(
                    new errors.BadRequestError('Pedido não encontrado'));
            }
            res.send( "Pedido Deletado" );
        }, next) ; 
});

servidor.put( '/edicaoPedido/:idPedido' , (req, res, next) => {
    const idPedido = req.params.idPedido;
    knex('pedidos')
        .where('id', idPedido)
        .update( req.body )
        .then( (dados) =>{
            if( !dados ){
                return res.send(
                    new errors.BadRequestError('Pedido não encontrado!'));
            }
            res.send( "Pedido Atualizado" );
        }, next) ; 
});

// Adms end points

servidor.post( '/cadastroADM' , (req, res, next) => {
    knex('administrador')
      .insert(req.body)
      .then((dados) => {
        res.send(dados);
      })
      .catch(next);
      res.send( "ADM Cadastrado" );
  });

servidor.post( '/criacaoProduto' , (req, res, next) => {
    knex('produtos')
      .insert(req.body)
      .then((dados) => {
        res.send(dados);
      })
      .catch(next);
  });

servidor.put( '/edicaoProduto/:idProduto' , (req, res, next) => {
    const idProduto = req.params.idProduto;
    knex('produtos')
        .where('id', idProduto)
        .update( req.body )
        .then( (dados) =>{
            if( !dados ){
                return res.send(
                    new errors.BadRequestError('Produto não encontrado!'));
            }
            res.send( "Produto Atualizado" );
        }, next) ; 
});

servidor.del( '/exclusaoProduto/:idProduto' , (req, res, next) => {
    const idProduto = req.params.idProduto;
    knex('produto')
        .where('id', idProduto)
        .delete()
        .then( (dados) =>{
            if( !dados ){
                return res.send(
                    new errors.BadRequestError('Produto não encontrado'));
            }
            res.send( "Produto Deletado" );
        }, next) ; 
});

servidor.post('/login', async (req,res) => {
  const { username, password } = req.body;

  try {
    // Consulta o usuário pelo nome de usuário fornecido
    const user = await knex('administrador').where('username', username).first();

    if (!user) {
      // Caso o usuário não seja encontrado, retorna uma mensagem de erro
      return res.send('Usuário não encontrado');
    }

    // Verifica se a senha informada corresponde à senha armazenada no banco de dados
    if (password !== user.password) {
      return res.send('Senha incorreta');
    }

    // Caso o usuário e a senha estejam corretos, retorna uma mensagem de sucesso
    return res.send('Login realizado com sucesso');

  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return res.send('Erro no servidor');
  }
});




