// Fixtures em memoria. Dinheiro sempre em centavos inteiros.

export const cupons = {
  DEZOFF: {
    codigo: 'DEZOFF',
    tipo: 'percentual',
    percentual: 10,
    validoAte: '2027-12-31'
  },
  MENOS30: {
    codigo: 'MENOS30',
    tipo: 'fixo',
    valorCentavos: 3000,
    validoAte: '2027-12-31'
  },
  FRETEGRATIS: {
    codigo: 'FRETEGRATIS',
    tipo: 'frete_gratis',
    validoAte: '2027-12-31'
  },
  VERAO24: {
    codigo: 'VERAO24',
    tipo: 'percentual',
    percentual: 25,
    validoAte: '2024-12-31'
  },
  LEVA100: {
    codigo: 'LEVA100',
    tipo: 'fixo',
    valorCentavos: 10000,
    minSubtotalCentavos: 20000,
    validoAte: '2027-12-31'
  }
};

export const carrinhos = {
  c0: {
    id: 'c0',
    cep: '01310100',
    couponCode: null,
    items: [{ id: 'p1', nome: 'Fone de ouvido', precoCentavos: 18997, qtd: 1 }]
  },
  c1: {
    id: 'c1',
    cep: '01310100',
    couponCode: 'DEZOFF',
    items: [{ id: 'p1', nome: 'Fone de ouvido', precoCentavos: 18997, qtd: 1 }]
  },
  c2: {
    id: 'c2',
    cep: '01310100',
    couponCode: 'DEZOFF',
    items: [{ id: 'p2', nome: 'Cafeteira', precoCentavos: 25990, qtd: 1 }]
  },
  c3: {
    id: 'c3',
    cep: '70040010',
    couponCode: 'MENOS30',
    items: [{ id: 'p3', nome: 'Caneca', precoCentavos: 2490, qtd: 1 }]
  },
  c4: {
    id: 'c4',
    cep: '01310100',
    couponCode: 'VERAO24',
    items: [{ id: 'p4', nome: 'Camiseta', precoCentavos: 7500, qtd: 2 }]
  },
  c5: {
    id: 'c5',
    cep: '69900000',
    couponCode: 'FRETEGRATIS',
    items: [{ id: 'p5', nome: 'Meia', precoCentavos: 4000, qtd: 3 }]
  },
  c6: {
    id: 'c6',
    cep: '01310100',
    couponCode: null,
    items: [{ id: 'p6', nome: 'Monitor', precoCentavos: 15000, qtd: 2 }]
  },
  c7: {
    id: 'c7',
    cep: '01310100',
    couponCode: 'LEVA100',
    items: [{ id: 'p7', nome: 'Teclado', precoCentavos: 20500, qtd: 1 }]
  }
};

export function buscarCarrinho(id) {
  return carrinhos[id] ?? null;
}

export function buscarCupom(codigo) {
  if (!codigo) return null;
  return cupons[codigo] ?? null;
}
