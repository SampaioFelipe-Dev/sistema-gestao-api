document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Formulário de login enviado');
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
            const dadosDoServidor = await response.json();

            localStorage.setItem('clienteId', dadosDoServidor.clienteid);
            localStorage.setItem('clienteNome', dadosDoServidor.nome);
            localStorage.setItem('userRole', dadosDoServidor.role);
            
            alert(dadosDoServidor.message); 

            if (dadosDoServidor.role.trim() === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else {
                window.location.href = 'index.html';
            }

        } else {
            const erroDoServidor = await response.json();
            alert(erroDoServidor.error || 'Senha ou email incorretos.'); 
        }

    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Servidor fora do ar ou erro de rede!');
    }
}); 
