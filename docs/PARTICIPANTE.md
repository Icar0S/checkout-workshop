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

## 3. A revisão no papel

Sem máquina. O instrutor entrega uma especificação impressa.

Você tem seis minutos, em dupla, para **aprovar ou reprovar**. Se reprovar, marque onde.

---

## 4. O `.clinerules` do seu projeto

Abra o `.clinerules` deste repositório. Ele está propositalmente incompleto.

Agora pense no **seu** projeto de verdade — não neste — e preencha o modelo abaixo num arquivo novo. Seis blocos. Prosa proibida: se der vontade de escrever um parágrafo explicando o estilo, cole dez linhas de um arquivo real no lugar.

```
# Regras do projeto

## Comandos
Instalar:  <comando exato>
Rodar:     <comando exato>
Testar:    <comando exato>
Lint:      <comando exato>

## Testes
Framework: <qual>. Onde ficam: <caminho>.
Toda mudança de comportamento precisa de teste.
Não altere teste existente para fazer passar.

## Estrutura
<3 a 5 linhas: onde mora o quê. Só o que não dá para adivinhar olhando.>

## Estilo
<Cole 10 linhas de um arquivo real que representa bem o padrão.>

## Git
Branch: <convenção>
Commit: <convenção>

## Nunca faça
- <limite 1>
- <limite 2>
- <limite 3>
```

Leve esse arquivo para o seu projeto na segunda-feira. Chama `.clinerules`. Se o time usa outros agentes, copie o mesmo conteúdo para `AGENTS.md`.

---

## Travou?

Cada etapa tem um branch com o resultado esperado. Use se o agente travar, a API falhar, ou você se perder — sem culpa. O que você tinha feito fica guardado num `git stash`.

| Comando | O que você recebe |
| --- | --- |
| `npm run checkpoint:1` | Um `SPEC.md` com quatro critérios de exemplo — para a rodada 2 |
| `npm run checkpoint:2` | O cupom implementado a partir desses critérios, com testes |
| `npm run checkpoint:3` | Um `.clinerules` completo, como exemplo para o bloco 4 |
| `npm run voltar` | De volta ao `main` |

Para recuperar o que você tinha feito: `git stash list` e `git stash pop`.
