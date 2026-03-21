const fs = require('fs');
const path = require('path');

const specsDir = path.join(__dirname, 'specs');

function loadAllPlatforms() {
  const files = fs.readdirSync(specsDir).filter(f => f.endsWith('.json'));
  return files.map(f => JSON.parse(fs.readFileSync(path.join(specsDir, f), 'utf8')));
}

function findPlatform(query) {
  const platforms = loadAllPlatforms();
  const q = query.toLowerCase().trim();
  
  // Exact slug or alias match
  for (const p of platforms) {
    if (p.slug === q || (p.aliases || []).includes(q)) return p;
  }
  
  // Fuzzy: starts with
  for (const p of platforms) {
    if (p.slug.startsWith(q) || p.name.toLowerCase().startsWith(q)) return p;
    for (const a of (p.aliases || [])) {
      if (a.startsWith(q)) return p;
    }
  }
  
  // Fuzzy: contains
  for (const p of platforms) {
    if (p.slug.includes(q) || p.name.toLowerCase().includes(q)) return p;
    for (const a of (p.aliases || [])) {
      if (a.includes(q)) return p;
    }
  }
  
  return null;
}

function findPlacement(platform, query) {
  const q = query.toLowerCase().trim().replace(/\s+/g, '-');
  const placements = platform.placements || [];
  
  // Exact slug or alias
  for (const p of placements) {
    if (p.slug === q || (p.aliases || []).includes(q)) return p;
  }
  
  // Starts with
  for (const p of placements) {
    if (p.slug.startsWith(q) || p.name.toLowerCase().replace(/\s+/g, '-').startsWith(q)) return p;
    for (const a of (p.aliases || [])) {
      if (a.startsWith(q)) return p;
    }
  }
  
  // Contains
  for (const p of placements) {
    if (p.slug.includes(q) || p.name.toLowerCase().includes(q)) return p;
    for (const a of (p.aliases || [])) {
      if (a.includes(q)) return p;
    }
  }
  
  return null;
}

function searchAll(query) {
  const platforms = loadAllPlatforms();
  const q = query.toLowerCase().trim();
  const results = [];
  
  for (const platform of platforms) {
    for (const placement of (platform.placements || [])) {
      const searchable = JSON.stringify(placement).toLowerCase();
      if (searchable.includes(q)) {
        results.push({ platform, placement });
      }
    }
  }
  
  return results;
}

function getSuggestions(query) {
  const platforms = loadAllPlatforms();
  const q = query.toLowerCase();
  const suggestions = [];
  
  for (const p of platforms) {
    const names = [p.slug, ...(p.aliases || [])];
    for (const name of names) {
      if (levenshtein(q, name) <= 2) {
        suggestions.push(p.slug);
        break;
      }
    }
  }
  
  return [...new Set(suggestions)];
}

function getPlacementSuggestions(platform, query) {
  const q = query.toLowerCase().replace(/\s+/g, '-');
  const suggestions = [];
  
  for (const p of (platform.placements || [])) {
    const names = [p.slug, ...(p.aliases || [])];
    for (const name of names) {
      if (levenshtein(q, name) <= 2) {
        suggestions.push(p.slug);
        break;
      }
    }
  }
  
  return [...new Set(suggestions)];
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
    }
  }
  return matrix[a.length][b.length];
}

module.exports = { loadAllPlatforms, findPlatform, findPlacement, searchAll, getSuggestions, getPlacementSuggestions };
