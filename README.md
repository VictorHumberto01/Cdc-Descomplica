# 🧭 Guia de Commits, Pull Requests e Execução do Projeto

## ✨ Commits

**Formato:**
```
tipo: descrição curta e clara

Por que fez essa alteração? (opcional)
```

**Tipos:**
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `refactor`: refatoração
- `test`: testes

**Exemplos:**
```
feat: adiciona tela de login
- Implementa formulário com email e senha
- Adiciona validações básicas

fix: corrige erro no cálculo do carrinho
- O desconto não estava sendo aplicado corretamente
```

---

## 🔄 Pull Requests

1. **Antes de começar**
   ```bash
   git checkout main
   git pull
   git checkout -b feature/sua-feature
   ```

2. **Durante o desenvolvimento**
   - Faça commits pequenos e frequentes
   - Teste tudo antes de subir
   - Se tiver dúvidas, chame o responsável

3. **Ao criar o PR**
   - **Título:** mesmo formato dos commits
   - **Descrição:**
     ```
     O que foi feito?
     - Liste as alterações principais

     Como testar?
     1. Passo a passo do teste
     2. Resultado esperado
     ```

**Evite:**
- Commits genéricos como “ajustes diversos”
- PRs sem descrição
- Subir código não testado

**Fluxo ideal:**
1. Avise que vai começar a feature
2. Crie a branch
3. Faça commits pequenos e claros
4. Teste tudo
5. Abra o PR e marque o revisor
6. Ajuste se necessário

---

## 🚀 Como Rodar o Projeto Next.js

### 📦 Requisitos
- Node.js 18+
- npm, yarn, pnpm ou bun

### 🔧 Instalar Dependências
```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install

# bun
bun install
```

### ▶️ Fazer o build
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```
App disponível em **http://localhost:3000**

### 🏗️ Build e Produção
```bash
npm run build && npm run start
# ou
yarn build && yarn start
# ou
pnpm build && pnpm start
# ou
bun run build && bun run start
```

### 🧪 Testes
```bash
npm test
npm run test:watch
npm run lint
```

### 💡 Scripts sugeridos
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

### ⚙️ Dicas
- Configure o arquivo `.env.local` antes de rodar
- Para usar outra porta: `PORT=4000 npm run start`
