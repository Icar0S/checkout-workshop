// Fase da lua por idade sinodica. Precisao de horas, o que basta para um dia.
// Referencia: lua nova de 2000-01-06 18:14 UTC. Mes sinodico medio: 29,530588853 dias.

const LUA_NOVA_DE_REFERENCIA = Date.UTC(2000, 0, 6, 18, 14);
const MES_SINODICO_MS = 29.530588853 * 24 * 60 * 60 * 1000;

// Fracao do ciclo, de 0 (lua nova) a 1 (proxima lua nova).
export function idadeDaLua(data) {
  const ciclos = (data.getTime() - LUA_NOVA_DE_REFERENCIA) / MES_SINODICO_MS;
  return ciclos - Math.floor(ciclos);
}

// Quatro fases, um quarto do ciclo cada. "Minguante" e o ultimo quarto:
// do quarto minguante ate a lua nova. Decisao registrada em SPEC.md.
export function faseDaLua(data) {
  const idade = idadeDaLua(data);
  if (idade < 0.25) return 'nova';
  if (idade < 0.5) return 'crescente';
  if (idade < 0.75) return 'cheia';
  return 'minguante';
}
