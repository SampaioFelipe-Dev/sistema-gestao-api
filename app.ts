import { eq, sql } from 'drizzle-orm';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from "./db.js";
import { clientes, produtos, pedidos } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/produtos', async (req: Request, res: Response) => {
    try {
        const lista = await db.select().from(produtos);
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar" });
    }
});

app.get('/produtos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const produto = await db.select().from(produtos).where(eq(produtos.id, Number(id)));
        res.json(produto[0]);
    } catch (error) {
        res.status(404).json({ error: "Não encontrado" });
    }
});

app.post('/produtos', async (req: Request, res: Response) => {
    try {
        await db.insert(produtos).values(req.body);
        res.status(201).json({ message: "OK" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar" });
    }
});

app.put('/produtos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { id: _, ...updateData } = req.body;
        await db.update(produtos).set(updateData).where(eq(produtos.id, Number(id)));
        res.json({ message: "OK" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar" });
    }
});

app.delete('/produtos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(produtos).where(eq(produtos.id, Number(id)));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir" });
    }
});

app.post('/clientes', async (req: Request, res: Response) => {
    try {
        const { nome, email, senha } = req.body;
        const hash = await bcrypt.hash(senha, 10);
        await db.insert(clientes).values({ nome, email, senha: hash, role: 'cliente' });
        res.status(201).json({ message: "OK" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar conta" });
    }
});

app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;
        const user = await db.select().from(clientes).where(eq(clientes.email, email));
        if (user.length === 0) return res.status(404).json({ error: "Inexistente" });
        const match = await bcrypt.compare(senha, user[0].senha);
        if (!match) return res.status(401).json({ error: "Incorreta" });
        res.json({ clienteid: user[0].id, nome: user[0].nome, role: user[0].role });
    } catch (error) {
        res.status(500).json({ error: "Erro" });
    }
});

app.post('/pedidos', async (req: Request, res: Response) => {
    try {
        const { cliente_id, itens } = req.body;
        const vendaId = `COMPRA-${Date.now()}`; 

        for (const item of itens) {
            await db.insert(pedidos).values({
                venda_id: vendaId, 
                cliente_id,
                produto_id: item.id,
                quantidade: 1,
                total: item.preco
            });

            const [prod] = await db.select().from(produtos).where(eq(produtos.id, item.id));
            await db.update(produtos).set({ estoque: prod.estoque - 1 }).where(eq(produtos.id, item.id));
        }

        res.status(201).json({ message: "Venda unificada com sucesso!" });
    } catch (e) {
        res.status(500).json({ error: "Erro ao processar venda" });
    }
});

app.get('/meus-pedidos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lista = await db.select({
            venda: pedidos.venda_id,
            totalGeral: sql`sum(${pedidos.total})`,
            itens: sql`string_agg(${produtos.nome}, ', ')`,
            status: sql`MAX(${pedidos.status})` 
        })
        .from(pedidos)
        .leftJoin(produtos, eq(pedidos.produto_id, produtos.id))
        .where(eq(pedidos.cliente_id, Number(id)))
        .groupBy(pedidos.venda_id);
        
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico" });
    }
});
app.put('/pedidos/:venda_id/cancelar', async (req: Request, res: Response) => {
    try {
        const venda_id = String(req.params.venda_id);
        const { motivo } = req.body;

        const itensPedido = await db.select().from(pedidos).where(eq(pedidos.venda_id, venda_id));
        
        if (itensPedido.length === 0) return res.status(404).json({ error: "Pedido não encontrado" });
        if (itensPedido[0].status === 'Cancelado') return res.status(400).json({ error: "Já estava cancelado" });

        await db.update(pedidos)
            .set({ status: 'Cancelado', motivo_cancelamento: motivo })
            .where(eq(pedidos.venda_id, venda_id));

        for (const item of itensPedido) {
            const [prod] = await db.select().from(produtos).where(eq(produtos.id, Number(item.produto_id)));
            await db.update(produtos)
                .set({ estoque: prod.estoque + item.quantidade })
                .where(eq(produtos.id, Number(item.produto_id)));
        }

        res.json({ message: "Pedido cancelado e estoque devolvido." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cancelar" });
    }
});
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 SERVIDOR ATIVO: http://localhost:${port}`);
});