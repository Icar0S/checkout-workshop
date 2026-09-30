# Guia do participante

Você vai fazer **duas rodadas com o agente**, **uma revisão** e **um arquivo de configuração**. Tudo em 90 minutos, começando pelo setup.

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

**Cada grupo trabalha numa máquina só.** Quem está no teclado troca a cada rodada.

---

## 1. Rodada 1 — o pedido

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

   Copie a lista para um arquivo `NOTAS.md` na raiz. Ela vai servir na rodada 2.

Não corrija nada. Não edite código à mão. O que interessa é o que ele fez.

Se sobrar tempo: suba a API com `npm start` e olhe os totais de alguns carrinhos —
`curl http://localhost:3000/cart/c1/total` (troque `c1` por `c2`, `c3`… até `c7`). Compare com o que *vocês* esperariam.

---

## 2. Rodada 2 — o mesmo pedido, com critérios

1. Olhem a lista em `NOTAS.md` e o que saiu no debate. Escolham **quatro** decisões que vocês querem controlar.
2. Escrevam as quatro como critérios num arquivo `SPEC.md` na raiz, usando o molde abaixo. **Exatamente quatro.** Pelo menos um começa com **ENQUANTO**.
3. Desfaçam a rodada 1: `npm run reset` (o `SPEC.md` e o `NOTAS.md` não são apagados).
4. No Cline, **New Task** (o `+`). Sem isso ele lembra o que decidiu na rodada 1 e o experimento morre.
5. Colem o **mesmo pedido** de antes, uma linha em branco, e os quatro critérios:

   ```
   aplique o cupom no carrinho

   Critérios de aceitação:
   1. ...
   2. ...
   3. ...
   4. ...
   ```

6. Deixem rodar. Quando o instrutor bater na mesa, parem.
7. Comparem com o grupo ao lado: **o código deles satisfaz os SEUS quatro critérios?**

### O molde

```
QUANDO   <gatilho>,             o sistema DEVE <resposta>
ENQUANTO <condição de estado>,  o sistema DEVE <resposta>
SE       <situação indesejada>, ENTÃO o sistema DEVE <resposta>
```

A regra que vale mais que o molde: **se a frase não vira um teste, a frase está errada.** Reescreva a frase.

---

## 3. A revisão

Quando o instrutor mandar — não antes — rode no terminal:

```
npm run revisao
```

Isso cria um arquivo `REVISAO.md` na raiz. Abram no editor e leiam.

Regras: **não rodem nada, não colem no Cline, não abram o código.** É leitura de revisor, como num PR.

Seis minutos para o grupo decidir: **aprova ou reprova?** Se reprovar, anotem em qual item e por quê — o instrutor vai perguntar.

---

## 4. O `.clinerules` — o agente escreve, vocês corrigem, e a gente testa

O Cline lê o arquivo `.clinerules` da raiz em **toda** tarefa. É onde ficam as regras que você não quer repetir a cada pedido. O deste repositório está propositalmente magro. Vamos fazer um de verdade — sem escrever nada de memória.

### Passo 1 — o agente escreve (3 min)

**New Task**, modo Act, cole:

```
Leia este repositório e escreva um arquivo .clinerules na raiz com exatamente estas seis seções: Comandos, Testes, Estrutura, Estilo, Git, Nunca faça. Cada seção com no máximo 5 linhas. Em Estilo, cole um trecho real de src/pricing.js em vez de descrever. Não invente nada que não esteja no código.
```

Aprove. Leia o que saiu. Tudo ali o agente **descobriu olhando o código**.

### Passo 2 — vocês acrescentam o que ele não tem como saber (1 min)

Abram o `.clinerules` e adicionem, à mão, esta linha na seção **Nunca faça**:

```
- Nunca converta centavos para reais dentro de src/. Formatação é problema de quem exibe.
```

Essa regra não está em lugar nenhum do código. É uma decisão de quem conhece o projeto. **É a única parte que só vocês podem escrever.**

### Passo 3 — testar se a regra pega (4 min)

**New Task** (obrigatório — senão ele não relê o arquivo). Cole:

```
faça GET /cart/:id/total devolver os valores em reais com duas casas, tipo 189.97
```

Observe o que ele faz. Só há quatro possibilidades:

- **Recusa** e cita a regra.
- **Pergunta** se pode, ou propõe fazer só em `server.js`.
- **Faz em `server.js`** e deixa `pricing.js` em centavos — respeitou.
- **Faz em `pricing.js`** — ignorou a regra.

Anotem qual foi. O instrutor vai perguntar.

### Passo 4 — guarde (1 min)

```
git add .clinerules && git commit -m "regras do projeto"
```

### Depois, no seu projeto

Rode o **Passo 1** no seu projeto de verdade. Leia o que saiu. Acrescente as duas ou três linhas que só você sabe. Teste uma delas. É o mesmo procedimento — o projeto é o que muda.

Se o time usa outros agentes além do Cline, copie o mesmo conteúdo para `AGENTS.md`.

---

## Travou?

Cada etapa tem um branch com o resultado esperado. Use se o agente travar, a API falhar, ou o grupo se perder — sem culpa. O que vocês tinham feito fica guardado num `git stash`.

| Comando | O que você recebe |
| --- | --- |
| `npm run checkpoint:1` | Um `SPEC.md` com quatro critérios de exemplo — para a rodada 2 |
| `npm run checkpoint:2` | O cupom implementado a partir desses critérios, com testes |
| `npm run checkpoint:3` | Um `.clinerules` completo, para comparar com o que o seu agente escreveu |
| `npm run voltar` | De volta ao `main` |

Para recuperar o que vocês tinham feito: `git stash list` e `git stash pop`.
