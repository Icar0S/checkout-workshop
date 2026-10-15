// Desfaz o que foi mudado no codigo: src/, public/, test/, scripts/ e os arquivos
// da raiz que o projeto ja tinha. Nao toca no que e do grupo: .clinerules, SPEC.md,
// NOTAS.md e REVISAO.md.
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

const PASTAS = ['src', 'public', 'test', 'scripts'];
const ARQUIVOS = ['README.md', 'AGENTS.md', 'package.json', '.gitignore'];
const DO_GRUPO = ['.clinerules', 'SPEC.md', 'NOTAS.md', 'REVISAO.md'];

const caminhos = [...PASTAS, ...ARQUIVOS];
const mudancas = git('status', '--porcelain', '--untracked-files=all', '--', ...caminhos).trimEnd();

if (mudancas) {
  console.log('desfazendo:');
  console.log(mudancas.split('\n').map((linha) => `  ${linha}`).join('\n'));
  git('checkout', '--', ...caminhos);
  git('clean', '-fdq', '--', ...PASTAS);
} else {
  console.log('nada para desfazer: o codigo ja esta como no branch.');
}

// Arquivo novo em outro lugar (ex.: docs/) o reset nao apaga. Melhor avisar.
const fora = git('status', '--porcelain', '--untracked-files=all')
  .split('\n')
  .filter(Boolean)
  .map((linha) => linha.slice(3))
  .filter((caminho) => !DO_GRUPO.includes(caminho));
if (fora.length) {
  console.log(`atencao: o reset nao mexe nestes, confira se foi o agente: ${fora.join(', ')}`);
}

console.log(`ficam como estao: ${DO_GRUPO.join(', ')}.`);
