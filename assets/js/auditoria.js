/* =============================================================
   EcoDescarte — Auditoria, Logs e Relatórios (auditoria.js)
   -------------------------------------------------------------
   Originalmente consumia um backend json-server. Convertido para
   dados embutidos (front-end puro). Corrigido também o carregamento
   de relatórios (que continha um bug na cadeia de promessas).
   ============================================================= */

const LOGS = [
  {
    "id": "1",
    "dataHora": "2026-06-01 14:32:15",
    "usuario": "Admin Master",
    "acao": "Aprovação de ponto de coleta",
    "alvo": "EcoPonto Centro",
    "categoria": "Ponto de Coleta",
    "status": "Sucesso",
    "detalhes": "Ponto de coleta aprovado e publicado na plataforma"
  },
  {
    "id": "2",
    "dataHora": "2026-06-01 13:45:22",
    "usuario": "Carlos Moderador",
    "acao": "Recusa de ponto de coleta",
    "alvo": "Coleta XYZ",
    "categoria": "Ponto de Coleta",
    "status": "Aviso",
    "detalhes": "Ponto recusado: Informações incompletas sobre horário de funcionamento"
  },
  {
    "id": "3",
    "dataHora": "2026-06-01 12:18:40",
    "usuario": "Admin Master",
    "acao": "Suspensão de usuário",
    "alvo": "Ana Oliveira",
    "categoria": "Usuário",
    "status": "Aviso",
    "detalhes": "Usuário suspenso por submissão de informações falsas"
  },
  {
    "id": "4",
    "dataHora": "2026-06-01 11:05:33",
    "usuario": "Sistema",
    "acao": "Geração de relatório ambiental",
    "alvo": "Relatório Maio 2026",
    "categoria": "Relatório",
    "status": "Sucesso",
    "detalhes": "Relatório mensal gerado automaticamente"
  },
  {
    "id": "5",
    "dataHora": "2026-06-01 10:22:18",
    "usuario": "Lucia Ferreira",
    "acao": "Alteração de função",
    "alvo": "João Silva",
    "categoria": "Usuário",
    "status": "Sucesso",
    "detalhes": "Usuário promovido a moderador"
  },
  {
    "id": "6",
    "dataHora": "2026-06-01 09:45:55",
    "usuario": "Admin Master",
    "acao": "Banimento de usuário",
    "alvo": "Roberto Alves",
    "categoria": "Usuário",
    "status": "Erro",
    "detalhes": "Usuário banido por violação dos termos de uso"
  }
];
const RELATORIOS = [
  {
    "id": "rep_1",
    "mesReferencia": "Maio 2026",
    "dataGeracao": "31/05/2026",
    "residuosTotaisKg": "45.231",
    "recicladosKg": "28.650",
    "organicosKg": "12.340",
    "taxaReciclagemPct": "63.3%",
    "taxaOrganicaPct": "27.3%",
    "pontosAtivos": "1.247",
    "novosUsuarios": "432",
    "co2EconomizadoKg": "8.765"
  },
  {
    "id": "rep_2",
    "mesReferencia": "Abril 2026",
    "dataGeracao": "30/04/2026",
    "residuosTotaisKg": "42.180",
    "recicladosKg": "26.890",
    "organicosKg": "11.230",
    "taxaReciclagemPct": "63.8%",
    "taxaOrganicaPct": "26.6%",
    "pontosAtivos": "1.198",
    "novosUsuarios": "387",
    "co2EconomizadoKg": "8.234"
  }
];

let todosOsLogs = [];

function carregarTabelaLogs() {
  const tabelaCorpo = document.getElementById('tabela-logs-corpo');
  if (!tabelaCorpo) return;
  todosOsLogs = LOGS;
  renderizarLogs(todosOsLogs);
}

function renderizarLogs(logsParaExibir) {
  const tabelaCorpo = document.getElementById('tabela-logs-corpo');
  tabelaCorpo.innerHTML = '';
  let sucessos = 0, avisos = 0, erros = 0;
  logsParaExibir.forEach(log => {
    let badgeCor = 'bg-success';
    if (log.status === 'Aviso') { badgeCor = 'bg-warning text-dark'; avisos++; }
    else if (log.status === 'Erro') { badgeCor = 'bg-danger'; erros++; }
    else { sucessos++; }
    tabelaCorpo.innerHTML += `
      <tr>
        <td>${log.dataHora}</td>
        <td><strong>${log.usuario}</strong></td>
        <td>${log.acao}<br><small class="text-muted">Alvo: ${log.alvo}</small></td>
        <td>${log.categoria}</td>
        <td><span class="badge ${badgeCor}">${log.status}</span></td>
        <td><span class="text-wrap d-block" style="max-width: 300px;">${log.detalhes}</span></td>
      </tr>`;
  });
  document.getElementById('total-acoes').innerText = logsParaExibir.length;
  document.getElementById('total-sucessos').innerText = sucessos;
  document.getElementById('total-avisos').innerText = avisos;
  document.getElementById('total-erros').innerText = erros;
}

function filtrarLogs() {
  const termo = document.getElementById('campo-busca').value.toLowerCase();
  renderizarLogs(todosOsLogs.filter(log =>
    log.usuario.toLowerCase().includes(termo) ||
    log.acao.toLowerCase().includes(termo) ||
    log.alvo.toLowerCase().includes(termo)
  ));
}

function carregarRelatorios() {
  const lista = document.getElementById('lista-relatorios');
  if (!lista) return;
  lista.innerHTML = '';
  RELATORIOS.forEach(rel => {
    lista.innerHTML += `
      <div class="border rounded p-3 bg-light">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 class="m-0"><strong>${rel.mesReferencia}</strong></h6>
            <small class="text-muted">Gerado em ${rel.dataGeracao}</small>
          </div>
          <button class="btn btn-outline-dark btn-sm" onclick="exportarMensagem('${rel.mesReferencia}')">
            <i class="bi bi-file-pdf me-1"></i> Exportar PDF
          </button>
        </div>
        <div class="row g-2 text-center">
          <div class="col-6 col-md-2"><div class="bg-white p-2 border rounded"><small class="text-muted d-block">Resíduos Totais (kg)</small><strong>${rel.residuosTotaisKg}</strong></div></div>
          <div class="col-6 col-md-2"><div class="bg-white p-2 border rounded"><small class="text-muted d-block">Reciclados (kg)</small><strong class="text-success">${rel.recicladosKg}</strong></div></div>
          <div class="col-6 col-md-2"><div class="bg-white p-2 border rounded"><small class="text-muted d-block">Orgânicos (kg)</small><strong class="text-info">${rel.organicosKg}</strong></div></div>
          <div class="col-6 col-md-2"><div class="bg-white p-2 border rounded"><small class="text-muted d-block">Pontos Ativos</small><strong>${rel.pontosAtivos}</strong></div></div>
          <div class="col-6 col-md-2"><div class="bg-white p-2 border rounded"><small class="text-muted d-block">Novos Usuários</small><strong class="text-warning">${rel.novosUsuarios}</strong></div></div>
          <div class="col-6 col-md-2"><div class="bg-white p-2 border rounded"><small class="text-muted d-block">CO₂ Economizado (kg)</small><strong class="text-success">${rel.co2EconomizadoKg}</strong></div></div>
        </div>
        <div class="mt-2 text-start"><small class="text-muted">Taxa de Reciclagem: <strong class="text-success">${rel.taxaReciclagemPct}</strong> | Taxa Orgânica: <strong>${rel.taxaOrganicaPct}</strong></small></div>
      </div>`;
  });
}

function exportarMensagem(item) { alert('Exportando dados de: ' + item); }

window.addEventListener('DOMContentLoaded', function () {
  carregarTabelaLogs();
  carregarRelatorios();
});
