const areaExibicao = document.getElementById('container-principal');
let itensnoCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
document.getElementById('btnBuscar').addEventListener('click', async() => {
    areaExibicao.innerHTML = '';
    const response = await fetch('http://localhost:3000/produtos');
    const data = await response.json();
    data.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${produto.preco}</p>
            <p>Descrição: ${produto.descricao}</p>
            <p>Estoque: ${produto.estoque}</p>
            <button class="btn-comprar" data-id="${produto.id}">comprar</button>
            <img src="${produto.foto_url}" alt="${produto.nome}" width="150">
        `;
        areaExibicao.appendChild(card);
        const btn = card.querySelector('.btn-comprar');
        btn.addEventListener('click', () => {localStorage.getItem('clienteId');
            itensnoCarrinho.push(produto);
            atualizarCarrinho();
            localStorage.setItem('carrinho', JSON.stringify(itensnoCarrinho));
            const clienteId = localStorage.getItem('clienteId');
            const clienteNome = localStorage.getItem('clienteNome');
            fetch('http://localhost:3000/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cliente_id: clienteId,
                    produto_id: produto.id,
                    quantidade: 1,
                    total: produto.preco
                })
            });
            console.log('Produto selecionado para compra:', produto, clienteId, clienteNome, 'ID do produto:', produto.id, 'ID do cliente:', clienteId, 'Nome do cliente:', clienteNome);
            alert(`Produto ${produto.nome} adicionado ao carrinho!`);
        });
    });
});
function atualizarCarrinho() {
    const listaItens = document.getElementById('lista-itens');
    const totalCarrinho = document.getElementById('total-carrinho');
    listaItens.innerHTML = '';
    let somatotal = 0;
    itensnoCarrinho.forEach(item => {
        const p = document.createElement('p');
        p.innerText = `${item.nome} - R$ ${item.preco}`;
        listaItens.appendChild(p);
        somatotal += Number(item.preco);
    });
    totalCarrinho.innerText = somatotal.toFixed(2);
}