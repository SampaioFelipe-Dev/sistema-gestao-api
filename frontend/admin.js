document.getElementById('adminForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
                const pacote = await response.json();
                console.log('Pacote recebido é:', pacote);
                if (pacote.role === 'admin') {
                alert('Bem-vindo, administrador ');
                window.location.href = 'dashboard-admin.html';
            } else {
                alert('Acesso negado: usuário não é administrador');
            e.target.reset();
            }   
        } else {
            alert('Login falhou: ' + response.statusText);
        }   
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
    }
});
