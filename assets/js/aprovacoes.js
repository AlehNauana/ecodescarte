/* =============================================================
   EcoDescarte – Painel do Administrador (admin.js)
   ------------------------------------------------------------
   Arquitetura:
   - Estado central (state) e constantes de configuração.
   - Funções pequenas e independentes (uma responsabilidade cada).
   - Persistência em localStorage simulando um backend.
   - Pronto para futura integração com API REST:
       basta substituir os métodos do objeto `storage` por chamadas fetch.
   ============================================================= */

/* ---------- 1. Configurações & Constantes ---------- */

const STORAGE_KEYS = {
  pontos: 'ecodescarte:pontos_coleta',
  historico: 'ecodescarte:historico_decisoes'
};

const CONFIG = {
  porPagina: 6,
  maxHistorico: 10,
  adminAtual: 'admin@ecodescarte.com' // simulado; viria do login no futuro
};

/* ---------- 2. Dados iniciais (mock) ---------- */
/* Lista usada apenas no primeiro carregamento.
   Depois disso, os dados persistem em localStorage. */

const PONTOS_INICIAIS = [
  {
    id: 1,
    nome: "Recicla Centro",
    foto: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80",
    endereco: {
      logradouro: "Rua das Acácias, 123",
      bairro: "Centro", cidade: "Belo Horizonte", uf: "MG", cep: "30100-000",
      latitude: -19.9208, longitude: -43.9378
    },
    tipos_residuo: ["eletronicos", "pilhas", "baterias"],
    capacidade_max: "200 kg/mês",
    responsavel: {
      tipo: "PJ", nome: "Mariana Silva",
      documento: "12.345.678/0001-90",
      email: "mariana@reciclacentro.com.br", telefone: "31-99999-0000"
    },
    status: "pendente",
    data_envio: "2026-05-14T10:32:00",
    revisao: { admin_id: null, data: null, decisao: null, motivo: null }
  },
  {
    id: 2,
    nome: "EcoPonto Savassi",
    foto: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&q=80",
    endereco: {
      logradouro: "Av. Getúlio Vargas, 880", bairro: "Savassi",
      cidade: "Belo Horizonte", uf: "MG", cep: "30112-021",
      latitude: -19.9395, longitude: -43.9347
    },
    tipos_residuo: ["plastico", "vidro", "papel", "metal"],
    capacidade_max: "500 kg/mês",
    responsavel: {
      tipo: "PJ", nome: "Ricardo Almeida",
      documento: "23.456.789/0001-12",
      email: "contato@ecosavassi.com.br", telefone: "31-98888-1212"
    },
    status: "pendente",
    data_envio: "2026-05-18T14:05:00",
    revisao: { admin_id: null, data: null, decisao: null, motivo: null }
  },
  {
    id: 3,
    nome: "Coleta Verde Pampulha",
    foto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
    endereco: {
      logradouro: "Rua Pampulha, 45", bairro: "Pampulha",
      cidade: "Belo Horizonte", uf: "MG", cep: "31330-560",
      latitude: -19.8517, longitude: -43.9789
    },
    tipos_residuo: ["organico", "papel"],
    capacidade_max: "150 kg/mês",
    responsavel: {
      tipo: "PF", nome: "Carla Mendes",
      documento: "123.456.789-00",
      email: "carla.mendes@email.com", telefone: "31-97777-3030"
    },
    status: "aprovado",
    data_envio: "2026-05-10T09:15:00",
    revisao: {
      admin_id: "admin@ecodescarte.com",
      data: "2026-05-12T11:20:00", decisao: "aprovado", motivo: null
    }
  },
  {
    id: 4,
    nome: "Resíduo Tech BH",
    foto: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80",
    endereco: {
      logradouro: "Rua dos Tupinambás, 990", bairro: "Centro",
      cidade: "Belo Horizonte", uf: "MG", cep: "30190-090",
      latitude: -19.9189, longitude: -43.9425
    },
    tipos_residuo: ["eletronicos", "lampadas"],
    capacidade_max: "300 kg/mês",
    responsavel: {
      tipo: "PJ", nome: "Bruno Tavares",
      documento: "34.567.890/0001-22",
      email: "bruno@residuotechbh.com", telefone: "31-96666-4040"
    },
    status: "recusado",
    data_envio: "2026-05-05T16:48:00",
    revisao: {
      admin_id: "admin@ecodescarte.com",
      data: "2026-05-08T10:00:00", decisao: "recusado",
      motivo: "Documentação do responsável incompleta."
    }
  },
  {
    id: 5,
    nome: "Óleo Limpo Belo Horizonte",
    foto: "imagem-invalida-para-testar-placeholder.jpg",
    endereco: {
      logradouro: "Rua Gonçalves Dias, 1500", bairro: "Lourdes",
      cidade: "Belo Horizonte", uf: "MG", cep: "30140-091",
      latitude: -19.9319, longitude: -43.9450
    },
    tipos_residuo: ["oleo"],
    capacidade_max: "120 L/mês",
    responsavel: {
      tipo: "PJ", nome: "Helena Costa",
      documento: "45.678.901/0001-33",
      email: "helena@oleolimpo.com.br", telefone: "31-95555-5050"
    },
    status: "pendente",
    data_envio: "2026-05-20T08:30:00",
    revisao: { admin_id: null, data: null, decisao: null, motivo: null }
  },
  {
    id: 6,
    nome: "Vidro & Cia Barreiro",
    foto: "https://images.unsplash.com/photo-1591892150204-1d3ca56fab9b?w=600&q=80",
    endereco: {
      logradouro: "Av. Olinto Meireles, 2400", bairro: "Barreiro",
      cidade: "Belo Horizonte", uf: "MG", cep: "30640-340",
      latitude: -19.9700, longitude: -44.0250
    },
    tipos_residuo: ["vidro"],
    capacidade_max: "1000 kg/mês",
    responsavel: {
      tipo: "PJ", nome: "Tiago Ramos",
      documento: "56.789.012/0001-44",
      email: "tiago@vidroecia.com.br", telefone: "31-94444-6060"
    },
    status: "pendente",
    data_envio: "2026-05-22T13:00:00",
    revisao: { admin_id: null, data: null, decisao: null, motivo: null }
  },
  {
    id: 7,
    nome: "Papel & Papel Cidade Nova",
    foto: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80",
    endereco: {
      logradouro: "Rua Joaquim Felício, 75", bairro: "Cidade Nova",
      cidade: "Belo Horizonte", uf: "MG", cep: "31170-180",
      latitude: -19.8950, longitude: -43.9540
    },
    tipos_residuo: ["papel"],
    capacidade_max: "800 kg/mês",
    responsavel: {
      tipo: "PF", nome: "Paulo Henrique Vidal",
      documento: "987.654.321-00",
      email: "paulo.vidal@email.com", telefone: "31-93333-7070"
    },
    status: "aprovado",
    data_envio: "2026-04-28T11:11:00",
    revisao: {
      admin_id: "admin@ecodescarte.com",
      data: "2026-05-02T15:00:00", decisao: "aprovado", motivo: null
    }
  },
  {
    id: 8,
    nome: "Pilha Zero Buritis",
    foto: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&q=80",
    endereco: {
      logradouro: "Rua dos Buritis, 320", bairro: "Buritis",
      cidade: "Belo Horizonte", uf: "MG", cep: "30575-180",
      latitude: -19.9628, longitude: -43.9911
    },
    tipos_residuo: ["pilhas", "baterias"],
    capacidade_max: "50 kg/mês",
    responsavel: {
      tipo: "PF", nome: "Aline Ferreira",
      documento: "456.789.123-00",
      email: "aline.f@email.com", telefone: "31-92222-8080"
    },
    status: "pendente",
    data_envio: "2026-05-23T16:42:00",
    revisao: { admin_id: null, data: null, decisao: null, motivo: null }
  }
];

/* ---------- 3. Camada de "storage" ----------
   Centralizar leitura/gravação aqui facilita a futura troca por uma API. */

const storage = {
  carregarPontos() {
    const dados = localStorage.getItem(STORAGE_KEYS.pontos);
    if (dados) {
      try { return JSON.parse(dados); }
      catch { /* dado corrompido, recria abaixo */ }
    }
    // Primeira execução: salva e devolve a base inicial
    localStorage.setItem(STORAGE_KEYS.pontos, JSON.stringify(PONTOS_INICIAIS));
    return JSON.parse(JSON.stringify(PONTOS_INICIAIS));
  },
  salvarPontos(pontos) {
    localStorage.setItem(STORAGE_KEYS.pontos, JSON.stringify(pontos));
  },
  carregarHistorico() {
    const dados = localStorage.getItem(STORAGE_KEYS.historico);
    try { return dados ? JSON.parse(dados) : []; }
    catch { return []; }
  },
  salvarHistorico(historico) {
    localStorage.setItem(STORAGE_KEYS.historico, JSON.stringify(historico));
  }
};

/* ---------- 4. Estado central ---------- */

const state = {
  pontos: [],
  historico: [],
  filtros: { busca: '', status: '', tipo: '', data: '' },
  paginaAtual: 1,
  pendenteRecusa: null // id do ponto em processo de recusa (controle do modal)
};

/* ---------- 5. Utilitários ---------- */

/** Formata uma data ISO para o padrão brasileiro com hora. */
function formatarData(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/** Sanitiza texto antes de injetar no DOM (defesa básica contra XSS). */
function esc(texto) {
  if (texto == null) return '';
  return String(texto)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Constrói a URL do Google Maps a partir de coordenadas. */
function urlGoogleMaps(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/** Devolve um novo array com os itens sem mutar o original. */
function clonar(obj) { return JSON.parse(JSON.stringify(obj)); }

/* ---------- 6. Carregar dados ---------- */

function carregarDados() {
  state.pontos = storage.carregarPontos();
  state.historico = storage.carregarHistorico();
}

/* ---------- 7. Salvar dados ---------- */

function salvarDados() {
  storage.salvarPontos(state.pontos);
  storage.salvarHistorico(state.historico);
}

/* ---------- 8. Aplicar filtros ---------- */

function aplicarFiltros() {
  const { busca, status, tipo, data } = state.filtros;
  const buscaLower = busca.trim().toLowerCase();
  const dataMin = data ? new Date(data + 'T00:00:00').getTime() : null;

  return state.pontos.filter(p => {
    if (status && p.status !== status) return false;
    if (tipo && !p.tipos_residuo.includes(tipo)) return false;
    if (buscaLower && !p.nome.toLowerCase().includes(buscaLower)) return false;
    if (dataMin && new Date(p.data_envio).getTime() < dataMin) return false;
    return true;
  });
}

/* ---------- 9. Paginação ---------- */

function paginar(lista) {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / CONFIG.porPagina));

  // Garante que a página atual está dentro do intervalo válido
  if (state.paginaAtual > totalPaginas) state.paginaAtual = totalPaginas;
  if (state.paginaAtual < 1) state.paginaAtual = 1;

  const inicio = (state.paginaAtual - 1) * CONFIG.porPagina;
  const itens = lista.slice(inicio, inicio + CONFIG.porPagina);

  return { itens, totalPaginas, totalItens: lista.length };
}

function renderizarPaginacao(totalPaginas) {
  const nav = document.getElementById('paginacao');
  if (totalPaginas <= 1) { nav.innerHTML = ''; return; }

  const atual = state.paginaAtual;
  let html = `
    <button class="pagination__btn" type="button"
      data-page="${atual - 1}" ${atual === 1 ? 'disabled' : ''}>‹ Anterior</button>`;

  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="pagination__btn ${i === atual ? 'is-active' : ''}"
      type="button" data-page="${i}">${i}</button>`;
  }

  html += `
    <button class="pagination__btn" type="button"
      data-page="${atual + 1}" ${atual === totalPaginas ? 'disabled' : ''}>Próximo ›</button>`;

  nav.innerHTML = html;
}

/* ---------- 10. Renderizar cards ---------- */

function renderizarCards() {
  const filtrados = aplicarFiltros();
  const { itens, totalPaginas, totalItens } = paginar(filtrados);

  const lista = document.getElementById('lista');
  const vazio = document.getElementById('vazio');
  const meta  = document.getElementById('lista-meta');

  // Atualiza contagem
  meta.textContent = `${totalItens} ${totalItens === 1 ? 'resultado' : 'resultados'}`;

  if (itens.length === 0) {
    lista.innerHTML = '';
    vazio.hidden = false;
  } else {
    vazio.hidden = true;
    lista.innerHTML = itens.map(montarCard).join('');
  }

  renderizarPaginacao(totalPaginas);
  atualizarEstatisticas();
}

/** Gera o HTML de um único card. */
function montarCard(p) {
  const endereco = `${esc(p.endereco.logradouro)} – ${esc(p.endereco.bairro)},
                    ${esc(p.endereco.cidade)}/${esc(p.endereco.uf)} – CEP ${esc(p.endereco.cep)}`;

  const tags = p.tipos_residuo
    .map(t => `<span class="tag">${esc(t)}</span>`).join('');

  // Botões variam conforme o status
  let acoes = '';
  if (p.status === 'pendente') {
    acoes = `
      <button class="btn btn--primary" data-acao="aceitar" data-id="${p.id}">Aceitar</button>
      <button class="btn btn--danger"  data-acao="recusar" data-id="${p.id}">Recusar</button>`;
  } else {
    // Já decidido – permite reverter para pendente caso o admin queira
    acoes = `
      <button class="btn btn--ghost" data-acao="reabrir" data-id="${p.id}">Reabrir análise</button>`;
  }

  // Motivo (se houver) só aparece em recusados
  const blocoMotivo = (p.status === 'recusado' && p.revisao && p.revisao.motivo)
    ? `<p class="card__motivo"><strong>Motivo da recusa:</strong>${esc(p.revisao.motivo)}</p>`
    : '';

  // Imagem com placeholder via onerror
  const imgHtml = `
    <img src="${esc(p.foto)}" alt="Foto do ponto ${esc(p.nome)}"
      onerror="this.parentElement.classList.add('card__media--fallback');
               this.outerHTML='<svg viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;1.5&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><path d=&quot;M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9&quot;/><circle cx=&quot;9&quot; cy=&quot;9&quot; r=&quot;2&quot;/><path d=&quot;m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21&quot;/></svg>';" />
  `;

  return `
    <article class="card" data-id="${p.id}">
      <div class="card__media">
        ${imgHtml}
        <span class="card__status status-${esc(p.status)}">${esc(p.status)}</span>
      </div>
      <div class="card__body">
        <h3 class="card__title">${esc(p.nome)}</h3>

        <p class="card__address">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${endereco}</span>
        </p>

        <div class="tags" aria-label="Tipos de resíduo aceitos">${tags}</div>

        <dl class="info-grid">
          <div>
            <dt>Capacidade máxima</dt>
            <dd>${esc(p.capacidade_max)}</dd>
          </div>
          <div>
            <dt>Data de envio</dt>
            <dd>${formatarData(p.data_envio)}</dd>
          </div>
        </dl>

        <div class="responsavel">
          <p class="responsavel__title">Responsável (${esc(p.responsavel.tipo)})</p>
          <div class="responsavel__row"><span>Nome</span><span>${esc(p.responsavel.nome)}</span></div>
          <div class="responsavel__row"><span>Documento</span><span>${esc(p.responsavel.documento)}</span></div>
          <div class="responsavel__row"><span>E-mail</span><span>${esc(p.responsavel.email)}</span></div>
          <div class="responsavel__row"><span>Telefone</span><span>${esc(p.responsavel.telefone)}</span></div>
        </div>

        ${blocoMotivo}

        <div class="card__actions">
          <a class="btn btn--link" target="_blank" rel="noopener"
             href="${urlGoogleMaps(p.endereco.latitude, p.endereco.longitude)}">
            Ver detalhes no mapa
          </a>
          ${acoes}
        </div>
      </div>
    </article>
  `;
}

/* ---------- 11. Estatísticas do cabeçalho ---------- */

function atualizarEstatisticas() {
  const cont = { pendente: 0, aprovado: 0, recusado: 0 };
  state.pontos.forEach(p => { if (cont[p.status] != null) cont[p.status]++; });

  document.getElementById('stat-pendentes').textContent = cont.pendente;
  document.getElementById('stat-aprovados').textContent = cont.aprovado;
  document.getElementById('stat-recusados').textContent = cont.recusado;
}

/* ---------- 12. Aceitar ponto ---------- */

function aceitarPonto(id) {
  const ponto = state.pontos.find(p => p.id === id);
  if (!ponto) return;

  ponto.status = 'aprovado';
  ponto.revisao = {
    admin_id: CONFIG.adminAtual,
    data: new Date().toISOString(),
    decisao: 'aprovado',
    motivo: null
  };

  registrarHistorico(ponto, 'aprovado');
  salvarDados();
  renderizarCards();
  renderizarHistorico();
}

/* ---------- 13. Recusar ponto ---------- */

function abrirModalRecusa(id) {
  const ponto = state.pontos.find(p => p.id === id);
  if (!ponto) return;

  state.pendenteRecusa = id;

  document.getElementById('modal-nome-ponto').textContent = ponto.nome;
  document.getElementById('modal-motivo').value = '';
  document.getElementById('modal-erro').hidden = true;

  const modal = document.getElementById('modal-recusa');
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');

  // Focar no textarea para acessibilidade
  setTimeout(() => document.getElementById('modal-motivo').focus(), 50);
}

function fecharModalRecusa() {
  const modal = document.getElementById('modal-recusa');
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  state.pendenteRecusa = null;
}

function confirmarRecusa() {
  const motivo = document.getElementById('modal-motivo').value.trim();
  const erro = document.getElementById('modal-erro');

  if (motivo.length < 5) {
    erro.hidden = false;
    return;
  }

  const ponto = state.pontos.find(p => p.id === state.pendenteRecusa);
  if (!ponto) { fecharModalRecusa(); return; }

  ponto.status = 'recusado';
  ponto.revisao = {
    admin_id: CONFIG.adminAtual,
    data: new Date().toISOString(),
    decisao: 'recusado',
    motivo
  };

  registrarHistorico(ponto, 'recusado', motivo);
  salvarDados();
  fecharModalRecusa();
  renderizarCards();
  renderizarHistorico();
}

/* ---------- 14. Reabrir análise (volta para pendente) ---------- */

function reabrirPonto(id) {
  const ponto = state.pontos.find(p => p.id === id);
  if (!ponto) return;

  ponto.status = 'pendente';
  ponto.revisao = { admin_id: null, data: null, decisao: null, motivo: null };

  salvarDados();
  renderizarCards();
}

/* ---------- 15. Histórico ---------- */

function registrarHistorico(ponto, decisao, motivo = null) {
  const item = {
    id: Date.now(),
    ponto_id: ponto.id,
    ponto_nome: ponto.nome,
    decisao,
    motivo,
    data: new Date().toISOString(),
    admin: CONFIG.adminAtual
  };

  state.historico.unshift(item);
  // Mantém apenas os últimos N
  if (state.historico.length > CONFIG.maxHistorico) {
    state.historico = state.historico.slice(0, CONFIG.maxHistorico);
  }
}

function renderizarHistorico() {
  const lista = document.getElementById('historico');
  if (state.historico.length === 0) {
    lista.innerHTML = `<li class="history__empty">Nenhuma decisão registrada ainda.</li>`;
    return;
  }

  lista.innerHTML = state.historico.map(h => {
    const icone = h.decisao === 'aprovado'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

    const acao = h.decisao === 'aprovado' ? 'aprovou' : 'recusou';
    const motivoHtml = h.motivo
      ? ` — <em>"${esc(h.motivo)}"</em>`
      : '';

    return `
      <li class="history__item history__item--${esc(h.decisao)}">
        <div class="history__icon">${icone}</div>
        <div class="history__content">
          <div class="history__line1">
            <strong>${esc(h.admin)}</strong> ${acao}
            <strong>${esc(h.ponto_nome)}</strong>${motivoHtml}
          </div>
          <div class="history__line2">${formatarData(h.data)}</div>
        </div>
      </li>
    `;
  }).join('');
}

function limparHistorico() {
  if (!confirm('Tem certeza que deseja limpar o histórico recente?')) return;
  state.historico = [];
  salvarDados();
  renderizarHistorico();
}

/* ---------- 16. Listeners (delegação de eventos) ---------- */

function configurarEventos() {

  /* Filtros */
  document.getElementById('f-busca').addEventListener('input', e => {
    state.filtros.busca = e.target.value;
    state.paginaAtual = 1;
    renderizarCards();
  });
  document.getElementById('f-status').addEventListener('change', e => {
    state.filtros.status = e.target.value;
    state.paginaAtual = 1;
    renderizarCards();
  });
  document.getElementById('f-tipo').addEventListener('change', e => {
    state.filtros.tipo = e.target.value;
    state.paginaAtual = 1;
    renderizarCards();
  });
  document.getElementById('f-data').addEventListener('change', e => {
    state.filtros.data = e.target.value;
    state.paginaAtual = 1;
    renderizarCards();
  });

  document.getElementById('btn-limpar').addEventListener('click', () => {
    state.filtros = { busca: '', status: '', tipo: '', data: '' };
    document.getElementById('f-busca').value = '';
    document.getElementById('f-status').value = '';
    document.getElementById('f-tipo').value = '';
    document.getElementById('f-data').value = '';
    state.paginaAtual = 1;
    renderizarCards();
  });

  /* Delegação para clicks nos cards e paginação */
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('[data-acao]');
    if (btn) {
      const id = Number(btn.dataset.id);
      const acao = btn.dataset.acao;
      if (acao === 'aceitar') aceitarPonto(id);
      else if (acao === 'recusar') abrirModalRecusa(id);
      else if (acao === 'reabrir') reabrirPonto(id);
      return;
    }

    const paginaBtn = e.target.closest('[data-page]');
    if (paginaBtn && !paginaBtn.disabled) {
      const novaPagina = Number(paginaBtn.dataset.page);
      if (!isNaN(novaPagina)) {
        state.paginaAtual = novaPagina;
        renderizarCards();
        // Rolar suavemente ao topo da lista
        document.querySelector('.list').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* Fechamento do modal pelos backdrops ou botões marcados */
    if (e.target.matches('[data-close-modal]')) {
      fecharModalRecusa();
    }
  });

  /* Modal de recusa */
  document.getElementById('btn-confirmar-recusa').addEventListener('click', confirmarRecusa);

  /* Fechar modal com ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modal-recusa').hidden) {
      fecharModalRecusa();
    }
  });

  /* Limpar histórico */
  document.getElementById('btn-limpar-hist').addEventListener('click', limparHistorico);
}

/* ---------- 17. Bootstrap ---------- */

function init() {
  carregarDados();
  configurarEventos();
  renderizarCards();
  renderizarHistorico();
}

// Aguarda DOM pronto antes de inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
