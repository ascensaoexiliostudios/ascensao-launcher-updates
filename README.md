# Ascensão SMP — Atualizações do launcher

Tudo que está aqui é baixado pelos launchers dos jogadores. **Só esta conta pode editar.**
Qualquer alteração feita aqui chega nos jogadores sem precisar lançar uma versão nova do launcher.

> Edite direto pelo site do GitHub: abra o arquivo → ícone de lápis → altere → **Commit changes**.

---

## `config.json` — servidor e notícias

| Campo | O que faz |
|---|---|
| `serverAddress` | IP do servidor (status e conexão automática ao abrir o jogo) |
| `news` | Frases do letreiro que passa no banner da aba Início |
| `seasonStart` | Data de início da temporada (`AAAA-MM-DD`), usada no "DIA X DO EXÍLIO" |
| `forgeVersion` / `minecraftVersion` | Versões do Forge e do Minecraft |
| `allowOffline` | `true` permite Minecraft pirata (só nick); `false` exige conta Microsoft |
| `links.discord` / `links.site` | Links dos botões da barra lateral (vazio esconde o botão) |
| `serverName` / `subtitle` | Nome exibido no launcher |

Os launchers abertos verificam mudanças a cada 10 minutos; ao abrir, pegam na hora.

## `lore.json` — capítulos, sussurros e terminal

Cada capítulo em `chapters`:

```json
{
  "id": "registro-001",
  "title": "Nome do capítulo",
  "subtitle": "Registro 001",
  "sealed": true,
  "unlockAt": "2026-10-12T20:00:00-03:00",
  "quote": "frase em destaque no topo",
  "text": "Primeiro parágrafo.\n\nSegundo parágrafo.",
  "question": "pergunta no fim (opcional)",
  "ending": "FRASE FINAL EM DESTAQUE"
}
```

- `id`: único e **nunca muda** (o launcher usa para lembrar o que o jogador já leu/queimou).
- `locked: true`: aparece como "CORROMPIDO" (texto censurado, não abre).
- `sealed: true`: o jogador precisa segurar o clique para "queimar" o selo e ler.
- `unlockAt`: até essa data aparece uma contagem regressiva "SINAL EM 3d 04:12:09"; na hora certa
  o capítulo se libera sozinho com glitch e som de correntes.

> ⚠️ Este repositório é público (os launchers precisam ler). Para não vazar um capítulo antes da hora,
> deixe só `id`, `title: "???"`, `subtitle` e `unlockAt` até o dia, e cole o texto quando liberar.

- `whispers`: frases que escapam pela interface em glitches rápidos.
- `terminal.commands`: comandos do terminal secreto (tecla à esquerda do 1). Exemplo:
  `"fogo": { "hidden": true, "reply": ["linha 1", "linha 2"] }`. `{nome}` vira a resposta do jogador
  ao "O QUE É VOCÊ?" e `{dia}` vira o dia do exílio.

## `modpack/` — mods e arquivos do jogo

Coloque os arquivos **na mesma estrutura da pasta do jogo**:

```
modpack/
  mods/            ← .jar dos mods
  config/          ← configs dos mods (opcional)
  resourcepacks/   ← opcional
```

Para enviar: abra a pasta `modpack/mods` no GitHub → **Add file → Upload files** → arraste os `.jar` → **Commit changes**.
Para remover um mod: abra o arquivo → ícone de lixeira → **Commit changes**.

O `modpack/manifest.json` é gerado sozinho (aba **Actions**) a cada mudança — **não edite à mão**.
Quando o jogador clica em JOGAR, o launcher baixa só o que mudou e apaga da pasta `mods/` os mods que
não estão mais aqui.

Limite do GitHub: **100 MB por arquivo**.

## Releases — instaladores do launcher

As releases deste repositório têm os instaladores:

- **Windows:** `Ascensao-Launcher-Setup-X.Y.Z.exe`
- **Linux:** `Ascensao-Launcher-X.Y.Z-x86_64.AppImage` (qualquer distro) ou `.deb` (Ubuntu/Debian)

Link fixo para divulgar: https://github.com/ascensaoexiliostudios/ascensao-launcher-updates/releases/latest

Elas são publicadas automaticamente pelo repositório privado do código (`ascensao-launcher`) com
`npm run release`. Os launchers instalados se atualizam sozinhos.
