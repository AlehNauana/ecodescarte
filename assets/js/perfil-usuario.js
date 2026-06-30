var Usuario = {
  "id": 1,
      "nome": "Christian Rodrigues",
      "email": "christian@email.com",
      "telefone": "(31) 99999-9999",
      "senha": "123456",
      "conta_ativa": true,
      "data_criacao": "09/04/2026",
      "cidade": "Belo Horizonte"
}

var Descartes = [

{
    id: 1,
    nome: "EcoPonto Central",
    data: "06/05/2026",
    tipo: "Plástico",
    endereco: "Rua das Flores - 512",
    cidade: "Ribeirão das Neves",
    bairro: "Santa Cecília",
    quantidade: "3kg",
  
},

{
    id: 2,
    nome: "EcoBH Savassi",
    data: "10/05/2026",
    tipo: "Metal",
    endereco: "Av. Cristóvão Colombo - 220",
    cidade: "Belo Horizonte",
    bairro: "Savassi",
    quantidade: "5kg",
  
},

{
    id: 3,
    nome: "Recicla Minas",
    data: "14/05/2026",
    tipo: "Vidro",
    endereco: "Rua Pará - 890",
    cidade: "Contagem",
    bairro: "Centro",
},

{
    id: 4,
    nome: "Ponto Verde",
    data: "18/05/2026",
    tipo: "Papel",
    endereco: "Rua Amazonas - 102",
    cidade: "Betim",
    bairro: "Jardim Alterosa",
},

{
    id: 5,
    nome: "EcoPoint Barreiro",
    data: "22/05/2026",
    tipo: "Eletrônicos",
    endereco: "Av. Olinto Meireles - 430",
    cidade: "Belo Horizonte",
    bairro: "Barreiro",
}

];


function InicializarPagina() {

    ExibirNome();

    ExibirCidade();

    ExibirData();

    VerHistorico();
}

function ExibirNome() {

    let textoHtml = "";

    textoHtml += Usuario.nome;

    let tela = document.getElementById('TelaNome');

    tela.innerHTML = textoHtml;
}

function ExibirCidade() {

    let tela = document.getElementById('TelaCidade');

    tela.innerHTML = Usuario.cidade;
}



function ExibirData() {

    let tela = document.getElementById('TelaData');

    tela.innerHTML = Usuario.data_criacao;
}




function ApagarConta() {

    let confirmar = confirm(
        "Tem certeza que deseja apagar sua conta?"
    );

    if(confirmar == true) {

        Usuario = {};

        alert("Conta apagada com sucesso!");

        location.reload();

    }

}


function VerHistorico() {

    let tela = document.getElementById('TelaHistorico');

    let textoHtml = "";

    for (let x = 0; x < Descartes.length; x++) {

        textoHtml += `
            <div class="descarte-item">

                <h6>${Descartes[x].nome}</h6>

                <p>
                    ${Descartes[x].tipo}
                    •
                    ${Descartes[x].data}
                </p>

                <p>
                    ${Descartes[x].endereco}
                </p>

                <p>
                    ${Descartes[x].bairro} -
                    ${Descartes[x].cidade}
                </p>


            </div>
        `;
    }

    tela.innerHTML = textoHtml;
}


