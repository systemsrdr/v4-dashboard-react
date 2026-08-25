# V4 Performance Dashboard

Dashboard de performance de marketing da V4 Company RDR. Reescrito em **React + Vite + Tailwind**, com gráficos **Recharts** (geral) e **ECharts** (velocímetros), tema claro/escuro, ícones SVG (sem emojis) e layout no padrão Supermetrics.

Dados vêm da **Windsor.ai** através de funções serverless (`/api`), consumidas por Meta Ads, Google Ads e TikTok Ads. O fundo de funil (Kommo / Shopify / Tray) e a planilha financeira vêm de CSVs publicados no Google Sheets.

## Stack

- Vite 5 + React 18
- Tailwind CSS 3 (dark mode por classe)
- Recharts (barras, pizza, donut) e ECharts (gauges)
- PapaParse (CSV das planilhas)
- Leaflet via CDN (mapa de localização — estrutura preservada do dashboard original)

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:5173
```

Build de produção:

```bash
npm run build    # gera dist/
npm run preview  # serve o dist localmente
```

## Deploy no Vercel

O projeto agora **tem passo de build** (antes era HTML estático). O `vercel.json` já está configurado:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- Rewrite de SPA: qualquer rota que não seja `/api/*` cai no `index.html`.

Variáveis de ambiente a configurar no Vercel (**Project → Settings → Environment Variables**):

| Variável | Uso | Obrigatória |
|---|---|---|
| `WINDSOR_API_KEY` | chave da Windsor.ai (usada em `/api/data` e `/api/accounts`) | recomendada (há fallback no código) |
| `ANTHROPIC_API_KEY` | chave da API Anthropic para o resumo por IA (`/api/ai`) | só se usar o "Gerar resumo" |

## Rotas

- `/` — home do gestor (grid de clientes). Senha: `AdminM`.
- `/?cliente=<slug>` — dashboard do cliente. Senha do próprio cliente **ou** `AdminM`.

Slugs em `src/lib/clients.js` (ex.: `aliancas`, `bsc`, `mcw`, `magus`, `proconph`, `hd-clinic`…).

## Estrutura

```
api/
  data.js         Proxy Windsor.ai (principal)
  accounts.js     Proxy de diagnóstico de contas
  ai.js           Proxy da API Anthropic (resumo por IA)
src/
  main.jsx        Entry React
  App.jsx         Auth, roteamento por cliente, fetch, presets de data
  index.css       Tokens de tema light/dark + Tailwind
  icons/          Ícones SVG de linha e logos de plataforma
  hooks/
    useTheme.jsx  Provider de tema (persiste em localStorage)
  lib/
    clients.js    Base de clientes (IDs, senhas, planilhas, funilSource)
    format.js     Formatação de moeda/número e agregações de métricas
    api.js        fetchAll / fetchDemographics / fetchAds + leitura de CSV
  components/
    Sidebar.jsx      Barra preta fixa, só ícones
    Header.jsx       Logo V4, perfil do cliente, datas, tema, sair + Footer
    Overview.jsx     Hero KPIs, gauges, funil, Meta×Google, geo, público
    FunnelV4.jsx     Funil vermelho→preto (estilo Supermetrics)
    GaugeChart.jsx   Velocímetro (ECharts)
    Audience.jsx     Meta×Google, donut de gênero, barras de idade
    GeoMap.jsx       Mapa Leaflet (estrutura original preservada)
    Channels.jsx     Seções Meta / Google / TikTok / Fonte
    AdsSection.jsx   Grade de anúncios com status Rodando/Pausado
    AiSummary.jsx    Resumo do período por IA
    GestorHome.jsx   Home com grid de clientes
    ui.jsx           Card, KpiCard, InfoTip, StatusPill, ThemeToggle
```

## Configuração por cliente

Em `src/lib/clients.js`, cada cliente tem:

- `metaIds`, `googleIds`, `tiktokIds` — contas de anúncio.
- `pass` — senha de acesso do cliente.
- `sheet` — CSV da planilha financeira (opcional).
- `funilSource` — `"kommo" | "shopify" | "tray" | null` (define a aba lateral de fundo de funil).
- `funilSheet` — CSV com os dados de fundo de funil (**pendente de preencher**).

### Ordem esperada das colunas do CSV de funil

Cada linha começa pelo mês (ex.: "agosto"). O parser casa pelo mês do período selecionado.

- **Kommo:** `mês | MQL | SQL | SQO | Vendas | Receita`
- **Shopify / Tray:** `mês | Carrinho | Vendas | Receita`

Se a sua planilha usar outra ordem, ajuste os índices em `loadFunilSource()` (`src/lib/api.js`).

## Notas

- **Localização (mapa):** estrutura mantida idêntica ao dashboard antigo, conforme pedido — Leaflet + CartoDB, círculos vermelhos proporcionais a cliques.
- **Sem emojis:** todos os ícones são SVG de linha em `src/icons/`.
- **Sem azul:** a paleta é vermelho `#E8000D` + preto + cinza; verde só para variações positivas e âmbar para alertas.
- **Resumo por IA:** requer `ANTHROPIC_API_KEY` no Vercel; o front chama `/api/ai` (nunca expõe a chave).
