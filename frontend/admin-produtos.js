document.querySelector('#adminForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Formulário enviado');
    const formData = new FormData(event.target);
    const dadosEmpacotados = Object.fromEntries(formData);
    console.log(dadosEmpacotados);
    try {
        const response = await fetch('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosEmpacotados)
        });
const divproduto = document.createElement('div');
divproduto.innerHTML = `
<p>${produto.nome} - R$ ${produto.preco}</p>
<button class="btn-excluir" data-id="${produto.id}"</button>
`;
arealista.appendChild(divproduto);
const botao = divProduto.querySelector('.btn-excluir');
botao.addEventListener('click', () => {
    excluirProduto(produto.id);
});
if (response.ok) {
    const data = await response.json();
    console.log('Produto cadastrado com sucesso:', data);
    alert('Produto cadastrado com sucesso!');
    event.target.reset();
} else {    console.error('Erro ao cadastrar produto:', response.statusText);
    alert('Erro ao cadastrar produto');
}
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        alert('Erro ao cadastrar produto');
    }
});
async function excluirProduto(id) {
    const confirmacao = confirm("Deseja realmente excluir este produto?");
    if (confirmacao) {
        try {
            const response = await fetch(`/produtos/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert("Produto removido!");
                location.reload();
            }
        } catch (error) {
            console.error("Erro na conexão:", error);
        }
    }
}