var Administradores = [

{
    id: 1,
    nome: "Carlos Henrique",
    email: "carlos@ecodescarte.com",
    status: "Ativo"
},

{
    id: 2,
    nome: "Mariana Silva",
    email: "mariana@ecodescarte.com",
    status: "Ativo"
}

];

function ExibirAdministradores() {

    let tela = document.getElementById('TelaAdministradores');

    let textoHtml = "";

    for(let x = 0; x < Administradores.length; x++) {

        textoHtml += `

            <div class="card-admin">

                <div class="d-flex justify-content-between align-items-center">

                    <div>

                        <h5>
                            ${Administradores[x].nome}
                        </h5>

                        <p class="m-0">
                            ${Administradores[x].email}
                        </p>

                    </div>

                    <button
                        class="btn btn-danger"
                        onclick="RemoverAdministrador(${x})"
                    >
                        Remover
                    </button>

                </div>

            </div>

        `;
    }

    tela.innerHTML = textoHtml;
}

function AdicionarAdministrador() {

    let nome = document.getElementById('NomeAdmin').value;

    let email = document.getElementById('EmailAdmin').value;

    if(nome == "" || email == "") {

        alert("Preencha todos os campos!");

        return;
    }

    Administradores.push({

        id: Administradores.length + 1,

        nome: nome,

        email: email,

        status: "Ativo"
    });

    document.getElementById('NomeAdmin').value = "";

    document.getElementById('EmailAdmin').value = "";

    ExibirAdministradores();
}

function RemoverAdministrador(indice) {

    Administradores.splice(indice, 1);

    ExibirAdministradores();
}

ExibirAdministradores();