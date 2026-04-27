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
                const itemExistente = itensnoCarrinho.find(item => item.id === produto.id);
                const qtdNoCarrinho = itemExistente ? itemExistente.quantidade : 0;
                if (qtdNoCarrinho < produto.estoque) {
                    if (itemExistente) {
                        itemExistente.quantidade ++;
                    } else {
                        itensnoCarrinho.push({ ...produto, quantidade: 1 });
                    }
                    localStorage.setItem('carrinho', JSON.stringify(itensnoCarrinho));
                    atualizarCarrinho();
                    mostrarNotificacao("Produto adicionado!");
                } else {
                    mostrarNotificacao("Limite de estoque: " + produto.estoque, "danger");
                }
        });
            }
        });
    } catch (error) {
        mostrarNotificacao("Erro ao conectar com o banco", "danger");
    }
}

document.getElementById('btnBuscar').addEventListener('click', carregarProdutos);

function atualizarCarrinho() {
    document.getElementById('contador-carrinho').innerText = itensnoCarrinho.length;
    const listaItens = document.getElementById('lista-itens');
    const totalCarrinho = document.getElementById('total-carrinho');
    if (!listaItens || !totalCarrinho) return;

    listaItens.innerHTML = '';
    let somatotal = 0;

    itensnoCarrinho.forEach((item, index) => {
        const divItem = document.createElement('div');
        divItem.className = 'item-carrinho-grid';
        divItem.innerHTML = `
        <img src="${item.foto_url}" alt="${item.nome}" class="img-carrinho">
        <div class="info-carrinho">
        <p>${item.nome}</p> <p class="preco-carrinho">R$ ${Number(item.preco).toFixed(2)}</p>
    <div class="quantidade-controls">
        <button class="btn-menos">-</button>
        <span class="quantidade-carrinho">Qtd: ${item.quantidade}</span>
        <button class="btn-mais">+</button>
    </div>
            <button class="btn-remover">✖</button>
        `;
        const btnMais = divItem.querySelector('.btn-mais');
        if (item.quantidade >= item.estoque) {
            btnMais.style.display = 'none';
        }
        const btnMenos = divItem.querySelector('.btn-menos');
        if (item.quantidade <= 1) {
            btnMenos.style.display = 'none';
        }
        divItem.querySelector('.btn-remover').addEventListener('click', () => {
            itensnoCarrinho.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(itensnoCarrinho));
            atualizarCarrinho(); 
        });
        divItem.querySelector('.btn-menos').addEventListener('click', () => {
            if (item.quantidade > 1) {
                item.quantidade -= 1;
            } else {
                itensnoCarrinho.splice(index, 1);
            }
            salvarEAtualizar();
        });
        divItem.querySelector('.btn-mais').addEventListener('click', () => {
    if (item.quantidade < item.estoque) {
        item.quantidade += 1;
        salvarEAtualizar();
    } else {
        mostrarNotificacao("Limite de estoque atingido!", "danger");
    }
});

        listaItens.appendChild(divItem);
        somatotal += Number(item.preco) * item.quantidade;
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
                itens: itensnoCarrinho
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

const btnAbrir = document.getElementById('btn-abrir-carrinho');
const btnFechar = document.getElementById('btn-fechar-carrinho');
const gaveta = document.getElementById('carrinho-flutuante');
const overlay = document.getElementById('overlay-carrinho');

btnAbrir.addEventListener('click', () => {
    gaveta.classList.add('carrinho-aberto');
    overlay.classList.add('overlay-ativo');
});
btnFechar.addEventListener('click', () => {
    gaveta.classList.remove('carrinho-aberto');
    overlay.classList.remove('overlay-ativo');
});
overlay.addEventListener('click', () => {
    gaveta.classList.remove('carrinho-aberto');
    overlay.classList.remove('overlay-ativo');
});
function salvarEAtualizar() {
    localStorage.setItem('carrinho', JSON.stringify(itensnoCarrinho));
    atualizarCarrinho();
}