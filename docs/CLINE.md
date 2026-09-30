# Cline neste workshop

Guia mínimo para quem nunca usou. Cinco minutos de leitura.

## Antes do workshop

1. Instale a extensão **Cline** no VS Code (marketplace, autor "Cline").
2. Abra a **pasta** `checkout-workshop` no VS Code (*File → Open Folder*). O Cline só enxerga a pasta aberta — se abrir um arquivo solto, ele não vê o projeto.
3. No painel do Cline, configure o provedor:
   - **API Provider:** o que a empresa indicou para o GLM (*Z AI*, ou *OpenAI Compatible* com a base URL fornecida).
   - **Model:** o modelo GLM indicado.
   - **API Key:** a chave que você recebeu.
   - Os nomes exatos dos campos variam com a versão do Cline. Se não encontrar, pergunte antes do dia.
4. Teste: peça *"adicione um comentário no topo de src/pricing.js"*. Aprove a edição. Confirme que o arquivo mudou.
5. Desfaça: `npm run reset` no terminal.

## Configurações para o dia

No painel do Cline, abra **Auto-approve**:

| Opção | Deixe | Por quê |
| --- | --- | --- |
| Read project files | ✅ | Senão você clica trinta vezes |
| Edit project files | ✅ | Idem |
| Execute commands | ❌ | Você vai querer *ver* quando ele resolve rodar `npm test` — ou não |
| Max requests | 50 | Para ele não parar no meio para pedir permissão de continuar |

Se a sala inteira estiver lenta, o instrutor pode liberar a execução de comandos seguros.

## Os dois modos

- **Plan** — só lê e propõe. Não edita.
- **Act** — edita e roda.

**Neste workshop, use Act nas duas rodadas.** O motivo: a única coisa que pode mudar entre a rodada 1 e a rodada 2 é o texto do pedido. Se você trocar de modo, não dá mais para saber o que causou a diferença.

## Entre as rodadas — obrigatório

1. `npm run reset` no terminal.
2. **New Task** no Cline (o botão `+` no topo do painel).

Sem o New Task, o agente continua com a memória da rodada 1 e vai repetir as decisões que já tomou. O experimento deixa de valer.

## Como colar o pedido

- Cole exatamente o que o instrutor projetar. **Não acrescente nada.** Não "ajude".
- Se o Cline perguntar alguma coisa, responda **"decida você"** e anote a pergunta. Cada pergunta dele é uma lacuna do enunciado — vai valer no debate.
- Aprove o que ele pedir para editar. Se pedir para rodar um comando, leia o comando e aprove.

## Ver o que ele fez

- No terminal: `git diff` mostra tudo que mudou.
- No Cline: cada edição aparece como um bloco com o diff.
- `npm test` para ver se os testes continuam verdes.
- `npm start` e depois `curl http://localhost:3000/cart/c1/total` para ver o número de verdade.

## Regras do jogo

- Não edite código à mão durante as rodadas.
- Não dê dica para o agente fora do pedido.
- Não olhe a tela do vizinho até o instrutor mandar.

## Se travar

| Sintoma | Faça |
| --- | --- |
| Erro de API ou limite de uso | Espere 30 segundos e clique em *Retry*. Se persistir, junte-se à dupla ao lado. |
| Ficou em loop, repetindo a mesma coisa | *Cancel*, New Task, cole o pedido de novo. |
| Aviso de contexto cheio | New Task. |
| Ele estragou um arquivo | `npm run reset` e recomece a rodada. |
| Perdeu tudo e o tempo está acabando | `npm run checkpoint:1` (ou `:2`, `:3`). Veja o guia do participante. |

## O `.clinerules`

O Cline lê o arquivo `.clinerules` na raiz do projeto (ou uma pasta `.clinerules/` com vários `.md`) **em toda tarefa**, automaticamente. É onde moram as regras que você não quer repetir em cada pedido: comandos, convenções, limites.

O deste repositório está propositalmente magro. Você escreve um de verdade no último bloco.
