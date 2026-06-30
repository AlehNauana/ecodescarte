/* =============================================================
   EcoDescarte — Dashboard do Administrador Master (dashboard.js)
   -------------------------------------------------------------
   JavaScript puro, sem bibliotecas externas.
   Responsabilidades:
     - Calcular e renderizar os cards de métricas;
     - Renderizar a tabela de pontos de coleta com busca e filtros;
     - Desenhar o gráfico de barras (Canvas HTML5 puro);
     - Controlar a navegação do menu lateral e a versão mobile.

   Organizado em módulo (IIFE) para não poluir o escopo global.
   ============================================================= */

(function () {
  'use strict';

  /* ============================================================
     1. DADOS (mock — front-end sem backend, conforme restrição do
        projeto). Em uma evolução, este array seria substituído por
        uma chamada `fetch` a uma API REST.
     ============================================================ */
  const pontosDeColeta = [
    { id: 1,  nome: "Recicla Centro",       endereco: "Rua das Acácias, 123 — Centro, BH",         responsavel: "Mariana Silva",   tipo: "Eletrônicos", status: "ativo",      quantidade: 312, dataCadastro: "2026-01-14" },
    { id: 2,  nome: "Verde Vida",           endereco: "Av. Brasil, 4500 — Funcionários, BH",       responsavel: "João Pereira",    tipo: "Óleo",        status: "ativo",      quantidade: 256, dataCadastro: "2026-01-22" },
    { id: 3,  nome: "EcoPonto Savassi",     endereco: "Rua Tomé de Souza, 1010 — Savassi, BH",     responsavel: "Ana Carvalho",    tipo: "Papel",       status: "ativo",      quantidade: 198, dataCadastro: "2026-02-03" },
    { id: 4,  nome: "Recicla Sul",          endereco: "Av. Cardeal Eugênio Pacelli — Contagem",    responsavel: "Carlos Mendes",   tipo: "Plástico",    status: "ativo",      quantidade: 174, dataCadastro: "2026-02-10" },
    { id: 5,  nome: "Coleta Norte",         endereco: "Rua das Margaridas, 88 — Venda Nova, BH",   responsavel: "Patrícia Lima",   tipo: "Vidro",       status: "ativo",      quantidade: 142, dataCadastro: "2026-02-18" },
    { id: 6,  nome: "Ponto Verde Pampulha", endereco: "Av. Antônio Carlos, 7700 — Pampulha, BH",   responsavel: "Roberto Alves",   tipo: "Pilhas",      status: "aguardando", quantidade: 0,   dataCadastro: "2026-05-12" },
    { id: 7,  nome: "EcoColeta Betim",      endereco: "Av. Edméia Mattos Lazzarotti, 250 — Betim", responsavel: "Fernanda Rocha",  tipo: "Eletrônicos", status: "ativo",      quantidade: 128, dataCadastro: "2026-03-02" },
    { id: 8,  nome: "Recicla Já BH",        endereco: "Rua Padre Eustáquio, 1500 — BH",            responsavel: "Lucas Oliveira",  tipo: "Metal",       status: "inativo",    quantidade: 95,  dataCadastro: "2025-11-08" },
    { id: 9,  nome: "Coleta Consciente",    endereco: "Av. Afonso Pena, 4000 — Cruzeiro, BH",      responsavel: "Beatriz Santos",  tipo: "Orgânico",    status: "ativo",      quantidade: 117, dataCadastro: "2026-03-15" },
    { id: 10, nome: "Ponto Sustentável",    endereco: "Rua Sapucaí, 200 — Floresta, BH",           responsavel: "Diego Martins",   tipo: "Óleo",        status: "ativo",      quantidade: 89,  dataCadastro: "2026-03-28" },
    { id: 11, nome: "Eco Ponto Nova Lima",  endereco: "Av. Brasil, 1200 — Nova Lima",              responsavel: "Marcos Vieira",   tipo: "Vidro",       status: "aguardando", quantidade: 0,   dataCadastro: "2026-05-15" },
    { id: 12, nome: "Recicla Estação",      endereco: "Rua Curitiba, 800 — Centro, BH",            responsavel: "Juliana Costa",   tipo: "Papel",       status: "ativo",      quantidade: 211, dataCadastro: "2026-02-25" },
    { id: 13, nome: "Verde Total",          endereco: "Av. Raja Gabaglia, 3000 — Luxemburgo, BH",  responsavel: "Eduardo Lima",    tipo: "Plástico",    status: "inativo",    quantidade: 67,  dataCadastro: "2025-12-01" },
    { id: 14, nome: "Ponto Eco Belvedere",  endereco: "Av. Hum, 500 — Belvedere, BH",              responsavel: "Camila Ferreira", tipo: "Eletrônicos", status: "ativo",      quantidade: 153, dataCadastro: "2026-03-10" },
    { id: 15, nome: "Coleta Verde Centro",  endereco: "Rua dos Tupis, 100 — Centro, BH",           responsavel: "Pedro Henrique",  tipo: "Pilhas",      status: "ativo",      quantidade: 76,  dataCadastro: "2026-04-05" }
  ];

  // Estatística agregada de usuários (exibida nos cards).
  const totalUsuariosCadastrados = 589;

  /* ============================================================
     2. ESTADO (filtros ativos da tabela)
     ============================================================ */
  let estado = { busca: "", status: "", tipo: "" };

  /* ============================================================
     3. UTILITÁRIOS
     ============================================================ */
  const $ = (sel) => document.querySelector(sel);
  const byId = (id) => document.getElementById(id);

  /** Formata uma data ISO (yyyy-mm-dd) para o padrão brasileiro. */
  function formatarData(iso) {
    const [a, m, d] = iso.split("-");
    return `${d}/${m}/${a}`;
  }

  /** Sanitiza texto antes de injetá-lo no DOM (defesa básica contra XSS). */
  function esc(texto) {
    if (texto == null) return "";
    return String(texto)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ============================================================
     4. CARDS DE MÉTRICAS
     ============================================================ */
  function calcularMetricas() {
    const total      = pontosDeColeta.length;
    const ativos     = pontosDeColeta.filter(p => p.status === "ativo").length;
    const inativos   = pontosDeColeta.filter(p => p.status === "inativo").length;
    const aguardando = pontosDeColeta.filter(p => p.status === "aguardando").length;
    const totalKg    = pontosDeColeta.reduce((s, p) => s + p.quantidade, 0);
    return { total, ativos, inativos, aguardando, totalKg };
  }

  function renderizarCards() {
    const m = calcularMetricas();
    const cards = [
      { label: "Pontos cadastrados",  valor: m.total,                                          extra: "todos os registros",   icon: "📍", cor: "azul"     },
      { label: "Pontos ativos",       valor: m.ativos,                                         extra: "em operação",          icon: "✅", cor: ""         },
      { label: "Pontos inativos",     valor: m.inativos,                                       extra: "desativados",          icon: "⏸️", cor: "vermelho" },
      { label: "Aguardando aprovação",valor: m.aguardando,                                     extra: "pendentes de análise", icon: "⏳", cor: "laranja"  },
      { label: "Resíduos coletados",  valor: m.totalKg.toLocaleString("pt-BR") + " kg",        extra: "volume acumulado",     icon: "♻️", cor: "amarelo"  },
      { label: "Usuários cadastrados",valor: totalUsuariosCadastrados.toLocaleString("pt-BR"), extra: "PF + PJ na plataforma",icon: "👥", cor: "roxo"     }
    ];

    byId("cards-grid").innerHTML = cards.map(c => `
      <div class="metric-card ${c.cor}">
        <div class="metric-icon">${c.icon}</div>
        <div class="metric-label">${esc(c.label)}</div>
        <div class="metric-value">${esc(String(c.valor))}</div>
        <div class="metric-extra">${esc(c.extra)}</div>
      </div>
    `).join("");
  }

  /* ============================================================
     5. TABELA — filtro + renderização
     ============================================================ */
  function filtrar() {
    return pontosDeColeta.filter(p => {
      const matchBusca  = !estado.busca  || p.nome.toLowerCase().includes(estado.busca.toLowerCase());
      const matchStatus = !estado.status || p.status === estado.status;
      const matchTipo   = !estado.tipo   || p.tipo === estado.tipo;
      return matchBusca && matchStatus && matchTipo;
    });
  }

  function statusBadge(status) {
    const map = {
      ativo:      { cls: "badge-ativo",      txt: "Ativo"      },
      inativo:    { cls: "badge-inativo",    txt: "Inativo"    },
      aguardando: { cls: "badge-aguardando", txt: "Aguardando" }
    };
    const s = map[status] || { cls: "", txt: status };
    return `<span class="badge ${s.cls}">${esc(s.txt)}</span>`;
  }

  function renderizarTabela() {
    const dados = filtrar();
    const tbody = byId("tabela-pontos");
    const vazio = byId("vazio");

    byId("contador").textContent = dados.length;
    byId("total").textContent    = pontosDeColeta.length;

    if (dados.length === 0) {
      tbody.innerHTML = "";
      vazio.style.display = "block";
      return;
    }
    vazio.style.display = "none";

    tbody.innerHTML = dados.map(p => `
      <tr>
        <td class="col-nome">${esc(p.nome)}</td>
        <td>${esc(p.endereco)}</td>
        <td>${esc(p.responsavel)}</td>
        <td><span class="chip">${esc(p.tipo)}</span></td>
        <td>${statusBadge(p.status)}</td>
        <td class="col-qtd">${p.quantidade} kg</td>
        <td>${formatarData(p.dataCadastro)}</td>
      </tr>
    `).join("");
  }

  /* ============================================================
     6. GRÁFICO — Canvas HTML5 puro
        Barras horizontais com o total de kg coletados por ponto,
        ordenadas do maior para o menor volume.
     ============================================================ */
  function renderizarGrafico() {
    const canvas = byId("grafico-pontos");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Resolução adaptada à largura do container (suporte a telas HiDPI).
    const wrapper = canvas.parentElement;
    const cssW = Math.max(wrapper.clientWidth - 4, 320);
    const cssH = 340;
    const dpr  = window.devicePixelRatio || 1;
    canvas.style.width  = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Considera apenas pontos com coleta registrada, ordenados desc.
    const dados = pontosDeColeta
      .filter(p => p.quantidade > 0)
      .slice()
      .sort((a, b) => b.quantidade - a.quantidade);

    // Layout
    const padLeft = 160, padRight = 50, padTop = 20, padBottom = 30;
    const innerW = cssW - padLeft - padRight;
    const innerH = cssH - padTop - padBottom;
    const n      = dados.length;
    const barH   = Math.min(22, (innerH - (n - 1) * 8) / n);
    const gap    = (innerH - barH * n) / (n - 1 || 1);

    const maxVal    = Math.max(...dados.map(d => d.quantidade));
    const escalaMax = Math.ceil(maxVal / 50) * 50; // arredonda para múltiplo de 50

    ctx.clearRect(0, 0, cssW, cssH);

    // Linhas de grade verticais + escala em kg
    const passos = 5;
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.font = "10px 'Inter Tight', sans-serif";
    ctx.fillStyle = "#9e9e9e";
    ctx.textAlign = "center";
    for (let i = 0; i <= passos; i++) {
      const x = padLeft + (innerW * i) / passos;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + innerH);
      ctx.stroke();
      const valor = Math.round((escalaMax * i) / passos);
      ctx.fillText(valor + " kg", x, padTop + innerH + 16);
    }

    // Eixo base
    ctx.strokeStyle = "#bdbdbd";
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + innerH);
    ctx.stroke();

    // Barras
    dados.forEach((d, i) => {
      const y = padTop + i * (barH + gap);
      const w = (d.quantidade / escalaMax) * innerW;

      // Trilho de fundo
      ctx.fillStyle = "#e8f5e9";
      ctx.fillRect(padLeft, y, innerW, barH);

      // Barra (gradiente alinhado à paleta da marca)
      const grad = ctx.createLinearGradient(padLeft, 0, padLeft + w, 0);
      grad.addColorStop(0, "#1f6f4a");
      grad.addColorStop(1, "#3aa372");
      ctx.fillStyle = grad;
      ctx.fillRect(padLeft, y, w, barH);

      // Borda de remate
      ctx.fillStyle = "#0f3d2e";
      ctx.fillRect(padLeft + w - 2, y, 2, barH);

      // Rótulo (nome do ponto)
      ctx.fillStyle = "#374151";
      ctx.font = "12px 'Inter Tight', sans-serif";
      ctx.textAlign = "right";
      const nomeAbrev = d.nome.length > 22 ? d.nome.slice(0, 21) + "…" : d.nome;
      ctx.fillText(nomeAbrev, padLeft - 10, y + barH / 2 + 4);

      // Valor à direita da barra
      ctx.fillStyle = "#0f3d2e";
      ctx.font = "bold 11px 'Inter Tight', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(d.quantidade + " kg", padLeft + w + 6, y + barH / 2 + 4);
    });
  }

  /* ============================================================
     7. TOAST — notificação não bloqueante
     ============================================================ */
  function toast(mensagem) {
    const stack = byId("toast-stack");
    if (!stack) { alert(mensagem); return; }
    const el = document.createElement("div");
    el.className = "toast toast--info";
    el.innerHTML = `
      <svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <span>${esc(mensagem)}</span>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .3s, transform .3s";
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }

  /* ============================================================
     8. NAVEGAÇÃO E EVENTOS
     ============================================================ */
  function fecharMenuMobile() {
    byId("sidebar").classList.remove("open");
    byId("overlay").classList.remove("active");
  }

  function setupEventos() {
    // ----- Filtros da tabela -----
    byId("busca").addEventListener("input", e => {
      estado.busca = e.target.value;
      renderizarTabela();
    });
    byId("filtro-status").addEventListener("change", e => {
      estado.status = e.target.value;
      renderizarTabela();
    });
    byId("filtro-tipo").addEventListener("change", e => {
      estado.tipo = e.target.value;
      renderizarTabela();
    });
    byId("btn-limpar").addEventListener("click", () => {
      estado = { busca: "", status: "", tipo: "" };
      byId("busca").value = "";
      byId("filtro-status").value = "";
      byId("filtro-tipo").value = "";
      renderizarTabela();
    });

    // ----- Menu lateral -----
    // Todos os itens são links reais para outras telas do sistema.
    // Apenas "Sair" é interceptado (não há backend de sessão).
    document.querySelectorAll(".menu-item").forEach(item => {
      item.addEventListener("click", e => {
        const view = item.dataset.view;
        if (view === "sair") {
          e.preventDefault();
          if (confirm("Tem certeza que deseja sair?")) {
            toast("Sessão encerrada. (A tela de login será integrada pela equipe.)");
          }
        }
        fecharMenuMobile();
      });
    });

    // ----- Hambúrguer (mobile) -----
    byId("btn-menu").addEventListener("click", () => {
      byId("sidebar").classList.toggle("open");
      byId("overlay").classList.toggle("active");
    });
    byId("overlay").addEventListener("click", fecharMenuMobile);

    // ----- Redesenho do gráfico ao redimensionar (debounce) -----
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderizarGrafico, 150);
    });
  }

  /* ============================================================
     9. INICIALIZAÇÃO
     ============================================================ */
  function init() {
    renderizarCards();
    renderizarTabela();
    renderizarGrafico();
    setupEventos();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
