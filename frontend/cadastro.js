document.getElementById('cadastroForm').addEventListener('submit', async (e) => { e.preventDefault();   
    console.log('Formulário de cadastro enviado');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
        const response = await fetch('http://localhost:3000/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const dadosDoServidor = await response.json();

            localStorage.setItem('clienteId', dadosDoServidor.clienteid);
            localStorage.setItem('clienteNome', dadosDoServidor.nome);
            localStorage.setItem('userRole', dadosDoServidor.role);
            
            alert(dadosDoServidor.message); 

            if (dadosDoServidor.role === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else {
                window.location.href = 'index.html';
            }

        } else {
            const erroDoServidor = await response.json();
            alert(erroDoServidor.error); 
        }

    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Servidor fora do ar!');
    }
});