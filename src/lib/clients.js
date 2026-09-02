/**
 * Base de clientes V4 Company RDR.
 *
 * tipo        'ecommerce' | 'inside-sales'
 * moeda       'BRL' | 'EUR'   → HD Clinic Lisboa usa EUR
 * vendaSource 'shopify' | 'tray' | 'kommo' | null
 * sheet       CSV publicado (financeiro)
 * funilSheet  CSV publicado (fundo de funil / CRM)
 */
export const CLIENTS = {
  aliancas: {
    slug: 'aliancas', nome: 'CS Alianças', segmento: 'Joalheria · E-commerce',
    tipo: 'ecommerce', vendaSource: 'shopify', moeda: 'BRL', pais: 'BR',
    pass: 'Lira3705', sigla: 'CA', cor: '#E50914',
    metaIds: ['2429115943910453'],
    googleIds: ['670-426-5990'],
    tiktokIds: ['7535219818488905746'],
    sheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsMuSXIpzP3kg-v1c_8peav-AaSKPWQ7irMj3padTTA8J8OR24do9Y0_RRfeKa5Tr6W0WjYCRwTQNi/pub?output=csv',
    funilSheet: null,
  },
  bsc: {
    slug: 'bsc', nome: 'BSC Pickup Solutions', segmento: 'Logística · E-commerce B2B',
    tipo: 'ecommerce', vendaSource: 'tray', moeda: 'BRL', pais: 'BR',
    pass: 'Elo7198', sigla: 'BS', cor: '#B3060F',
    metaIds: ['1707098029742717', '2114458526044587'],
    googleIds: ['483-772-6517'],
    tiktokIds: [],
    sheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIqsXutKII_DYsFBQMEeo1I5SJq9b8I-RZxWoX3Ur8StELc9nYnntV_Dgnt20PLlD9nUeExeMjjihp/pub?output=csv',
    funilSheet: null,
  },
  'fanes-joias': {
    slug: 'fanes-joias', nome: "Fane's Joias", segmento: 'Joalheria · E-commerce',
    tipo: 'ecommerce', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Sol7293', sigla: 'FJ', cor: '#8E0710',
    metaIds: ['2296171467380179', '474991624866547'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  magus: {
    slug: 'magus', nome: 'Magus Industria', segmento: 'Indústria',
    tipo: 'ecommerce', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Gama4955', sigla: 'MG', cor: '#282C37',
    metaIds: ['1333183713911053'],
    googleIds: ['855-603-9301'],
    tiktokIds: [], sheet: null, funilSheet: null,
  },
  'bluefit-farol': {
    slug: 'bluefit-farol', nome: 'Bluefit Maceió Farol', segmento: 'Academia · Inside Sales',
    tipo: 'inside-sales', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Atlas4375', sigla: 'BF', cor: '#3A3F4C',
    metaIds: ['941582737278806'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  'bluefit-ponta-verde': {
    slug: 'bluefit-ponta-verde', nome: 'Bluefit Maceió Ponta Verde', segmento: 'Academia · Inside Sales',
    tipo: 'inside-sales', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Atlas2532', sigla: 'BP', cor: '#3A3F4C',
    metaIds: ['1176617220163908'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  'flor-da-moda': {
    slug: 'flor-da-moda', nome: 'Boutique Flor da Moda', segmento: 'Moda · E-commerce',
    tipo: 'ecommerce', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Iris7162', sigla: 'FM', cor: '#A00610',
    metaIds: ['1178022936335581', '652884500240603'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  vestpe: {
    slug: 'vestpe', nome: 'Vestpé Calçados', segmento: 'Calçados · E-commerce',
    tipo: 'ecommerce', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Alfa2366', sigla: 'VP', cor: '#E50914',
    metaIds: ['972829204592018', '548624654529285'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  'toalha-bandeja': {
    slug: 'toalha-bandeja', nome: 'Toalha de Bandeja', segmento: 'E-commerce',
    tipo: 'ecommerce', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Sol4772', sigla: 'TB', cor: '#8E0710',
    metaIds: ['710165240805852'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  mcw: {
    slug: 'mcw', nome: 'MCW Oficina Mecânica', segmento: 'Automotivo · Inside Sales',
    tipo: 'inside-sales', vendaSource: 'kommo', moeda: 'BRL', pais: 'BR',
    pass: 'Hera1223', sigla: 'MC', cor: '#282C37',
    metaIds: ['1434398517793607'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  'gma-construtora': {
    slug: 'gma-construtora', nome: 'GMA Construtora', segmento: 'Construção · Inside Sales',
    tipo: 'inside-sales', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Hera1895', sigla: 'GM', cor: '#3A3F4C',
    metaIds: ['768661894629116'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  'fernando-miranda': {
    slug: 'fernando-miranda', nome: 'Fernando Miranda Advogados', segmento: 'Advocacia · Inside Sales',
    tipo: 'inside-sales', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Faro3713', sigla: 'FM', cor: '#282C37',
    metaIds: ['1141811877992643'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  newgo: {
    slug: 'newgo', nome: 'NewGo', segmento: 'Serviços · Inside Sales',
    tipo: 'inside-sales', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Vega3591', sigla: 'NG', cor: '#3A3F4C',
    metaIds: ['1866208866909956'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
  proconph: {
    slug: 'proconph', nome: 'Proconph Sistemas', segmento: 'Software · Inside Sales',
    tipo: 'inside-sales', vendaSource: null, moeda: 'BRL', pais: 'BR',
    pass: 'Hera4621', sigla: 'PP', cor: '#282C37',
    metaIds: [],
    googleIds: ['905-299-0911'],
    tiktokIds: [], sheet: null, funilSheet: null,
  },
  'hd-clinic': {
    slug: 'hd-clinic', nome: 'HD Clinic Lisboa', segmento: 'Clínica Estética · Inside Sales',
    tipo: 'inside-sales', vendaSource: 'kommo', moeda: 'EUR', pais: 'PT',
    pass: 'Lisboa4821', sigla: 'HD', cor: '#7A0A10',
    metaIds: ['551980310485773'],
    googleIds: [], tiktokIds: [], sheet: null, funilSheet: null,
  },
}

export const ADMIN_PASS = 'AdminM'

export const listClients = () => Object.values(CLIENTS)
export const getClient = slug => CLIENTS[slug] || null
