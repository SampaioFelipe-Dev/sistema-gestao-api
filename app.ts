import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { db } from "./db.js";
import { clientes, produtos, pedidos } from './schema.js';
import { eq } from 'drizzle-orm';

const app: Express = express();
const port = process.env.PORT || 3000;

// --- Middlewares ---
app.use(express.static('frontend'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROTAS DE PRODUTOS ---

// Listar todos os produtos
app.get('/produtos', async (req: Request, res: Response) => {
    try {
        const lista = await db.select().from(produtos);
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar produtos" });
    }
});

// Buscar um produto específico
app.get('/produtos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const produto = await db.select().from(produtos).where(eq(produtos.id, Number(id)));
        if (produto.length === 0) return res.status(404).json({ erro: "Produto não encontrado" });
        res.json(produto[0]);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar produto" });
    }
});

// Criar produto
app.post('/produtos', async (req: Request, res: Response) => {
    try {
        const { nome, descricao, preco, estoque, foto_url, sku } = req.body;
        const novo = await db.insert(produtos).values({ nome, descricao, preco, estoque, foto_url, sku }).returning();
        res.status(201).json(novo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// Editar produto
app.put('/produtos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.update(produtos).set(req.body).where(eq(produtos.id, Number(id)));
        res.status(200).json({ message: "Produto atualizado" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
});

// Excluir produto
app.delete('/produtos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(produtos).where(eq(produtos.id, Number(id)));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir produto" });
    }
});

// --- ROTAS DE CLIENTES ---

app.post('/clientes', async (req: Request, res: Response) => {
    try {
        const { nome, email, senha, ...outros } = req.body;
        const hashedPassword = await bcrypt.hash(senha, 10);
        await db.insert(clientes).values({ ...outros, nome, email, senha: hashedPassword });
        res.status(201).json({ message: 'Cliente criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar cliente" });
    }
});

app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;
        const cliente = await db.select().from(clientes).where(eq(clientes.email, email));
        
        if (cliente.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });

        const isPasswordValid = await bcrypt.compare(senha, cliente[0].senha);
        if (!isPasswordValid) return res.status(401).json({ error: 'Senha incorreta' });

        res.json({
            message: 'Login realizado com sucesso',
            clienteid: cliente[0].id,
            nome: cliente[0].nome,
            role: cliente[0].role
        });
    } catch (error) {
        res.status(500).json({ error: "Erro no login" });
    }
});

// --- ROTAS DE PEDIDOS ---

// Listar pedidos (com nomes de cliente e produto)
app.get('/pedidos', async (req: Request, res: Response) => {
    try {
        const lista = await db.select({
            id: pedidos.id,
            clienteNome: clientes.nome,
            nomeProduto: produtos.nome,
            quantidade: pedidos.quantidade,
            total: pedidos.total,
        })
        .from(pedidos)
        .leftJoin(clientes, eq(pedidos.cliente_id, clientes.id))
        .leftJoin(produtos, eq(pedidos.produto_id, produtos.id));
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar pedidos" });
    }
});

// Criar pedido
app.post('/pedidos', async (req: Request, res: Response) => {
    try {
        const novo = await db.insert(pedidos).values(req.body).returning();
        res.status(201).json(novo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});

// Buscar pedidos de UM cliente específico
app.get('/meus-pedidos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lista = await db.select({
            id: pedidos.id,
            nomeProduto: produtos.nome,
            quantidade: pedidos.quantidade,
            total: pedidos.total,
        })
        .from(pedidos)
        .leftJoin(produtos, eq(pedidos.produto_id, produtos.id))
        .where(eq(pedidos.cliente_id, Number(id)));
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar seus pedidos" });
    }
});

// --- INICIALIZAÇÃO ---
// Agora fora de qualquer função, para rodar assim que o arquivo iniciar
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});