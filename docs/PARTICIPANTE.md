# Guia do participante

Primeiro você vai ver o agente falhar num pedido vago. Depois vai fazer **o ciclo inteiro de spec-driven development — reduzido ao que importa — numa feature só.** 90 minutos, começando pelo setup.

Não leia o código antes. O que interessa é o que o agente faz com ele.

---

## 0. Setup — os primeiros 12 minutos

Siga o slide. Na ordem:

1. No terminal: `node -v`. Precisa ser **20 ou mais**.
   Se não responder ou for menor: **junte-se a um grupo cuja máquina funciona.** Não tente instalar agora.
2. Clone o repositório (a URL está no slide) e entre na pasta.
3. `npm test`. Os 11 testes precisam passar. Não existe `npm install`.
4. Abra a **pasta** no VS Code (*File → Open Folder*). O Cline só enxerga a pasta aberta.
5. Cline: modo **Act**, e em *Auto-approve* marque **Read** e **Edit**. Detalhes em [`docs/CLINE.md`](./CLINE.md).
6. Peça ao Cline: *"adicione um comentário no topo de src/pricing.js"*. Confirme que ele editou. Depois `npm run reset`.

Funcionou? Levante a mão. O instrutor forma os grupos em volta das máquinas que estão prontas.

**Cada grupo trabalha numa máquina só.** Quem está no teclado troca a cada passo.

---

## 1. O antes — o pedido vago

**Quando o instrutor mandar, não antes.**

1. Cline em **Act**.
2. Cole **exatamente** isto, sem acrescentar nada:

   ```
   aplique o cupom no carrinho
   ```

3. Se o Cline fizer alguma pergunta, responda só: **"decida você"**. Anote a pergunta.
4. Deixe rodar. Aprove o que ele pedir.
5. Quando o instrutor bater na mesa, **pare** — mesmo que não tenha terminado.
6. Na mesma conversa, cole:

   ```
   liste todas as decisões que você tomou sozinho para aplicar o cupom, uma por linha
   ```

   Copie a lista para um arquivo `NOTAS.md` na raiz. Ela vai servir no passo ②.

Não corrija nada. Não edite código à mão. O que interessa é o que ele fez.

Se sobrar tempo: `npm start` e olhe os totais de alguns carrinhos —
`curl http://localhost:3000/cart/c1/total` (troque `c1` por `c2`, `c3`… até `c7`). Compare com o que *vocês* esperariam.

---

# O ciclo

Daqui em diante, cinco passos, numa feature só. É a forma reduzida do que ferramentas como Kiro e Spec Kit fazem — sem plano, sem lista de tarefas. Só o que muda o resultado.

```
① Constituição → ② Spec → ③ Implementar → ④ Validar → ⑤ Replanejar
                                              ↑______________|
```

---

## 2. ① Constituição — as regras do projeto

O Cline lê o arquivo `.clinerules` da raiz em **toda** tarefa, sem você pedir. É a "constituição" do projeto: o que vale sempre, para qualquer feature. O deste repositório está propositalmente magro.

**Passo 1 — o agente escreve (3 min).** New Task, Act, cole:

```
Leia este repositório e escreva um arquivo .clinerules na raiz com exatamente estas seis seções: Comandos, Testes, Estrutura, Estilo, Git, Nunca faça. Cada seção com no máximo 5 linhas. Em Estilo, cole um trecho real de src/pricing.js em vez de descrever. Não invente nada que não esteja no código.
```

Aprove. Leia o que saiu. Tudo ali ele **descobriu olhando o código**.

**Passo 2 — vocês acrescentam o que ele não tem como saber (1 min).** Abram o `.clinerules` e adicionem, à mão, em **Nunca faça**:

```
- Nunca converta centavos para reais dentro de src/. Formatação é problema de quem exibe.
- Não altere um teste existente só para fazê-lo passar. Se um teste parece errado, diga e pare.
```

Nenhuma dessas regras está no código. São decisões de quem conhece o projeto. **É a única parte que só vocês podem escrever.**

A partir de agora, tudo que o agente fizer neste repositório passa por esse arquivo.

---

## 3. ② Spec — quatro critérios

Olhem a lista em `NOTAS.md` e o que saiu no debate. Escolham **quatro** decisões que vocês querem controlar. Escrevam as quatro como critérios num arquivo `SPEC.md` na raiz, com este molde:

```
QUANDO   <gatilho>,             o sistema DEVE <resposta>
ENQUANTO <condição de estado>,  o sistema DEVE <resposta>
SE       <situação indesejada>, ENTÃO o sistema DEVE <resposta>
```

**Exatamente quatro.** Pelo menos um começa com **ENQUANTO**.

A regra que vale mais que o molde: **se a frase não vira um teste, a frase está errada.** Reescreva a frase.

---

## 4. ③ Implementar

1. Desfaçam o pedido vago: `npm run reset` (`SPEC.md`, `NOTAS.md` e `.clinerules` não são apagados).
2. **New Task** no Cline (o `+`). Sem isso ele lembra o que decidiu no pedido vago e o experimento morre.
3. Colem o mesmo pedido, uma linha em branco, e os quatro critérios:

   ```
   aplique o cupom no carrinho seguindo os critérios de aceitação em SPEC.md:

   1. ...
   2. ...
   3. ...
   4. ...
   ```

4. Deixem rodar. Quando o instrutor bater na mesa, parem.

Reparem: vocês não colaram o `.clinerules`. Ele foi lido sozinho.

---

## 5. ④ Validar — e ⑤ Replanejar se precisar

Na **mesma conversa**, cole:

```
para cada critério do SPEC.md, escreva um teste em test/cupom.test.js que prove o critério, e rode npm test
```

Agora leiam `test/cupom.test.js`. Para cada teste, uma pergunta: **ele prova o critério, ou só passa?**

Depois, o resultado do `npm test`:

- **Tudo verde.** Confiram se os testes são de verdade. Se são, o ciclo fechou.
- **Teste novo vermelho.** Decidam: a spec estava errada, ou o código? Se a spec, editem `SPEC.md` e peçam para ajustar. Se o código, peçam para corrigir **sem tocar no teste**. Isso é o ⑤ — replanejar. Anotem qual foi.
- **Teste antigo vermelho.** O agente mudou o contrato do endpoint (por exemplo, acrescentou um campo). Isso é decisão de vocês, não dele. Decidam e digam a ele.

O instrutor vai perguntar qual dos três aconteceu com o grupo.

---

## 6. A revisão

Quando o instrutor mandar — não antes — rode no terminal:

```
npm run revisao
```

Isso cria um arquivo `REVISAO.md` na raiz. Abram no editor e leiam.

Regras: **não rodem nada, não colem no Cline, não abram o código.** É leitura de revisor, como num PR.

Seis minutos para o grupo decidir: **aprova ou reprova?** Se reprovar, anotem em qual item e por quê — o instrutor vai perguntar.

---

## Depois, no seu projeto

O ciclo é o mesmo em qualquer repositório:

1. **①** Rode o prompt da constituição no seu projeto. Leia. Acrescente as duas ou três linhas que só você sabe.
2. **②** Antes de pedir uma feature, escreva quatro critérios. Se não vira teste, reescreva.
3. **③** Peça a feature com os critérios.
4. **④** Peça um teste por critério. Leia os testes.
5. **⑤** Vermelho → decida se muda a spec ou o código. Nunca o teste.

Se o time usa outros agentes além do Cline, copie o `.clinerules` para `AGENTS.md`.

---

## Travou?

Cada passo tem um branch com o resultado esperado. Use se o agente travar, a API falhar, ou o grupo se perder — sem culpa. O que vocês tinham feito fica guardado num `git stash`.

| Comando | O que você recebe |
| --- | --- |
| `npm run checkpoint:1` | ① Um `.clinerules` completo, para comparar com o que o seu agente escreveu |
| `npm run checkpoint:2` | ② Um `SPEC.md` com quatro critérios de exemplo |
| `npm run checkpoint:3` | ③④ O cupom implementado a partir desses critérios, com um teste por critério |
| `npm run voltar` | De volta ao `main` |

Para recuperar o que vocês tinham feito: `git stash list` e `git stash pop`.
