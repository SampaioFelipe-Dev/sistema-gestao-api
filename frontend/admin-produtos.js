let idParaExcluir = null;

async function carregarProdutos() {
    const container = document.getElementById('lista-produtos-admin');
    if (!container) return;
    try {
        const response = await fetch('/produtos');
        const produtos = await response.json();
        container.innerHTML = '';
        produtos.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card-admin-produto';
            card.innerHTML = `
            <img src="${p.foto_url}" alt="${p.nome}" style="width: 100%; height: 140px; object-fit: contain; margin-bottom: 10px; border-radius: 8px; background-color: #f8f9fa; padding: 5px;">
            <div class="preco-admin">R$ ${Number(p.preco).toFixed(2)}</div>
            <h3>${p.nome}</h3>
            <p>Estoque: ${p.estoque}</p>
            <div class="acoes-admin">
                <button class="btn-acao btn-editar" onclick="abrirModalEdicao(${p.id})">📝 EDITAR</button>
                <button class="btn-acao btn-deletar" onclick="abrirModalExclusao(${p.id})">🗑️ EXCLUIR</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error(e);
    }
}

function abrirModalExclusao(id) {
    idParaExcluir = id;
    document.getElementById('modal-confirmar-exclusao').style.display = 'block';
}

function fecharModalExclusao() {
    document.getElementById('modal-confirmar-exclusao').style.display = 'none';
    idParaExcluir = null;
}

async function abrirModalEdicao(id) {
    try {
        const res = await fetch(`/produtos/${id}`);
        const p = await res.json();
        document.getElementById('edit-id').value = p.id;
        document.getElementById('edit-nome').value = p.nome;
        document.getElementById('edit-sku').value = p.sku;
        document.getElementById('edit-preco').value = p.preco;
        document.getElementById('edit-estoque').value = p.estoque;
        document.getElementById('edit-foto_url').value = p.foto_url;
        document.getElementById('edit-descricao').value = p.descricao;
        document.getElementById('modal-editar').style.display = 'block';
    } catch (e) {
        console.error(e);
    }
}

function fecharModalEdicao() {
    document.getElementById('modal-editar').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-fechar-modal')?.addEventListener('click', fecharModalEdicao);

    document.getElementById('btn-confirmar-delete')?.addEventListener('click', async () => {
        if (!idParaExcluir) return;
        await fetch(`/produtos/${idParaExcluir}`, { method: 'DELETE' });
        fecharModalExclusao();
        carregarProdutos();
    });

    document.getElementById('form-editar-modal')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const dados = {
            nome: document.getElementById('edit-nome').value,
            sku: document.getElementById('edit-sku').value,
            preco: Number(document.getElementById('edit-preco').value),
            estoque: Number(document.getElementById('edit-estoque').value),
            foto_url: document.getElementById('edit-foto_url').value,
            descricao: document.getElementById('edit-descricao').value
        };
        const res = await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (res.ok) {
            fecharModalEdicao();
            carregarProdutos();
        }
    });

    document.getElementById('btn-sair-admin')?.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});

carregarProdutos();