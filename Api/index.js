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

servidor.post( '/cadastroCliente' , (req, res, next) => {
    knex('pedidos')
      .insert(req.body)
      .then((dados) => {
        res.send(dados);
      })
      .catch(next);
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

server.post('/login', (req, res, next) => {
    const { username, password } = req.body;
  
    const query = `SELECT id, senha FROM usuarios WHERE nome_usuario = ?`;
    connection.query(query, [username], (err, results) => {
      if (err) {
        console.error(err);
        return res.send(500, { error: 'Erro no servidor' });
      }
  
      if (results.length === 0) {
        return res.send(404, { error: 'Usuário não encontrado' });
      }
  
      const usuario = results[0];
      if (usuario.senha === password) {
        return res.send(200, { message: 'Autenticação bem-sucedida' });
      } else {
        return res.send(401, { error: 'Senha incorreta' });
      }
    });
  });


