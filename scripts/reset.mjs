// Desfaz alteracoes em src/, public/ e test/. Nao toca em SPEC.md, NOTAS.md nem .clinerules.
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { stdio: 'inherit' });

git('checkout', '--', 'src', 'public', 'test');
git('clean', '-fd', 'src', 'public', 'test');
console.log('src/, public/ e test/ voltaram ao estado do branch. SPEC.md, NOTAS.md e .clinerules ficam.');
