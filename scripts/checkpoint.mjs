// Guarda o que voce fez num stash e troca para o branch pedido.
// uso: node scripts/checkpoint.mjs <1|2|3|main>
import { execFileSync } from 'node:child_process';

const branches = {
  1: 'checkpoint/1-constituicao',
  2: 'checkpoint/2-spec',
  3: 'checkpoint/3-implementado',
  main: 'main'
};

const branch = branches[process.argv[2]];
if (!branch) {
  console.error('uso: node scripts/checkpoint.mjs <1|2|3|main>');
  process.exit(1);
}

const saida = execFileSync('git', ['stash', 'push', '-u', '-m', 'meu-progresso'], { encoding: 'utf8' });
if (/No local changes/i.test(saida)) {
  console.log('nada para guardar.');
} else {
  console.log('seu progresso foi guardado. Para ver: git stash list');
}

execFileSync('git', ['checkout', branch], { stdio: 'inherit' });
console.log(`agora em ${branch}.`);
