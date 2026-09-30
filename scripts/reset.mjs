// Desfaz alteracoes em src/ e test/. Nao toca em SPEC.md, NOTAS.md nem .clinerules.
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { stdio: 'inherit' });

git('checkout', '--', 'src', 'test');
git('clean', '-fd', 'src', 'test');
console.log('src/ e test/ voltaram ao estado do branch. SPEC.md, NOTAS.md e .clinerules ficam.');
