const areaExibicao = document.getElementById('container-principal');
let itensnoCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

async function carregarProdutos() {
    areaExibicao.innerHTML = '<p>Atualizando estoque...</p>';
    try {
        const response = await fetch('/produtos');
        const data = await response.json();
        areaExibicao.innerHTML = '';
        
        data.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'card-produto'; 
            card.innerHTML = `
                <img src="${produto.foto_url}" alt="${produto.nome}" class="img-produto">
                <h3 class="authoritative-text">${produto.nome}</h3>
                <p class="preco-vitrine">R$ ${Number(produto.preco).toFixed(2)}</p>
                <p>Estoque disponível: <strong>${produto.estoque}</strong></p>
                <p class="desc-vitrine">${produto.descricao}</p>
                <button class="btn-comprar" ${produto.estoque <= 0 ? 'disabled' : ''}>
                    ${produto.estoque <= 0 ? 'ESGOTADO' : 'ADICIONAR AO CARRINHO'}
                </button>
            `;
            areaExibicao.appendChild(card);

            if (produto.estoque > 0) {
                card.querySelector('.btn-comprar').addEventListener('click', () => {
                    itensnoCarrinho.push(produto);
                    localStorage.setItem('carrinho', JSON.stringify(itensnoCarrinho));
                    atualizarCarrinho();
                    mostrarNotificacao("Produto adicionado!");
                });
            }
        });
    } catch (error) {
        mostrarNotificacao("Erro ao conectar com o banco", "danger");
    }
}

document.getElementById('btnBuscar').addEventListener('click', carregarProdutos);

function atualizarCarrinho() {
    const listaItens = document.getElementById('lista-itens');
    const totalCarrinho = document.getElementById('total-carrinho');
    if (!listaItens || !totalCarrinho) return;

    listaItens.innerHTML = '';
    let somatotal = 0;

    itensnoCarrinho.forEach((item, index) => {
        const divItem = document.createElement('div');
        divItem.className = 'item-carrinho-lista';
        divItem.innerHTML = `
            <span>${item.nome} - R$ ${Number(item.preco).toFixed(2)}</span>
            <button class="btn-remover">✖</button>
        `;
        
        divItem.querySelector('.btn-remover').addEventListener('click', () => {
            itensnoCarrinho.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(itensnoCarrinho));
            atualizarCarrinho(); 
        });

        listaItens.appendChild(divItem);
        somatotal += Number(item.preco);
    });

    totalCarrinho.innerText = somatotal.toFixed(2);
}

document.getElementById('btn-finalizar').addEventListener('click', async () => {
    if (itensnoCarrinho.length === 0) return;

    const clienteId = localStorage.getItem('clienteId');
    
    try {
        const res = await fetch('/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cliente_id: Number(clienteId),
                itens: itensnoCarrinho // Enviando a lista toda de uma vez
            })
        });

        if (res.ok) {
            itensnoCarrinho = [];
            localStorage.removeItem('carrinho');
            atualizarCarrinho();
            mostrarNotificacao("Compra realizada com sucesso!");
            carregarProdutos();
        }
    } catch (e) {
        mostrarNotificacao("Erro na conexão", "danger");
    }
});

function mostrarNotificacao(mensagem, tipo = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${tipo === 'danger' ? 'danger' : ''}`;
    toast.innerHTML = `${tipo === 'success' ? '✅' : '❌'} ${mensagem}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', atualizarCarrinho);