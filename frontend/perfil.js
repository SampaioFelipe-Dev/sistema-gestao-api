const clienteId = localStorage.getItem('clienteId');
const clienteNome = localStorage.getItem('clienteNome');
const userRole = localStorage.getItem('userRole');

document.addEventListener('DOMContentLoaded', () => {
    if (!clienteId || clienteId === 'null') {
        window.location.href = 'login.html';
        return;
    }

    const elemBoasVindas = document.getElementById('boas-vindas') || document.getElementById('nome-cliente');
    const elemId = document.getElementById('exibir-id') || document.getElementById('id-cliente');
    
    if (elemBoasVindas) elemBoasVindas.innerText = `Bem-vindo, ${clienteNome}`;
    if (elemId) elemId.innerText = clienteId;

    if (userRole?.trim() === 'admin') {
        const btnAdmin = document.getElementById('btn-admin');
        if (btnAdmin) btnAdmin.style.display = 'inline-block';
    }

    buscarPedidos(clienteId);
    
    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            localStorage.clear();
            mostrarNotificacao('Você saiu da sua conta!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
});

async function buscarPedidos(id) {
    const container = document.getElementById('container-pedidos') || document.getElementById('lista-pedidos');
    if (!container) return;

    try {
        const response = await fetch(`/meus-pedidos/${id}`);
        
        if (!response.ok) {
            container.innerHTML = '<p>Erro ao carregar histórico.</p>';
            return;
        }

        const pedidos = await response.json();

        if (pedidos.length === 0) {
            container.innerHTML = '<p>Você ainda não realizou pedidos.</p>';
            return;
        }

        container.innerHTML = pedidos.map(p => {
            const isCancelado = p.status === 'Cancelado';
            const corBorda = isCancelado ? '#dc3545' : '#1a237e'; 
            
            const badgeStatus = isCancelado 
                ? `<span style="color: #dc3545; font-weight: bold;">🚫 Cancelado</span>` 
                : `<span style="color: #28a745; font-weight: bold;">✅ Aprovado</span>`;

            const btnCancelar = isCancelado 
                ? '' 
                : `<button onclick="cancelarPedido('${p.venda}')" style="margin-top: 10px; background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s;">Cancelar Pedido</button>`;

            return `
            <div class="item-pedido" style="margin-bottom: 15px; padding: 15px; border-left: 5px solid ${corBorda}; background: #f8f9fa; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p style="margin: 0 0 5px 0; color: ${corBorda};"><strong>🛒 Compra: ${p.venda}</strong></p>
                    ${badgeStatus}
                </div>
                <p style="margin: 0 0 5px 0; color: #555;"><strong>Itens:</strong> ${p.itens}</p>
                <p style="margin: 0; font-weight: bold; color: #333;">Total: R$ ${Number(p.totalGeral).toFixed(2)}</p>
                ${btnCancelar}
            </div>
            `;
        }).join('');

    } catch (error) {
        container.innerHTML = '<p>Servidor indisponível.</p>';
    }
}

let pedidoParaCancelar = null; 

window.cancelarPedido = (vendaId) => {
    pedidoParaCancelar = vendaId;
    document.getElementById('motivo-texto').value = ''; 
    document.getElementById('modal-cancelamento').style.display = 'flex'; 
};

document.getElementById('btn-fechar-modal-canc')?.addEventListener('click', () => {
    document.getElementById('modal-cancelamento').style.display = 'none';
    pedidoParaCancelar = null;
});

document.getElementById('btn-confirmar-canc')?.addEventListener('click', async () => {
    const motivo = document.getElementById('motivo-texto').value;

    if (!motivo || motivo.trim() === "") {
        mostrarNotificacao("Por favor, digite um motivo para nos ajudar a melhorar.", "danger");
        return;
    }

    try {
        const response = await fetch(`/pedidos/${pedidoParaCancelar}/cancelar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ motivo: motivo })
        });

        if (response.ok) {
            mostrarNotificacao("Pedido cancelado com sucesso!", "success");
            document.getElementById('modal-cancelamento').style.display = 'none'; 
            buscarPedidos(localStorage.getItem('clienteId'));
        } else {
            mostrarNotificacao("Erro ao cancelar o pedido.", "danger");
        }
    } catch (error) {
        mostrarNotificacao("Erro de conexão com o banco.", "danger");
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
    toast.innerHTML = `${tipo === 'success' ? '✅' : '🚪'} ${mensagem}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}