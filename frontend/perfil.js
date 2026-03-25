// 1. Pega os dados da "gaveta"
const clienteId = localStorage.getItem('clienteId');
const clienteNome = localStorage.getItem('clienteNome');

// 2. Verifica login
if (!clienteId) {
    window.location.href = 'login.html';
} else {
    // Preenche os nomes na tela
    document.getElementById('boas-vindas').innerText = `Bem-vindo, ${clienteNome}`;
    document.getElementById('exibir-id').innerText = clienteId;
    
    // Chama a busca de dados
    buscarPedidosDoCliente();
}

// 3. Função que busca no servidor
async function buscarPedidosDoCliente() {
    // USAR A ROTA FILTRADA COM O ID
    const response = await fetch(`http://localhost:3000/meus-pedidos/${clienteId}`);
    const pedidos = await response.json();
    
    desenharPedidosNaTela(pedidos);
}

// 4. Função que desenha (Apenas UMA vez)
function desenharPedidosNaTela(lista) {
    const container = document.getElementById('container-pedidos'); // Nome IGUAL ao HTML
    container.innerHTML = ''; // Limpa o "Buscando..."

    if (lista.length === 0) {
        container.innerHTML = '<p>Você ainda não tem pedidos.</p>';
        return;
    }

    lista.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('card-pedido');
        div.innerHTML = `
            <p><strong>Pedido #${p.id}</strong> - ${p.nomeProduto}</p>
            <p>Total: R$ ${Number(p.total).toFixed(2)}</p>
            <hr>
        `;
        container.appendChild(div);
    });
}
document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.clear();
    alert('Você saiu da sua conta!');
    window.location.href = 'login.html';
});