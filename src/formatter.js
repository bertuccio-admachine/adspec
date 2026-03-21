const c = require('./colors');

function formatPlacement(platform, placement, jsonMode = false) {
  if (jsonMode) {
    return JSON.stringify({ platform: platform.name, placement }, null, 2);
  }

  const lines = [];
  lines.push(c.bold(c.cyan(`${platform.name} — ${placement.name}`)));
  lines.push('');

  // Formats
  const formats = placement.formats || {};
  for (const [type, spec] of Object.entries(formats)) {
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    lines.push(`  ${c.bold(c.green(label))}`);
    if (spec.dimensions) lines.push(`    Dimensions:   ${c.white(spec.dimensions)}`);
    if (spec.aspectRatio) lines.push(`    Aspect ratio: ${c.white(spec.aspectRatio)}`);
    if (spec.maxSize) lines.push(`    Max size:     ${c.white(spec.maxSize)}`);
    if (spec.types) lines.push(`    File types:   ${c.white(spec.types.join(', '))}`);
    if (spec.duration) lines.push(`    Duration:     ${c.white(spec.duration)}`);
    if (spec.recommended) lines.push(`    Recommended:  ${c.yellow(spec.recommended)}`);
    if (spec.maxPages) lines.push(`    Max pages:    ${c.white(String(spec.maxPages))}`);
    if (spec.note) lines.push(`    Note:         ${c.gray(spec.note)}`);
    lines.push('');
  }

  // Text specs
  const text = placement.text || {};
  if (Object.keys(text).length > 0) {
    lines.push(`  ${c.bold(c.magenta('Text'))}`);
    for (const [field, spec] of Object.entries(text)) {
      let parts = [];
      if (spec.recommended) parts.push(`${spec.recommended} chars recommended`);
      if (spec.max) parts.push(`max ${spec.max}`);
      if (spec.min) parts.push(`min ${spec.min}`);
      if (spec.note) parts.push(spec.note);
      lines.push(`    ${field}: ${c.white(parts.join(', ') || '—')}`);
    }
    lines.push('');
  }

  // Requirements
  if (placement.requirements && placement.requirements.length > 0) {
    lines.push(`  ${c.bold(c.yellow('Requirements'))}`);
    for (const req of placement.requirements) {
      lines.push(`    ${c.yellow('•')} ${req}`);
    }
    lines.push('');
  }

  // Notes
  if (placement.notes && placement.notes.length > 0) {
    lines.push(`  ${c.bold(c.gray('Notes'))}`);
    for (const note of placement.notes) {
      lines.push(`    ${c.gray('→')} ${c.gray(note)}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatPlatformList(platform) {
  const lines = [];
  lines.push(c.bold(c.cyan(platform.name)) + c.gray(` (${platform.slug})`));
  if (platform.aliases && platform.aliases.length > 0) {
    lines.push(c.gray(`  aliases: ${platform.aliases.join(', ')}`));
  }
  lines.push('');
  lines.push('  Placements:');
  for (const p of (platform.placements || [])) {
    const aliases = (p.aliases || []).length > 0 ? c.gray(` (${p.aliases.join(', ')})`) : '';
    lines.push(`    ${c.green('▸')} ${c.bold(p.slug)}${aliases} — ${p.name}`);
  }
  lines.push('');
  lines.push(c.gray(`  Usage: adspec ${platform.slug} <placement>`));
  return lines.join('\n');
}

function formatAllPlatforms(platforms) {
  const lines = [];
  lines.push(c.bold('Available platforms:'));
  lines.push('');
  for (const p of platforms) {
    const count = (p.placements || []).length;
    const aliases = (p.aliases || []).length > 0 ? c.gray(` (${p.aliases.join(', ')})`) : '';
    lines.push(`  ${c.green('▸')} ${c.bold(p.slug)}${aliases} — ${p.name} ${c.gray(`[${count} placements]`)}`);
  }
  lines.push('');
  lines.push(c.gray('Usage: adspec <platform> [placement]'));
  lines.push(c.gray('       adspec search <query>'));
  return lines.join('\n');
}

function formatSearchResults(results, query) {
  if (results.length === 0) {
    return c.yellow(`No results found for "${query}"`);
  }
  const lines = [];
  lines.push(c.bold(`Search results for "${query}":`));
  lines.push('');
  for (const { platform, placement } of results) {
    lines.push(`  ${c.green('▸')} ${c.bold(`${platform.slug} ${placement.slug}`)} — ${platform.name}: ${placement.name}`);
  }
  lines.push('');
  lines.push(c.gray('Usage: adspec <platform> <placement> for full specs'));
  return lines.join('\n');
}

module.exports = { formatPlacement, formatPlatformList, formatAllPlatforms, formatSearchResults };
