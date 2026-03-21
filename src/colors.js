// Zero-dependency ANSI color helpers
const esc = (code) => `\x1b[${code}m`;
const reset = esc(0);

const colors = {
  bold: (s) => `${esc(1)}${s}${reset}`,
  dim: (s) => `${esc(2)}${s}${reset}`,
  cyan: (s) => `${esc(36)}${s}${reset}`,
  green: (s) => `${esc(32)}${s}${reset}`,
  yellow: (s) => `${esc(33)}${s}${reset}`,
  magenta: (s) => `${esc(35)}${s}${reset}`,
  red: (s) => `${esc(31)}${s}${reset}`,
  blue: (s) => `${esc(34)}${s}${reset}`,
  white: (s) => `${esc(37)}${s}${reset}`,
  gray: (s) => `${esc(90)}${s}${reset}`,
};

// Disable colors if NO_COLOR env or not a TTY
if (process.env.NO_COLOR || !process.stdout.isTTY) {
  for (const key of Object.keys(colors)) {
    colors[key] = (s) => s;
  }
}

module.exports = colors;
