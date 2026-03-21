const { loadAllPlatforms, findPlatform, findPlacement, searchAll, getSuggestions, getPlacementSuggestions } = require('./search');
const { formatPlacement, formatPlatformList, formatAllPlatforms, formatSearchResults } = require('./formatter');
const c = require('./colors');

function run(args) {
  const jsonMode = args.includes('--json');
  const filteredArgs = args.filter(a => !a.startsWith('--'));

  if (filteredArgs.length === 0 || filteredArgs[0] === 'help') {
    printHelp();
    return;
  }

  const command = filteredArgs[0].toLowerCase();

  // List all platforms
  if (command === 'list' || command === 'ls' || command === 'platforms') {
    const platforms = loadAllPlatforms();
    if (jsonMode) {
      console.log(JSON.stringify(platforms.map(p => ({
        name: p.name, slug: p.slug, aliases: p.aliases,
        placements: (p.placements || []).map(pl => pl.slug)
      })), null, 2));
    } else {
      console.log(formatAllPlatforms(platforms));
    }
    return;
  }

  // Search
  if (command === 'search' || command === 'find') {
    const query = filteredArgs.slice(1).join(' ');
    if (!query) {
      console.error(c.red('Usage: adspec search <query>'));
      process.exit(1);
    }
    const results = searchAll(query);
    if (jsonMode) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.log(formatSearchResults(results, query));
    }
    return;
  }

  // Version
  if (command === 'version' || command === '-v') {
    const pkg = require('../package.json');
    console.log(`adspec v${pkg.version}`);
    return;
  }

  // Find platform
  const platform = findPlatform(command);
  if (!platform) {
    const suggestions = getSuggestions(command);
    console.error(c.red(`Unknown platform: "${command}"`));
    if (suggestions.length > 0) {
      console.error(c.yellow(`Did you mean: ${suggestions.join(', ')}?`));
    }
    console.error(c.gray('\nRun `adspec list` to see all platforms.'));
    process.exit(1);
  }

  // No placement specified — list placements
  if (filteredArgs.length < 2) {
    if (jsonMode) {
      console.log(JSON.stringify(platform, null, 2));
    } else {
      console.log(formatPlatformList(platform));
    }
    return;
  }

  // Find placement
  const placementQuery = filteredArgs.slice(1).join('-');
  const placement = findPlacement(platform, placementQuery);
  if (!placement) {
    const suggestions = getPlacementSuggestions(platform, placementQuery);
    console.error(c.red(`Unknown placement: "${placementQuery}" for ${platform.name}`));
    if (suggestions.length > 0) {
      console.error(c.yellow(`Did you mean: ${suggestions.join(', ')}?`));
    }
    console.error(c.gray(`\nRun \`adspec ${platform.slug}\` to see all placements.`));
    process.exit(1);
  }

  console.log(formatPlacement(platform, placement, jsonMode));
}

function printHelp() {
  console.log(`
${c.bold('adspec')} — Instant ad platform creative specs from the terminal.

${c.bold('USAGE')}
  adspec <platform> [placement]    Show specs for a placement
  adspec <platform>                List all placements for a platform
  adspec list                      List all supported platforms
  adspec search <query>            Search across all specs
  adspec help                      Show this help

${c.bold('OPTIONS')}
  --json                           Output as JSON (for scripting)

${c.bold('EXAMPLES')}
  adspec meta feed                 Meta Feed Ad specs
  adspec tiktok in-feed            TikTok In-Feed Ad specs
  adspec google pmax               Google Performance Max specs
  adspec linkedin video            LinkedIn Video Ad specs
  adspec snap story                Snapchat Story Ad specs
  adspec search 9:16               Find all 9:16 placements
  adspec search carousel           Find all carousel formats

${c.bold('PLATFORMS')}
  meta, tiktok, google, linkedin, snapchat, pinterest, youtube, x, amazon

${c.gray('Aliases work too: fb, ig, tt, snap, yt, twitter, amz, gads')}
`);
}

module.exports = { run };
