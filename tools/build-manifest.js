// Gera modpack/manifest.json a partir dos arquivos em modpack/.
// Roda sozinho no GitHub Actions a cada alteração na pasta modpack/ (não precisa rodar à mão).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', 'modpack');
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

const manifest = {
  // Mods na pasta mods/ do jogador que não estiverem aqui são apagados (mantém todo mundo igual).
  // Com a pasta vazia nada é apagado, para não limpar os mods de ninguém por engano.
  removeUnlisted: files.some((f) => f.path.startsWith('mods/')) ? ['mods'] : [],
  files,
};

fs.writeFileSync(path.join(ROOT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest.json: ${files.length} arquivo(s)`);
