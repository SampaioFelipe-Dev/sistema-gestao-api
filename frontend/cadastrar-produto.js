document.getElementById('formAdicionarProduto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.preco = Number(data.preco);
    data.estoque = Number(data.estoque);

    try {
        const response = await fetch('/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            mostrarNotificacao("Produto adicionado ao catálogo!");
            setTimeout(() => {
                window.location.href = 'dashboard-admin.html';
            }, 1500);
        } else {
            const erro = await response.json();
            mostrarNotificacao(erro.error || "Falha ao cadastrar produto", 'danger');
        }
    } catch (error) {
        mostrarNotificacao("Erro de conexão com o servidor", 'danger');
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
    toast.classList.add('toast');
    if (tipo === 'danger') toast.classList.add('danger');
    toast.innerHTML = tipo === 'success' ? `✅ ${mensagem}` : `❌ ${mensagem}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}