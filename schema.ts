import {pgTable, serial, varchar, text, decimal, integer, timestamp, PgRole} from "drizzle-orm/pg-core";
export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(), 
  nome: varchar("nome", { length: 255 }).notNull(), 
  email: varchar("email", { length: 255 }).notNull().unique(), 
  senha: text("senha").notNull(),
  telefone: varchar("telefone", { length: 20 }), 
  cep: varchar("cep", { length: 10 }),
  rua: text("rua"),
  numero: varchar("numero", { length: 10 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }), 
  role: text("role").notNull().default("cliente")
});
export const produtos = pgTable("produtos", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  estoque: integer("estoque").notNull().default(0),
  foto_url: varchar("foto_url", { length: 255 }),
  sku: varchar("sku", { length: 100 }).notNull().unique()
});
export const pedidos = pgTable("pedidos", {
  id: serial("id").primaryKey(),
  cliente_id: integer("cliente_id").notNull().references(() => clientes.id, { onDelete: "cascade" }),
  data_pedido: timestamp("data_pedido").notNull().defaultNow(),
  status: varchar("status", { length: 20 }).notNull().default("pendente"),
  produto_id: integer("produto_id").notNull().references(() => produtos.id, { onDelete: "cascade" }),
quantidade: integer("quantidade").notNull().default(1),
total: decimal("total", { precision: 10, scale: 2 }).notNull() 
})