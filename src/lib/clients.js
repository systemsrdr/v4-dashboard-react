// Base de clientes — espelha o CLIENTS_DB do dashboard antigo.
// pass e sheet ficam aqui (front). funilSource define a guia Kommo/Shopify/Tray.
export const CLIENTS_DB = {
  "aliancas": { nome: "CS Alianças", seg: "Joalheria · E-commerce", tipo: "ec", moeda: "BRL", pais: "BR", metaIds: ["2429115943910453"], googleIds: ["670-426-5990"], tiktokIds: ["7535219818488905746"], pass: "Lira3705", sheet: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTsMuSXIpzP3kg-v1c_8peav-AaSKPWQ7irMj3padTTA8J8OR24do9Y0_RRfeKa5Tr6W0WjYCRwTQNi/pub?output=csv", funilSource: "shopify", funilSheet: null },
  "bsc": { nome: "BSC Pickup Solutions", seg: "Logística · E-commerce B2B", tipo: "ec", moeda: "BRL", pais: "BR", metaIds: ["1707098029742717", "2114458526044587"], googleIds: ["483-772-6517"], tiktokIds: [], pass: "Elo7198", sheet: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTIqsXutKII_DYsFBQMEeo1I5SJq9b8I-RZxWoX3Ur8StELc9nYnntV_Dgnt20PLlD9nUeExeMjjihp/pub?output=csv", funilSource: "tray", funilSheet: null },
  "fanes-joias": { nome: "Fane's Joias", seg: "Joalheria", tipo: "ec", moeda: "BRL", pais: "BR", metaIds: ["2296171467380179", "474991624866547"], googleIds: [], tiktokIds: [], pass: "Sol7293", sheet: null, funilSource: null, funilSheet: null },
  "magus": { nome: "Magus Industria", seg: "Indústria", tipo: "ec", moeda: "BRL", pais: "BR", metaIds: ["1333183713911053"], googleIds: ["855-603-9301"], tiktokIds: [], pass: "Gama4955", sheet: null, funilSource: null, funilSheet: null },
  "bluefit-farol": { nome: "Bluefit Maceió Farol", seg: "Academia", tipo: "is", moeda: "BRL", pais: "BR", metaIds: ["941582737278806"], googleIds: [], tiktokIds: [], pass: "Atlas4375", sheet: null, funilSource: null, funilSheet: null },
  "bluefit-ponta-verde": { nome: "Bluefit Maceió Ponta Verde", seg: "Academia", tipo: "is", moeda: "BRL", pais: "BR", metaIds: ["1176617220163908"], googleIds: [], tiktokIds: [], pass: "Atlas2532", sheet: null, funilSource: null, funilSheet: null },
  "flor-da-moda": { nome: "Boutique Flor da Moda", seg: "Moda · E-commerce", tipo: "ec", moeda: "BRL", pais: "BR", metaIds: ["1178022936335581", "652884500240603"], googleIds: [], tiktokIds: [], pass: "Iris7162", sheet: null, funilSource: null, funilSheet: null },
  "vestpe": { nome: "Vestpé Calçados", seg: "Calçados · E-commerce", tipo: "ec", moeda: "BRL", pais: "BR", metaIds: ["972829204592018", "548624654529285"], googleIds: [], tiktokIds: [], pass: "Alfa2366", sheet: null, funilSource: null, funilSheet: null },
  "toalha-bandeja": { nome: "Toalha de Bandeja", seg: "E-commerce", tipo: "ec", moeda: "BRL", pais: "BR", metaIds: ["710165240805852"], googleIds: [], tiktokIds: [], pass: "Sol4772", sheet: null, funilSource: null, funilSheet: null },
  "mcw": { nome: "MCW Oficina Mecânica", seg: "Automotivo · Serviços", tipo: "is", moeda: "BRL", pais: "BR", metaIds: ["1434398517793607"], googleIds: [], tiktokIds: [], pass: "Hera1223", sheet: null, funilSource: "kommo", funilSheet: null },
  "gma-construtora": { nome: "GMA Construtora", seg: "Construção", tipo: "is", moeda: "BRL", pais: "BR", metaIds: ["768661894629116"], googleIds: [], tiktokIds: [], pass: "Hera1895", sheet: null, funilSource: null, funilSheet: null },
  "fernando-miranda": { nome: "Fernando Miranda Advogados", seg: "Advocacia · Serviços", tipo: "is", moeda: "BRL", pais: "BR", metaIds: ["1141811877992643"], googleIds: [], tiktokIds: [], pass: "Faro3713", sheet: null, funilSource: null, funilSheet: null },
  "newgo": { nome: "NewGo", seg: "Serviços", tipo: "is", moeda: "BRL", pais: "BR", metaIds: ["1866208866909956"], googleIds: [], tiktokIds: [], pass: "Vega3591", sheet: null, funilSource: null, funilSheet: null },
  "proconph": { nome: "Proconph Sistemas", seg: "Software", tipo: "is", moeda: "BRL", pais: "BR", metaIds: [], googleIds: ["905-299-0911"], tiktokIds: [], pass: "Hera4621", sheet: null, funilSource: null, funilSheet: null },
  "hd-clinic": { nome: "HD Clinic Lisboa", seg: "Clínica Estética · Serviços", tipo: "is", moeda: "EUR", pais: "PT", metaIds: ["551980310485773"], googleIds: [], tiktokIds: [], pass: "Lisboa4821", sheet: null, funilSource: null, funilSheet: null },
}

export const ADMIN_PASS = "AdminM"

export const GEO_COORDS = {
  "Lisbon District": [38.72, -9.14], "Setúbal District": [38.52, -8.89], "Porto District": [41.15, -8.61],
  "Braga District": [41.55, -8.42], "Aveiro District": [40.64, -8.65], "Faro District": [37.02, -7.93],
  "Coimbra District": [40.21, -8.43], "Leiria District": [39.74, -8.81], "Santarém District": [39.23, -8.69],
  "Viseu District": [40.66, -7.91], "Évora District": [38.57, -7.91], "Beja District": [38.02, -7.86],
  "Guarda District": [40.54, -7.27], "Castelo Branco District": [39.82, -7.49], "Portalegre District": [39.29, -7.43],
  "Viana do Castelo District": [41.69, -8.83], "Vila Real District": [41.30, -7.74], "Bragança": [41.81, -6.76],
  "Braganca": [41.81, -6.76], "Madeira": [32.76, -16.96], "Azores": [37.74, -25.68],
  "São Paulo": [-23.55, -46.63], "Rio de Janeiro": [-22.91, -43.17], "Minas Gerais": [-19.92, -43.94],
  "Bahia": [-12.97, -38.51], "Paraná": [-25.43, -49.27], "Rio Grande do Sul": [-30.03, -51.23],
  "Pernambuco": [-8.05, -34.88], "Ceará": [-3.72, -38.54], "Santa Catarina": [-27.59, -48.55],
  "Goiás": [-16.68, -49.25], "Pará": [-1.46, -48.50], "Maranhão": [-2.53, -44.30],
  "Espírito Santo": [-20.32, -40.34], "Distrito Federal": [-15.78, -47.93], "Mato Grosso": [-15.60, -56.10],
  "Amazonas": [-3.12, -60.02], "Alagoas": [-9.67, -35.74], "Paraíba": [-7.12, -34.86],
  "Rio Grande do Norte": [-5.79, -35.21], "Piauí": [-5.09, -42.80], "Mato Grosso do Sul": [-20.44, -54.65],
  "Sergipe": [-10.90, -37.07], "Rondônia": [-8.76, -63.90], "Tocantins": [-10.18, -48.33],
  "Acre": [-9.97, -67.81], "Amapá": [0.03, -51.07], "Roraima": [2.82, -60.67],
}
