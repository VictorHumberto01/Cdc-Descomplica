# CDC Descomplica

> Uma plataforma moderna e acessível para democratizar o entendimento do Código de Defesa do Consumidor (CDC).


O **CDC Descomplica** é uma aplicação web desenvolvida para facilitar o acesso e a compreensão dos direitos do consumidor brasileiro. Através de uma interface amigável, busca inteligente e resumos simplificados, transformamos o "juridiquês" em linguagem clara e direta.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com uma stack moderna focada em performance e experiência do desenvolvedor:

- **[Next.js](https://nextjs.org/)**: Framework React para produção, utilizando App Router e Server Components.
- **[React](https://react.dev/)**: Biblioteca para construção de interfaces de usuário.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de utilitários CSS para estilização rápida e responsiva.
- **[Framer Motion](https://www.framer.com/motion/)**: Biblioteca para animações fluidas e gestos.
- **[Three.js](https://threejs.org/)**: Renderização de gráficos 3D (usado no componente `ColorBends` para o fundo dinâmico).
- **[VLibras](https://www.vlibras.gov.br/)**: Widget de acessibilidade para tradução automática para Libras.

---

##  Funcionalidades Principais

###  Busca Inteligente

Nosso algoritmo de busca foi desenvolvido para entender a intenção do usuário, não apenas palavras-chave exatas.

- **Processamento de Linguagem Natural (PLN) Básico**:
  - **Stemming (Radicalização)**: Entende que "devolução", "devolver" e "devolvido" são a mesma coisa.
  - **Sinônimos**: Mapeia termos comuns ("quebrado" → "defeito", "cliente" → "consumidor").
  - **Stop Words**: Ignora preposições irrelevantes ("de", "para", "com") para focar no que importa.
- **Sistema de Pontuação**: Resultados são ordenados por relevância, priorizando títulos e correspondências exatas.

###  Carrossel de Resumos

- Apresenta explicações simplificadas dos artigos mais complexos.
- **Navegação Unificada**: Controles intuitivos com setas e indicadores de paginação.
- **Dica de Uso**: Tooltip inteligente que ensina novos usuários a navegar pelos resumos.

###  Acessibilidade

- **VLibras**: Integração nativa para usuários surdos.
- **Design Inclusivo**: Contraste adequado e elementos focáveis para navegação por teclado.
- **Responsividade**: Interface 100% adaptada para mobile, tablet e desktop.

###  Integração com Procon

- Botão "call-to-action" inteligente nos cartões de resumo.
- Em dispositivos móveis, permite ligar diretamente para o **151** com um toque.

---

## 📂 Estrutura do Projeto

```bash
src/
├── app/                 # Rotas e páginas (App Router)
│   ├── layout.js        # Layout global (fontes, metadados)
│   ├── page.js          # Página inicial (Home) com lógica de busca
│   └── globals.css      # Variáveis CSS e estilos globais
├── components/          # Componentes Reutilizáveis
│   ├── ArticleCard.js   # Cartão para exibir artigos da lei
│   ├── SummaryCard.js   # Cartão para resumos simplificados
│   ├── SearchBar.js     # Barra de busca com sugestões
│   ├── Navbar.js        # Barra de navegação responsiva
│   ├── Footer.js        # Rodapé com infos e parceiros
│   └── ...
└── ...
```

---

## 🎨 Identidade Visual

O projeto utiliza uma paleta de cores acolhedora e moderna, fugindo do cinza corporativo tradicional:

- **Primária**: `Rose 600` (Coral Vibrante) - Para ações e destaques.
- **Fundo**: `Rose 50` / `White` - Para leveza e clareza.
- **Texto**: `Slate 900` / `Slate 600` - Para legibilidade confortável.

---

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
