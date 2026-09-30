# Guia do participante

Você vai fazer **duas rodadas com o agente**, **uma revisão no papel** e **um arquivo de configuração**. Tudo em 90 minutos.

Não leia o código antes. Não estude nada antes. Só garanta que a máquina funciona.

---

## 0. Antes do workshop — 10 minutos, obrigatório

1. Clone este repositório e abra a pasta no VS Code.
2. Rode `npm test`. Os 11 testes precisam passar.
   Não existe `npm install` — o projeto não tem dependência nenhuma. Só precisa de **Node 20 ou superior**.
3. Configure o Cline seguindo [`docs/CLINE.md`](./CLINE.md).
4. Peça ao Cline algo trivial: *"adicione um comentário no topo de src/pricing.js"*.
   Confirme que ele editou o arquivo. Depois desfaça com `npm run reset`.
5. Responda ao instrutor com uma palavra: **funcionou** ou **quebrou**.

Se quebrou, avise antes do dia. Não dá tempo de consertar na hora.

---

## 1. Rodada 1 — o pedido

**Quando o instrutor mandar, não antes.**

1. Cline em modo **Act**.
2. Cole **exatamente** isto, sem acrescentar nada:

   ```
   aplique o cupom no carrinho
   ```

3. Se o Cline fizer alguma pergunta, responda só: **"decida você"**. Anote a pergunta.
4. Deixe rodar. Aprove o que ele pedir.
5. Quando o instrutor bater na mesa, **pare** — mesmo que não tenha terminado.
6. Anote no papel **três decisões que o agente tomou sozinho**.
   Dica: suba a API com `npm start` e olhe os totais de alguns carrinhos:
   `curl http://localhost:3000/cart/c1/total` (troque `c1` por `c2`, `c3`… até `c7`).
   Compare com o que *você* esperaria de cada um.

Não corrija nada. Não edite código à mão. O que interessa é o que ele fez.

---

## 2. Rodada 2 — o mesmo pedido, com critérios

1. Crie um arquivo `SPEC.md` na raiz com **exatamente quatro** critérios de aceitação, usando o molde abaixo.
   Pelo menos um deles tem que começar com **ENQUANTO**.
2. Desfaça a rodada 1: `npm run reset` (o `SPEC.md` não é apagado).
3. No Cline, clique em **New Task** (o `+`). Sem isso ele lembra o que decidiu na rodada 1 e o experimento morre.
4. Cole o **mesmo pedido** de antes, uma linha em branco, e os seus quatro critérios:

   ```
   aplique o cupom no carrinho

   Critérios de aceitação:
   1. ...
   2. ...
   3. ...
   4. ...
   ```

5. Deixe rodar. Quando o instrutor bater na mesa, pare.
6. Troque de tela com a dupla ao lado: **o código deles satisfaz os SEUS quatro critérios?**

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

Isso cria um arquivo `REVISAO.md` na raiz. Abra no editor e leia.

Regras: **não rode nada, não cole no Cline, não abra o código.** É leitura de revisor, como num PR.

Você tem seis minutos, em dupla, para decidir: **aprova ou reprova?** Se reprovar, anote em qual item e por quê — o instrutor vai perguntar.

---

## 4. O `.clinerules` — o agente escreve, você corrige, e a gente testa

O Cline lê o arquivo `.clinerules` da raiz em **toda** tarefa. É onde ficam as regras que você não quer repetir a cada pedido. O deste repositório está propositalmente magro. Vamos fazer um de verdade — sem escrever nada de memória.

### Passo 1 — o agente escreve (3 min)

**New Task**, modo Act, cole:

```
Leia este repositório e escreva um arquivo .clinerules na raiz com exatamente estas seis seções: Comandos, Testes, Estrutura, Estilo, Git, Nunca faça. Cada seção com no máximo 5 linhas. Em Estilo, cole um trecho real de src/pricing.js em vez de descrever. Não invente nada que não esteja no código.
```

Aprove. Leia o que saiu. Tudo ali o agente **descobriu olhando o código**.

### Passo 2 — você acrescenta o que ele não tem como saber (1 min)

Abra o `.clinerules` e adicione, à mão, esta linha na seção **Nunca faça**:

```
- Nunca converta centavos para reais dentro de src/. Formatação é problema de quem exibe.
```

Essa regra não está em lugar nenhum do código. É uma decisão de quem conhece o projeto. **É a única parte que só você pode escrever.**

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

Anote qual foi. O instrutor vai perguntar.

### Passo 4 — guarde (1 min)

```
git add .clinerules && git commit -m "regras do projeto"
```

### Na segunda-feira

Rode o **Passo 1** no seu projeto de verdade. Leia o que saiu. Acrescente as duas ou três linhas que só você sabe. Teste uma delas. É o mesmo procedimento — o projeto é o que muda.

Se o time usa outros agentes além do Cline, copie o mesmo conteúdo para `AGENTS.md`.

---

## Travou?

Cada etapa tem um branch com o resultado esperado. Use se o agente travar, a API falhar, ou você se perder — sem culpa. O que você tinha feito fica guardado num `git stash`.

| Comando | O que você recebe |
| --- | --- |
| `npm run checkpoint:1` | Um `SPEC.md` com quatro critérios de exemplo — para a rodada 2 |
| `npm run checkpoint:2` | O cupom implementado a partir desses critérios, com testes |
| `npm run checkpoint:3` | Um `.clinerules` completo, para comparar com o que o seu agente escreveu |
| `npm run voltar` | De volta ao `main` |

Para recuperar o que você tinha feito: `git stash list` e `git stash pop`.
