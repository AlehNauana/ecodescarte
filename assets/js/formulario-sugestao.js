const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const endereco = document.getElementById("endereco").value;

    const residuo = document.getElementById("residuo").value;

    const observacao = document.getElementById("observacao").value;

    console.log("Endereço:", endereco);
    console.log("Resíduo:", residuo);
    console.log("Observação:", observacao);

    const mensagem = document.getElementById("mensagem");

    mensagem.innerText = "Sugestão enviada com sucesso!";

    formulario.reset();
});