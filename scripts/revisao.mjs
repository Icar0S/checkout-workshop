// Copia REVISAO.md do branch material/revisao para a raiz, sem trocar de branch.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

function show(ref) {
  return execFileSync('git', ['show', `${ref}:REVISAO.md`], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  });
}

let conteudo;
try {
  conteudo = show('material/revisao');
} catch {
  try {
    conteudo = show('origin/material/revisao');
  } catch {
    console.error('nao achei o branch material/revisao. Rode `git fetch` e tente de novo.');
    process.exit(1);
  }
}

writeFileSync('REVISAO.md', conteudo);
console.log('REVISAO.md criado na raiz. Abra no editor.');
