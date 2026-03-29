document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('clienteId', data.clienteid);
            localStorage.setItem('clienteNome', data.nome);
            localStorage.setItem('userRole', data.role);
            
            mostrarNotificacao(data.message);
            
            setTimeout(() => {
                window.location.href = data.role.trim() === 'admin' 
                    ? 'dashboard-admin.html' 
                    : 'index.html';
            }, 1500);
        } else {
            mostrarNotificacao(data.error || 'Credenciais inválidas', 'danger'); 
        }
    } catch (error) {
        mostrarNotificacao('Erro de conexão com o servidor', 'danger');
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