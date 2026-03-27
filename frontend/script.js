const areaExibicao = document.getElementById('container-principal');
let itensnoCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
document.getElementById('btnBuscar').addEventListener('click', async() => {
    areaExibicao.innerHTML = '';
    const response = await fetch('/produtos');
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
            alert("Adicionado ao carrinho!" );
        });
        });
    });
function atualizarCarrinho() {
    const listaItens = document.getElementById('lista-itens');
    const totalCarrinho = document.getElementById('total-carrinho');
    listaItens.innerHTML = '';
    let somatotal = 0;
   itensnoCarrinho.forEach((item, index) => {
    const p = document.createElement('p');
    p.innerText = `${item.nome} - R$ ${item.preco} `;
    const btnRemover = document.createElement('button');
    btnRemover.innerText = "X";
    btnRemover.addEventListener('click', () => {
        itensnoCarrinho.splice(index, 1);
        localStorage.setItem('carrinho', JSON.stringify(itensnoCarrinho));
        atualizarCarrinho(); 
    });
    p.appendChild(btnRemover); 
    listaItens.appendChild(p);
    somatotal += Number(item.preco);
   });
   totalCarrinho.innerText = somatotal.toFixed(2);
}
const btnFinalizar = document.getElementById('btn-finalizar');
btnFinalizar.addEventListener('click', async () => {
    if (itensnoCarrinho.length === 0) {
        alert("Carrinho Vazio!");
        return;
    }
    const clienteId = localStorage.getItem('clienteId');
    if (!clienteId) {
        alert("Login Necessário!");
        return;
    }
for (const item of itensnoCarrinho) {
            const resposta = await fetch('/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cliente_id: Number(clienteId),
                    produto_id: item.id,
                    quantidade: 1,
                    total: item.preco
                })
            });

            if (!resposta.ok) {
                throw new Error("O servidor recusou o pedido!"); 
            }
        }
itensnoCarrinho = []; 
    localStorage.removeItem('carrinho'); 
    atualizarCarrinho(); 
    alert("Compra finalizada com sucesso!");
});