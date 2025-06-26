# Configuração do Banco de Dados Neon DB

## 1. Criar conta no Neon DB

1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Anote as credenciais de conexão

## 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
```

Substitua `[USER]`, `[PASSWORD]`, `[HOST]` e `[DATABASE]` pelos valores fornecidos pelo Neon DB.

## 3. Comandos úteis

### Gerar cliente Prisma
```bash
yarn db:generate
```

### Sincronizar schema com o banco
```bash
yarn db:push
```

### Criar e aplicar migrações
```bash
yarn db:migrate
```

### Aplicar migrações em produção
```bash
yarn db:migrate:deploy
```

### Abrir Prisma Studio
```bash
yarn db:studio
```

### Executar seeds
```bash
yarn db:seed
```

## 4. Estrutura do banco

O projeto já possui o modelo `Modality` configurado:

```prisma
model Modality {
  id        String    @id @default(uuid())
  name      String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@map("modalities")
}
```

## 5. Configurações otimizadas para Neon DB

- **driverAdapters**: Habilitado para melhor performance
- **directUrl**: Configurado para conexões diretas
- **Logs**: Configurados para desenvolvimento e produção
- **Connection pooling**: Gerenciado automaticamente pelo Neon DB

## 6. Primeiros passos

1. Configure o arquivo `.env` com suas credenciais do Neon DB
2. Execute `yarn db:generate` para gerar o cliente Prisma
3. Execute `yarn db:push` para sincronizar o schema
4. Execute `yarn db:seed` para popular dados iniciais
5. Execute `yarn db:studio` para visualizar o banco

## 7. Troubleshooting

### Erro de conexão
- Verifique se a URL do banco está correta
- Confirme se o SSL está habilitado (`sslmode=require`)
- Verifique se o IP está liberado no Neon DB

### Erro de migração
- Execute `yarn db:generate` antes de migrar
- Verifique se o schema está válido
- Use `yarn db:push` para desenvolvimento rápido 