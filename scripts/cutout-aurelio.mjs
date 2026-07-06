/**
 * Genera public/images/aurelio-hero.png: un Aurelio con fondo TRANSPARENTE y
 * SIN el globo de diálogo (el globo se dibuja en código en el héroe).
 *
 * Dos fuentes posibles (se elige automáticamente):
 *   1. public/images/aurelio-raw.png  -> render con fondo VERDE (chroma key).
 *      Es la mejor calidad. Sube ahí el render de cuerpo completo.
 *   2. public/images/aurelio-ia-hero.png -> imagen actual (fondo blanco + globo
 *      pintado). Se recorta el fondo por flood-fill y se borra el globo.
 *
 * Uso:  node scripts/cutout-aurelio.mjs
 */
import sharp from "sharp";
import { existsSync } from "node:fs";

const OUT = "public/images/aurelio-hero.png";
const GREEN_SRC = "public/images/aurelio-raw.png";
const WHITE_SRC = "public/images/aurelio-ia-hero.png";

function idx(x, y, W) {
  return (y * W + x) * 4;
}

/** Chroma key de fondo verde + despill de bordes. */
function keyGreen(data, W, H) {
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const greenness = g - Math.max(r, b);
    if (g > 80 && greenness > 32) {
      data[p + 3] = 0;
    } else if (greenness > 8) {
      // despill: baja el verde sobrante en los bordes
      const cap = Math.round((r + b) / 2 + 6);
      if (g > cap) data[p + 1] = cap;
    }
  }
}

/** Flood-fill del fondo claro desde los bordes -> alpha 0. */
function keyWhiteBackground(data, W, H) {
  const isBg = (x, y) => {
    const p = idx(x, y, W);
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    return mn >= 214 && mx - mn <= 26;
  };

  const visited = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const k = y * W + x;
    if (visited[k]) return;
    if (!isBg(x, y)) return;
    visited[k] = 1;
    stack.push(k);
  };

  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }

  while (stack.length) {
    const k = stack.pop();
    const x = k % W;
    const y = (k - x) / W;
    data[k * 4 + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  // Etiqueta componentes conectados sobre lo que quedó opaco. El globo es una
  // isla separada en la zona superior; los zapatos pueden quedar como islas
  // separadas abajo. Eliminamos SOLO las islas de la parte superior (el globo),
  // conservando al oso y sus zapatos.
  const label = new Int32Array(W * H).fill(-1);
  const comps = [];
  const queue = [];
  for (let s = 0; s < W * H; s++) {
    if (!data[s * 4 + 3] || label[s] !== -1) continue;
    let size = 0;
    let maxY = 0;
    label[s] = s;
    queue.push(s);
    while (queue.length) {
      const k = queue.pop();
      size++;
      const x = k % W;
      const y = (k - x) / W;
      if (y > maxY) maxY = y;
      const nb = [];
      if (x > 0) nb.push(k - 1);
      if (x < W - 1) nb.push(k + 1);
      if (y > 0) nb.push(k - W);
      if (y < H - 1) nb.push(k + W);
      for (const nk of nb) {
        if (data[nk * 4 + 3] && label[nk] === -1) {
          label[nk] = s;
          queue.push(nk);
        }
      }
    }
    comps.push({ id: s, size, maxY });
  }

  const bearId = comps.reduce((a, b) => (b.size > a.size ? b : a)).id;
  const removeIds = new Set(
    comps
      .filter((c) => c.id !== bearId && c.maxY < H * 0.4)
      .map((c) => c.id)
  );
  if (removeIds.size) {
    for (let k = 0; k < W * H; k++) {
      if (removeIds.has(label[k])) data[k * 4 + 3] = 0;
    }
  }

  // Erosiona 1px el halo claro que queda en el contorno.
  const alpha = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) alpha[i] = data[i * 4 + 3];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = y * W + x;
      if (!alpha[k]) continue;
      const p = k * 4;
      const mn = Math.min(data[p], data[p + 1], data[p + 2]);
      if (mn < 205) continue; // solo píxeles casi blancos
      const neighborTransparent =
        (x > 0 && !alpha[k - 1]) ||
        (x < W - 1 && !alpha[k + 1]) ||
        (y > 0 && !alpha[k - W]) ||
        (y < H - 1 && !alpha[k + W]);
      if (neighborTransparent) data[p + 3] = 0;
    }
  }
}

async function main() {
  const useGreen = existsSync(GREEN_SRC);
  const src = useGreen ? GREEN_SRC : WHITE_SRC;
  if (!existsSync(src)) {
    console.error(`No se encontró la imagen fuente: ${src}`);
    process.exit(1);
  }

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  if (useGreen) {
    console.log(`Fuente verde: ${src} (${W}x${H}) -> chroma key`);
    keyGreen(data, W, H);
  } else {
    console.log(`Fuente blanca: ${src} (${W}x${H}) -> flood-fill + borrar globo`);
    keyWhiteBackground(data, W, H);
  }

  await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .trim({ threshold: 1 })
    .toFile(OUT);

  console.log(`Listo -> ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
