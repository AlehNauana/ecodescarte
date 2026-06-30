/* =============================================================
   EcoDescarte — Gestão de Usuários (gestao-usuarios.js)
   -------------------------------------------------------------
   Originalmente consumia um backend json-server local.
   Para que a aplicação funcione como front-end puro (basta abrir o
   arquivo), os dados foram embutidos e as operações de moderação
   (suspender, banir, ativar, alterar função, excluir, cadastrar)
   passaram a ocorrer EM MEMÓRIA, preservando todo o comportamento.
   ============================================================= */

const USUARIOS_SEED = [
  {
    "id": "1",
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "funcao": "Usuário",
    "status": "Suspenso",
    "pontosSubmetidos": 12,
    "ultimoAcesso": "31/05/2025",
    "dataCadastro": "14/03/2025"
  },
  {
    "id": "2",
    "nome": "Maria Santos",
    "email": "maria.santos@email.com",
    "funcao": "Usuário",
    "status": "Ativo",
    "pontosSubmetidos": 8,
    "ultimoAcesso": "30/05/2025",
    "dataCadastro": "20/03/2025"
  },
  {
    "id": "3",
    "nome": "Carlos Moderador",
    "email": "carlos.mod@email.com",
    "funcao": "Moderador",
    "status": "Ativo",
    "pontosSubmetidos": 0,
    "ultimoAcesso": "31/05/2025",
    "dataCadastro": "01/04/2025"
  },
  {
    "id": "4",
    "nome": "Ana Oliveira",
    "email": "ana.oliveira@email.com",
    "funcao": "Usuário",
    "status": "Suspenso",
    "pontosSubmetidos": 23,
    "ultimoAcesso": "27/05/2025",
    "dataCadastro": "10/02/2025"
  },
  {
    "id": "5",
    "nome": "Pedro Costa",
    "email": "pedro.costa@email.com",
    "funcao": "Usuário",
    "status": "Ativo",
    "pontosSubmetidos": 5,
    "ultimoAcesso": "29/05/2025",
    "dataCadastro": "15/03/2025"
  },
  {
    "id": "6",
    "nome": "Lucia Ferreira",
    "email": "lucia.ferreira@email.com",
    "funcao": "Moderador",
    "status": "Ativo",
    "pontosSubmetidos": 0,
    "ultimoAcesso": "31/05/2025",
    "dataCadastro": "05/04/2025"
  },
  {
    "id": "7",
    "nome": "Roberto Alves",
    "email": "roberto.alves@email.com",
    "funcao": "Usuário",
    "status": "Banido",
    "pontosSubmetidos": 1,
    "ultimoAcesso": "28/05/2025",
    "dataCadastro": "25/01/2025"
  }
];

let todosUsuarios = [];
let usuariosFiltrados = [];

function carregarUsuarios() {
  // Clona a semente para permitir alterações em memória sem perder o original.
  todosUsuarios = JSON.parse(JSON.stringify(USUARIOS_SEED));
  usuariosFiltrados = todosUsuarios;
  exibirUsuarios(usuariosFiltrados);
}

function exibirUsuarios(usuarios) {
  const corpoTabela = document.getElementById('corpoTabela');
  corpoTabela.innerHTML = '';
  if (usuarios.length === 0) {
    corpoTabela.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Nenhum usuário encontrado</td></tr>';
    return;
  }
  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];
    const linha = document.createElement('tr');
    if (usuario.status === 'Suspenso') linha.className = 'usuario-suspenso';
    else if (usuario.status === 'Banido') linha.className = 'usuario-banido';
    linha.innerHTML = `
      <td><strong>${usuario.nome}</strong><br><small class="text-muted">${usuario.email}</small></td>
      <td>${usuario.funcao}</td>
      <td><span class="badge-status badge-${usuario.status}">${usuario.status}</span></td>
      <td>${usuario.pontosSubmetidos}</td>
      <td>${usuario.ultimoAcesso}</td>
      <td><button class="btn btn-primary btn-sm btn-gerenciar" onclick="abrirGerenciar('${usuario.id}')"><i class="fas fa-cog me-1"></i>Gerenciar</button></td>`;
    corpoTabela.appendChild(linha);
  }
}

function filtrarUsuarios() {
  const busca = document.getElementById('searchInput').value.toLowerCase();
  const funcao = document.getElementById('filtroFuncao').value;
  const status = document.getElementById('filtroStatus').value;
  usuariosFiltrados = todosUsuarios.filter(u =>
    (u.nome.toLowerCase().includes(busca) || u.email.toLowerCase().includes(busca)) &&
    (funcao === 'todos' || u.funcao === funcao) &&
    (status === 'todos' || u.status === status)
  );
  exibirUsuarios(usuariosFiltrados);
}

function localizar(id) { return todosUsuarios.find(u => String(u.id) === String(id)); }

function abrirGerenciar(id) {
  const usuario = localizar(id);
  if (!usuario) { alert('Usuário não encontrado!'); return; }
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <h5>${usuario.nome}</h5>
        <p class="text-muted">${usuario.email}</p>
        <div class="mb-3">
          <label class="form-label fw-bold">Alterar Função</label>
          <select class="form-select" id="editarFuncao">
            <option value="Usuário" ${usuario.funcao === 'Usuário' ? 'selected' : ''}>Usuário</option>
            <option value="Moderador" ${usuario.funcao === 'Moderador' ? 'selected' : ''}>Moderador</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Ações de Moderação</label>
          <div class="d-grid gap-2">
            <button class="btn btn-warning" onclick="suspenderUsuario('${usuario.id}')"><i class="fas fa-pause me-2"></i>Suspender Temporariamente</button>
            <button class="btn btn-danger" onclick="banirUsuario('${usuario.id}')"><i class="fas fa-ban me-2"></i>Banir Permanentemente</button>
            <button class="btn btn-success" onclick="ativarUsuario('${usuario.id}')"><i class="fas fa-check me-2"></i>Ativar Usuário</button>
            <button class="btn btn-danger" onclick="excluirUsuario('${usuario.id}')"><i class="fas fa-trash me-2"></i>Excluir Usuário</button>
          </div>
        </div>
        <button class="btn btn-primary w-100 mt-2" onclick="salvarAlteracoes('${usuario.id}')"><i class="fas fa-save me-2"></i>Salvar Alterações</button>
      </div>
      <div class="col-md-6">
        <div class="card"><div class="card-body">
          <h6 class="card-title">Informações do Usuário</h6>
          <p><strong>Data de Cadastro:</strong> ${usuario.dataCadastro}</p>
          <p><strong>Pontos Submetidos:</strong> ${usuario.pontosSubmetidos}</p>
          <p><strong>Status Atual:</strong> <span class="badge-status badge-${usuario.status}">${usuario.status}</span></p>
        </div></div>
      </div>
    </div>`;
  const modal = new bootstrap.Modal(document.getElementById('modalGerenciar'));
  modal.show();
}

function mudarStatus(id, novoStatus, msg) {
  const u = localizar(id);
  if (u) { u.status = novoStatus; alert(msg); fecharModalEAtualizar(); }
}
function suspenderUsuario(id) { if (confirm('Tem certeza que deseja suspender este usuário?')) mudarStatus(id, 'Suspenso', 'Usuário suspenso com sucesso!'); }
function banirUsuario(id)     { if (confirm('Tem certeza que deseja banir permanentemente este usuário?')) mudarStatus(id, 'Banido', 'Usuário banido com sucesso!'); }
function ativarUsuario(id)    { if (confirm('Tem certeza que deseja ativar este usuário?')) mudarStatus(id, 'Ativo', 'Usuário ativado com sucesso!'); }

function salvarAlteracoes(id) {
  const u = localizar(id);
  if (u) { u.funcao = document.getElementById('editarFuncao').value; alert('Função alterada com sucesso!'); fecharModalEAtualizar(); }
}

function excluirUsuario(id) {
  if (!confirm('Tem certeza que deseja excluir permanentemente este usuário?')) return;
  todosUsuarios = todosUsuarios.filter(u => String(u.id) !== String(id));
  alert('Usuário excluído com sucesso!');
  fecharModalEAtualizar();
}

function fecharModalEAtualizar() {
  const modalElement = document.getElementById('modalGerenciar');
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) modal.hide();
  filtrarUsuarios();
}

function novoUsuario(event) {
  event.preventDefault();
  const nome = document.getElementById('nomeUsuario').value;
  const email = document.getElementById('emailUsuario').value;
  const funcao = document.getElementById('funcaoUsuario').value;
  const novoId = String(Math.max(0, ...todosUsuarios.map(u => Number(u.id) || 0)) + 1);
  todosUsuarios.push({
    id: novoId, nome, email, funcao, status: 'Ativo', pontosSubmetidos: 0,
    ultimoAcesso: new Date().toLocaleDateString('pt-BR'),
    dataCadastro: new Date().toLocaleDateString('pt-BR')
  });
  alert('Usuário cadastrado com sucesso!');
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoUsuario'));
  if (modal) modal.hide();
  document.getElementById('formNovoUsuario').reset();
  filtrarUsuarios();
}

window.addEventListener('DOMContentLoaded', function () {
  carregarUsuarios();
  document.getElementById('btnPesquisar').addEventListener('click', filtrarUsuarios);
  document.getElementById('searchInput').addEventListener('keyup', e => { if (e.key === 'Enter') filtrarUsuarios(); });
  document.getElementById('filtroFuncao').addEventListener('change', filtrarUsuarios);
  document.getElementById('filtroStatus').addEventListener('change', filtrarUsuarios);
  document.getElementById('formNovoUsuario').addEventListener('submit', novoUsuario);
  document.getElementById('btnNovoUsuario').addEventListener('click', function () {
    new bootstrap.Modal(document.getElementById('modalNovoUsuario')).show();
  });
});
