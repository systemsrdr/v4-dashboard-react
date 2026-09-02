# V4 Company — Dashboard de Performance

Dashboard analítico corporativo em **React + Vite + Tailwind**, interface 100% em português,
identidade visual V4 (vermelho `#E50914` + grafite `#282C37`, **sem nenhum tom de azul**).

---

## Rodando

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
npm run preview   # testa o build local
```

## Deploy no Vercel

O `vercel.json` já está pronto:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- Rewrite de SPA para `/index.html`

Variável opcional em **Settings → Environment Variables**:

| Variável | Uso |
|---|---|
| `VITE_WINDSOR_KEY` | Chave da Windsor.ai (há fallback embutido) |

---

## Acesso

Senhas em `src/lib/clients.js`:

| Perfil | Senha |
|---|---|
| Administrador (vê todos os clientes) | `AdminM` |
| Aliança CS | `aliancas2024` |
| BSC Pickup | `bsc2024` |
| Star Man Net | `starman2024` |
| Dra. Daniele e HD | `hdclinic2024` |

O e-mail é livre — a autenticação usa a senha. Troque para uma API real em produção.

---

## Estrutura

```
src/
  main.jsx                 Entry
  App.jsx                  Sessão, roteamento, cálculo de métricas
  index.css                Tokens de tema + utilitários
  icons/index.jsx          Ícones SVG de linha + logo V4 (sem emojis)
  hooks/useTheme.jsx       Tema claro/escuro persistido
  lib/
    clients.js             Base de clientes (IDs, senha, moeda, planilhas)
    format.js              Moeda dinâmica BRL/EUR, números, datas, deltas
    api.js                 Windsor agregada + cache 15min + CSVs
  components/
    Login.jsx              Split-screen com arte corporativa
    Sidebar.jsx            Retrátil, slot de logo SVG, seletor multicliente
    Header.jsx             Filtro global de data com atalhos
    VisaoGeral.jsx         KPIs consolidados + gráficos + funil
    Ecommerce.jsx          KPIs de loja, ROAS por canal, criativos
    InsideSales.jsx        MQPL/SQL, funil comercial, criativos
    Funil.jsx              Funil horizontal com taxa de conversão
    GraficoLinhas.jsx      Linhas, barras e comparativos (Recharts)
    TabelaCriativos.jsx    Tabela interativa com miniaturas + modal
    Conectores.jsx         Status das integrações + limpar cache
    Configuracoes.jsx      Dados do cliente e aparência
    ui.jsx                 Card, Kpi, Delta, Dica, Status, Abas, Grid
```

---

## Performance

- **Chamada agregada**: uma única requisição à Windsor traz Meta + Google + TikTok
  (o campo `source` separa as plataformas na resposta). O período anterior vai em
  paralelo via `Promise.all`.
- **Cache de 15 minutos** em duas camadas: memória (instantâneo) e `localStorage`
  (sobrevive a refresh). Botão de limpar em *Conectores de Dados*.
- **Renderização progressiva**: KPIs aparecem primeiro com skeleton; os criativos
  (mais pesados, com imagens) carregam depois, com `loading="lazy"` nas miniaturas.

---

## Moeda por cliente

Definida em `src/lib/clients.js` no campo `moeda`:

- `Dra. Daniele e HD` → `'EUR'` → todas as métricas financeiras em **€**
- Demais clientes → `'BRL'` → **R$**

Todo valor monetário passa por `money()` / `moneyFull()` em `src/lib/format.js`,
então basta trocar o campo para mudar a moeda em todo o painel.

---

## Planilhas

### Financeiro (e-commerce)

Leitura **por posição de coluna** — a planilha tem cabeçalho em duas linhas:

| Col | Conteúdo |
|---|---|
| 0 | Mês (ex.: `abril`) |
| 1 | Faturamento Google |
| 2 | Faturamento Meta |
| 3 | Receita WhatsApp |
| 5 | Faturamento GERAL |
| 6 | Ticket médio |
| 7 | Vendas Google |
| 8 | Vendas Meta |
| 9 | Vendas WhatsApp |
| 11 | Total de vendas |

### Funil de fundo (`funilSheet`)

- **Kommo:** `mês | MQL | SQL | SQO | Vendas | Receita`
- **Shopify / Tray:** `mês | Carrinho | Vendas | Receita`

Ajuste os índices em `lerFunil()` (`src/lib/api.js`) se a ordem for diferente.

---

## Logo do cliente

No topo da barra lateral há uma área pontilhada. Arraste um **SVG** (ou PNG/JPG)
sobre ela, ou clique para escolher o arquivo. A logo é salva em `localStorage`
por cliente (`v4-logo:<slug>`) e trocada automaticamente ao mudar de cliente.
