// Gera modpack/manifest.json a partir dos arquivos em modpack/.
// Roda sozinho no GitHub Actions a cada alteração na pasta modpack/ (não precisa rodar à mão).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.join(__dirname, '..');
const ROOT = path.join(REPO_ROOT, 'modpack');
const REPO = process.env.GITHUB_REPOSITORY || 'ascensaoexiliostudios/ascensao-launcher-updates';
const BRANCH = process.env.GITHUB_REF_NAME || 'main';
const IGNORE = new Set(['manifest.json', '.gitkeep', 'README.md']);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return IGNORE.has(e.name) ? [] : [full];
  });
}

// Lista de mods proibidos (nomods/proibidos.txt): o launcher remove esses jars do jogador.
function readForbidden() {
  const file = path.join(REPO_ROOT, 'nomods', 'proibidos.txt');
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
}

const files = walk(ROOT)
  .map((full) => {
    const rel = path.relative(ROOT, full).split(path.sep).join('/');
    const data = fs.readFileSync(full);
    return {
      path: rel,
      url: `https://raw.githubusercontent.com/${REPO}/${BRANCH}/modpack/${rel.split('/').map(encodeURIComponent).join('/')}`,
      sha1: crypto.createHash('sha1').update(data).digest('hex'),
      size: data.length,
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const forbidden = readForbidden();

const manifest = {
  // Mods na pasta mods/ do jogador que não estiverem aqui são apagados (mantém todo mundo igual).
  // Com a pasta vazia nada é apagado, para não limpar os mods de ninguém por engano.
  removeUnlisted: files.some((f) => f.path.startsWith('mods/')) ? ['mods'] : [],
  // Padrões (nome do jar ou id) que o launcher tira da pasta mods/ antes de abrir o jogo.
  forbidden,
  files,
};

fs.writeFileSync(path.join(ROOT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest.json: ${files.length} arquivo(s), ${forbidden.length} proibido(s)`);
