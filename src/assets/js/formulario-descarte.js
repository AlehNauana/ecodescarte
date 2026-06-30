const configuracaoFormularioJSON = `{
  "page": {
    "title": "Formulário de Descarte",
    "subtitle": "Informe os resíduos que deseja descartar",
    "form": {
      "sections": [
        {
          "id": "tipo_residuo",
          "label": "Tipo de Resíduo",
          "type": "button_group",
          "options": [
            { "id": "organico", "label": "Orgânico" },
            { "id": "metal", "label": "Metal" },
            { "id": "seringa", "label": "Seringa" },
            { "id": "eletronico", "label": "Eletrônico" },
            { "id": "quimico", "label": "Químico" }
          ]
        },
        {
          "id": "endereco_usuario",
          "label": "Endereço",
          "type": "text_input",
          "placeholder": "Digite seu endereço ou CEP"
        }
      ]
    }
  }
}`;

let selectedResidueType = '';

window.onload = function () {
  const dadosConfig = JSON.parse(configuracaoFormularioJSON);
  console.log('JSON de Configuração da Tela carregado:', dadosConfig);

  let loggedInUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!loggedInUser) {
    loggedInUser = {
      name: 'Alexandra Nauna',
      email: 'alexandra@eccodescarte.com',
    };
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
  }

  document.getElementById('session-user-name').innerText = loggedInUser.name;
};

function switchScreen(screenId) {
  document.getElementById('screen-form').classList.add('hidden');
  document.getElementById('screen-results').classList.add('hidden');

  document.getElementById(screenId).classList.remove('hidden');
}

function selectResidue(buttonElement, type) {
  const buttons = document.querySelectorAll('.residue-btn');
  buttons.forEach(btn => btn.classList.remove('selected'));

  buttonElement.classList.add('selected');
  selectedResidueType = type;
  document.getElementById('form-error').classList.add('hidden');
}

function handleSearchPoints() {
  const address = document.getElementById('user-address').value;
  const errorAlert = document.getElementById('form-error');

  if (!selectedResidueType || !address.trim()) {
    errorAlert.classList.remove('hidden');
    return;
  }

  errorAlert.classList.add('hidden');

  const dadosDescarteObj = {
    solicitacao: {
      usuarioLogado: JSON.parse(localStorage.getItem('currentUser')).name,
      tipoResiduoSelecionado: selectedResidueType,
      enderecoBusca: address,
      dataHoraSolicitacao: new Date().toISOString(),
    },
  };

  console.log(
    'JSON de Envio gerado:\n',
    JSON.stringify(dadosDescarteObj, null, 2),
  );

  document.getElementById('result-residue-type').innerText =
    selectedResidueType;
  document.getElementById('result-user-address').innerText = address;

  switchScreen('screen-results');
}
