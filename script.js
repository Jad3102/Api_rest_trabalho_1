function listarProduto(){
    var tabela = document.getElementById("tabelaPedidos");
    var xhttp = new XMLHttpRequest();
  
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          var obj = JSON.parse(this.responseText);
          obj.forEach(function (dado) {
            if (document.getElementById("p" + dado.id) === null) {
              var index = tabela.rows.length;
              var row = tabela.insertRow(-1);
              row.id = "p" + dado.idDia;
              var cellID = row.insertCell(0);
              var cellHorario = row.insertCell(1);
              var cellENDERECO = row.insertCell(2);
              var cellCLIENTEID = row.insertCell(3);
              cellID.innerHTML = dado.id;
              cellHorario.innerHTML = dado.cellHorario;
              cellENDERECO.innerHTML = dado.endereco;
              cellCLIENTEID.innerHTML = dado.cliente_id;
            }
          });
        }
      }
    };
  
    xhttp.open("GET", "http://localhost:8080/pedidosFeitos", true);
    xhttp.send();
};

function adicionarPedidos(){
    // Pega os valores dos campos do formulário
    const horario = document.getElementById("horario").value;
    const endereco = document.getElementById("endereco").value;
    const cliente_id = document.getElementById("cliente_id").value;

    // Cria um objeto com os dados que serão enviados no formato JSON
    const pedido = {
      horario: horario,
      endereco: endereco,
      cliente_id: cliente_id
    };

    // Faz a requisição POST para o servidor
    fetch('http://localhost:8080/fazerPedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
      // Trate a resposta do servidor aqui, se necessário
      console.log(data);
    })
    .catch(error => {
      // Trate os erros aqui, se necessário
      console.error('Erro ao fazer a requisição:', error);
    });
};
