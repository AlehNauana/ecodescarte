/* =============================================================
   EcoDescarte — Pontos de Coleta (pontos-coleta.js)
   Front-end puro: os dados são embutidos (mock). Em uma evolução,
   "PONTOS" seria substituído por uma chamada fetch a uma API.
   ============================================================= */
const PONTOS = [
  {
    "nome": "Ecoponto Central",
    "endereco": "Rua das Flores, 123",
    "distancia": "0.8 km"
  },
  {
    "nome": "Centro de Reciclagem Norte",
    "endereco": "Av. Principal, 456",
    "distancia": "1.2 km"
  },
  {
    "nome": "Ponto Verde Sul",
    "endereco": "Rua do Meio, 789",
    "distancia": "2.1 km"
  },
  {
    "nome": "Coleta Sustentável",
    "endereco": "Praça da Árvore, 321",
    "distancia": "3.5 km"
  }
];

function carregarDados() {
  var container = document.getElementById('lista-pontos');
  if (!container) return;
  var htmlGeral = '';
  for (var i = 0; i < PONTOS.length; i++) {
    var ponto = PONTOS[i];
    htmlGeral += '<div class="card-ponto">';
    htmlGeral += '  <div class="d-flex justify-content-between">';
    htmlGeral += '    <h3 class="h6 fw-bold">' + ponto.nome + '</h3>';
    htmlGeral += '    <span class="text-muted small fw-bold">' + ponto.distancia + '</span>';
    htmlGeral += '  </div>';
    htmlGeral += '  <p class="text-muted small mb-3">' + ponto.endereco + '</p>';
    htmlGeral += '  <button class="btn-chegar" onclick="alertaRota(\'' + ponto.nome + '\')">Como Chegar</button>';
    htmlGeral += '</div>';
  }
  container.innerHTML = htmlGeral;
}

function alertaRota(nome) {
  alert('Calculando rota para: ' + nome);
}

window.addEventListener('DOMContentLoaded', carregarDados);
