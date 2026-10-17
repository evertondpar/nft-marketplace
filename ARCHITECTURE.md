# Arquitetura e Decisões Técnicas (Kurio NFT Marketplace)

Este documento detalha as decisões arquiteturais, contratos de API, gestão de estado e compromissos assumidos durante o desenvolvimento do **Kurio NFT Marketplace**.

## 1\. Contratos REST e Eventos (Socket.IO)

### Contratos REST (Mock via MSW)

A aplicação interage com uma API RESTful mockada. Os principais endpoints estruturados são:

- `GET /api/nfts`: Retorna o catálogo de forma paginada. Suporta parâmetros de busca e filtros complexos via Query Params (`page`, `network`, `collection`, `minPrice`, `maxPrice`, `sort`).  
- `GET /api/nfts/:id`: Retorna os detalhes completos de um NFT específico.  
- `POST /api/auth/login`: Autenticação simulada. Recebe credenciais de teste e retorna um JWT fictício.  
- `POST /api/checkout`: Processa a transação do carrinho. Modelado para falhar sob condições específicas retornando `409 Conflict` (cenário `stock_conflict`).

### Contratos de Tempo Real (Eventos de Socket)

Eventos simulados para fornecer reatividade avançada e validação de tempo real:

- `price_change`: Transmite flutuações dinâmicas no valor (ETH) dos NFTs listados.  
- `nft_sold`: Notifica a indisponibilidade imediata de um item, refletindo no catálogo e no carrinho.

## 2\. Reconciliação entre REST e Socket.IO

Para garantir a coerência dos dados e evitar *oversfetching* (requisições desnecessárias), a aplicação não faz refetch completo da listagem ao receber eventos constantes do Socket.IO. Em vez disso, utilizamos a manipulação direta de cache do **TanStack Query**. Ao captar eventos como `price_change` no listener do Socket.IO, a aplicação atualiza o estado local interceptando e injetando o novo valor nos dados existentes através de `queryClient.setQueryData`. A UI reage instantaneamente sem sobrecarregar a rede.

## 3\. Política de Sessão

- **Token Management:** O JWT de acesso gerado no mock é armazenado de forma persistente no `localStorage`.  
- **Validação, Expiração e Recuperação (401):** Um interceptor global configurado no Axios avalia as respostas do servidor (MSW). Caso ativado o cenário `session_expired`, o servidor retorna erro `HTTP 401 Unauthorized`. O interceptor captura isso, expurga o token do `localStorage` silenciosamente e despacha um redirecionamento imperativo para a raiz (Home) ou tela de Login, garantindo segurança na navegação.  
- **Proteção de Rotas:** O TanStack Router usa o conceito de *Guards* (`beforeLoad`), impedindo fisicamente o acesso a rotas privadas (como `/profile` ou `/checkout`) se o token estiver ausente.

## 4\. Estado do Carrinho e Estratégia de Cache

- **Carrinho de Compras:** O estado global do carrinho é gerido em memória (via context ou store como Zustand) e espelhado de forma síncrona no `localStorage`. Isso garante uma experiência *omnichannel* persistente onde o usuário não perde itens após um "F5".  
- **Estratégia de Cache (TanStack Query):** O catálogo implementa uma política de `staleTime` definida para reduzir requisições de itens inalterados.  
- **Rollback Otimista:** Ações como "Adicionar aos Favoritos" atualizam a interface primeiro. Se o backend (MSW) falhar no processo, o TanStack Query executa um rollback automático para o estado anterior, garantindo consistência sem comprometer a percepção de velocidade.

## 5\. Limitações, Decisões de UX e Desvios do Figma

### Desvios do Figma e UX Adaptativa

- **Filtro de Preço em Barra (Range):** Para manter rigorosa fidelidade visual à barrinha do Figma sem importar bibliotecas pesadas de terceiros (o que aumentaria o *Largest Contentful Paint* no Lighthouse), implementamos uma abstração por CSS com **Dual Range Sliders Nativos**. São dois `<input type="range">` transparentes sobrepostos na interface, fornecendo a estética idêntica e operabilidade plena pelo teclado/rato.  
- **Skeletons e Redução de CLS:** Para evitar pulos de layout (*Cumulative Layout Shift*), o tempo de carregamento de imagens e chamadas API atrasadas via MSW exibem *Skeletons* dimensionados nos tamanhos finais dos *Cards* (baseados nas proporções 175/190), garantindo fluidez perceptível.

### Limitações Arquiteturais do Mock

- Sendo uma aplicação 100% Client-Side baseada em *Service Workers* (MSW), não há um banco de dados persistente atrelado. Modificações profundas, como atualizar perfis ou listar novos NFTs além da base mockada atual, são mantidas em memória apenas durante a sessão ativa, com as transações do Checkout não criando registros reais persistentes a longo prazo.