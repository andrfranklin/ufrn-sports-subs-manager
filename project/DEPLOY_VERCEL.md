# Deploy na Vercel

## 1. Preparação

### Instalar Vercel CLI (opcional)
```bash
npm i -g vercel
```

### Verificar se o projeto está pronto
```bash
npm run build
```

## 2. Deploy via GitHub (Recomendado)

### Passo 1: Push para GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Passo 2: Conectar na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe o repositório do GitHub
5. Configure as variáveis de ambiente

## 3. Variáveis de Ambiente na Vercel

### Configurar no Dashboard da Vercel:
1. Vá para o projeto na Vercel
2. Settings → Environment Variables
3. Adicione as seguintes variáveis:

```
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

**Importante**: Use a URL de produção do Neon DB (não a de desenvolvimento)

## 4. Deploy via CLI (Alternativo)

### Login na Vercel
```bash
vercel login
```

### Deploy
```bash
vercel --prod
```

## 5. Configurações Específicas

### Neon DB em Produção
- Use a URL de produção do Neon DB
- Configure o IP da Vercel no Neon DB se necessário
- Use connection pooling para melhor performance

### Prisma em Produção
```bash
# Na Vercel, adicione este comando no build
npx prisma generate
npx prisma migrate deploy
```

## 6. Verificação Pós-Deploy

### Testar as APIs
- `https://seu-projeto.vercel.app/api/modalities`
- `https://seu-projeto.vercel.app/api/modality`

### Verificar logs
- Dashboard da Vercel → Functions → Logs

## 7. Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o `DATABASE_URL` está configurado
- Verifique os logs de build na Vercel

### Erro de Conexão com Banco
- Confirme se a URL do Neon DB está correta
- Verifique se o SSL está habilitado
- Teste a conexão localmente

### Erro de Prisma
- Execute `npx prisma generate` no build
- Verifique se o schema está válido
- Confirme se as migrações foram aplicadas

## 8. Otimizações

### Performance
- Use `@vercel/postgres` se possível
- Configure caching adequado
- Otimize as queries do Prisma

### Segurança
- Nunca commite o `.env` no GitHub
- Use variáveis de ambiente da Vercel
- Configure CORS adequadamente 