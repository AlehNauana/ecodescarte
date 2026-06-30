/* Semente de dados (mock) — caso a tela seja aberta isoladamente, garante
   que o resumo de moderação tenha conteúdo. Em operação real, estes dados
   viriam do módulo de Moderação / de uma API. */
if (!localStorage.getItem("pontosColeta")) {
  localStorage.setItem("pontosColeta", JSON.stringify([
    { id: 1, nome: "EcoPonto Centro",   endereco: "Rua das Flores, 123 - Centro",  data: "2026-05-28", status: "Pendente" },
    { id: 2, nome: "Recicla Norte",     endereco: "Av. Brasil, 500",               data: "2026-05-29", status: "Pendente" },
    { id: 3, nome: "Eco Verde",         endereco: "Rua Amazonas, 45",              data: "2026-05-30", status: "Aprovado" },
    { id: 4, nome: "Ponto Sustentável", endereco: "Av. Afonso Pena, 2100",         data: "2026-06-01", status: "Recusado" },
    { id: 5, nome: "EcoTech",           endereco: "Rua dos Andradas, 700",         data: "2026-06-02", status: "Aprovado" }
  ]));
}

let paginaAtual = 1;
const itensPorPagina = 5;

let moderador = JSON.parse(
    localStorage.getItem("moderador")
);

if (!moderador) {

    moderador = {
        nome: "Carlos Moderador",
        cargo: "Moderador Secundário",
        dataCadastro: "15/01/2026",
        senha: "123456"
    };

} else if (!moderador.senha) {

    moderador.senha = "123456";
}

localStorage.setItem(
    "moderador",
    JSON.stringify(moderador)
);

function inicializarPerfilModerador() {

    carregarPerfilModerador();
    carregarEstatisticasModeracao();
    renderizarHistoricoModeracao();
}
function carregarPerfilModerador() {

    const moderador = JSON.parse(
        localStorage.getItem("moderador")
    );

    if (!moderador) return;

    document.getElementById("TelaNomeModerador")
        .textContent = moderador.nome;

    document.getElementById("TelaCargo")
        .textContent = moderador.cargo;

    document.getElementById("TelaDataModerador")
        .textContent = moderador.dataCadastro;

    document.getElementById("nomeImg")
        .textContent = moderador.nome
        .split(" ")
        .map(nome => nome[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function carregarEstatisticasModeracao() {

    const pontos = JSON.parse(
        localStorage.getItem("pontosColeta")
    ) || [];

    const pendentes =
        pontos.filter(
            p => p.status === "Pendente"
        ).length;

    const aprovados =
        pontos.filter(
            p => p.status === "Aprovado"
        ).length;

    const recusados =
        pontos.filter(
            p => p.status === "Recusado"
        ).length;

    document.getElementById("TotalPendentes")
        .textContent = pendentes;

    document.getElementById("TotalAprovados")
        .textContent = aprovados;

    document.getElementById("TotalRecusados")
        .textContent = recusados;

    document.getElementById("TelaPontosModerados")
        .textContent = aprovados + recusados;
}

function renderizarHistoricoModeracao() {

    const container =
        document.getElementById(
            "TelaHistoricoModeracao"
        );

    const pontos = JSON.parse(
        localStorage.getItem("pontosColeta")
    ) || [];

    const moderados = pontos.filter(
        ponto =>
            ponto.status === "Aprovado" ||
            ponto.status === "Recusado"
    ).reverse();

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                moderados.length /
                itensPorPagina
            )
        );

    const inicio =
        (paginaAtual - 1) *
        itensPorPagina;

    const fim =
        inicio +
        itensPorPagina;

    const pagina =
        moderados.slice(
            inicio,
            fim
        );

    container.innerHTML = "";

    if (moderados.length === 0) {

        container.innerHTML = `
            <div class="alert alert-secondary">
                Nenhuma ação de moderação encontrada.
            </div>
        `;

        return;
    }

    pagina.forEach(ponto => {

        const badge =
            ponto.status === "Aprovado"
                ? "badge-aprovado"
                : "badge-recusado";

        container.innerHTML += `

            <div class="atividade-card mb-3">

                <div class="d-flex justify-content-between align-items-center">

                    <div>

                        <div class="atividade-titulo">
                            ${ponto.nome}
                        </div>

                        <div class="atividade-info">
                            ${ponto.endereco}
                        </div>

                        <div class="atividade-info">
                            ${ponto.data}
                        </div>

                    </div>

                    <span class="${badge}">
                        ${ponto.status}
                    </span>

                </div>

            </div>

        `;
    });

    container.innerHTML += `

        <div class="d-flex justify-content-between align-items-center mt-4">

            <button
                class="btn btn-outline-secondary"
                onclick="paginaAnterior()"
                ${paginaAtual === 1 ? "disabled" : ""}>

                ← Anterior

            </button>

            <span class="fw-bold">
                Página ${paginaAtual} de ${totalPaginas}
            </span>

            <button
                class="btn btn-outline-secondary"
                onclick="proximaPagina()"
                ${paginaAtual === totalPaginas ? "disabled" : ""}>

                Próxima →

            </button>

        </div>

    `;
}

function proximaPagina() {

    const pontos = JSON.parse(
        localStorage.getItem("pontosColeta")
    ) || [];

    const totalPaginas =
        Math.ceil(
            pontos.filter(
                p =>
                    p.status === "Aprovado" ||
                    p.status === "Recusado"
            ).length /
            itensPorPagina
        );

    if (paginaAtual < totalPaginas) {

        paginaAtual++;

        renderizarHistoricoModeracao();
    }
}

function paginaAnterior() {

    if (paginaAtual > 1) {

        paginaAtual--;

        renderizarHistoricoModeracao();
    }
}

function abrirModalSenha() {

    const modal = new bootstrap.Modal(
        document.getElementById("modalSenha")
    );

    modal.show();
}

function alterarSenha() {

    const senhaAtual =
        document.getElementById("senhaAtual").value;

    const novaSenha =
        document.getElementById("novaSenha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    const moderador = JSON.parse(
        localStorage.getItem("moderador")
    );

    if (senhaAtual !== moderador.senha) {

        alert("Senha atual incorreta.");

        return;
    }

    if (novaSenha.length < 6) {

        alert(
            "A nova senha deve possuir pelo menos 6 caracteres."
        );

        return;
    }

    if (novaSenha !== confirmarSenha) {

        alert("As senhas não coincidem.");

        return;
    }

    moderador.senha = novaSenha;

    localStorage.setItem(
        "moderador",
        JSON.stringify(moderador)
    );

    document.getElementById("senhaAtual").value = "";
    document.getElementById("novaSenha").value = "";
    document.getElementById("confirmarSenha").value = "";

    bootstrap.Modal.getInstance(
        document.getElementById("modalSenha")
    ).hide();

    alert("Senha alterada com sucesso!");
}