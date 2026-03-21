# adspec

**Instant ad platform creative specs from the terminal. Stop googling dimensions.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

---

Every media buyer, designer, and marketer googles "Meta feed ad dimensions" or "TikTok video specs" multiple times a day. Every. Single. Day.

**adspec** puts every ad platform's creative specs at your fingertips — instantly, offline, always up to date.

```
$ adspec meta feed

Meta — Feed Ad

  Image
    Dimensions:   1080×1080
    Aspect ratio: 1:1
    Max size:     30MB
    File types:   JPG, PNG

  Video
    Dimensions:   1080×1080 or 1080×1920
    Aspect ratio: 1:1 or 4:5
    Max size:     4GB
    File types:   MP4, MOV
    Duration:     1s–240s
    Recommended:  15s or less

  Text
    Primary text: 125 chars recommended, max 2200
    Headline:     27 chars recommended, max 255
    Description:  27 chars recommended, max 255

  Requirements
    • Link required for traffic/conversion objectives
    • CTA button optional

  Notes
    → 4:5 aspect ratio recommended for feed to maximize screen space
```

## Why?

- **No internet required.** Specs are bundled. Works on planes.
- **No accounts, no APIs, no keys.** Just install and go.
- **Zero dependencies.** Nothing to break.
- **Fuzzy matching.** Type `fb` instead of `meta`, `tt` instead of `tiktok`. Typo? It'll suggest the right command.
- **JSON output.** Pipe to `jq` or your build scripts with `--json`.
- **9 platforms, 54 placements.** Everything you need for cross-platform campaigns.

## Install

```bash
# npm (global)
npm install -g adspec

# npx (no install)
npx adspec meta feed

# or clone
git clone https://github.com/admachineai/adspec.git
cd adspec && npm link
```

## Usage

```bash
# Show specs for a specific placement
adspec meta feed
adspec tiktok in-feed
adspec google pmax
adspec linkedin video
adspec snap story
adspec pinterest standard
adspec youtube shorts
adspec x promoted-image
adspec amazon sponsored-brands

# List all placements for a platform
adspec meta
adspec google

# List all platforms
adspec list

# Search across everything
adspec search 9:16          # all vertical video placements
adspec search carousel      # all carousel formats
adspec search 1080          # everything at 1080px
adspec search "non-skip"    # non-skippable formats

# JSON output (for scripts)
adspec meta feed --json
adspec list --json
```

## Platforms

| Platform | Slug | Aliases | Placements |
|----------|------|---------|------------|
| Meta (Facebook/Instagram) | `meta` | `facebook`, `fb`, `instagram`, `ig` | 7 |
| TikTok | `tiktok` | `tt` | 6 |
| Google Ads | `google` | `gads`, `google-ads`, `adwords` | 8 |
| LinkedIn | `linkedin` | `li` | 6 |
| Snapchat | `snapchat` | `snap` | 5 |
| Pinterest | `pinterest` | `pin`, `pins` | 5 |
| YouTube | `youtube` | `yt` | 6 |
| X (Twitter) | `x` | `twitter`, `tw` | 6 |
| Amazon Ads | `amazon` | `amz`, `amazon-ads` | 5 |

## Fuzzy Matching

Typo? adspec has your back:

```
$ adspec tiktk
Unknown platform: "tiktk"
Did you mean: tiktok?

$ adspec meta stor
# → matches "stories"
```

## JSON Mode

Pipe specs into your toolchain:

```bash
# Get Meta feed specs as JSON
adspec meta feed --json | jq '.placement.formats.video.dimensions'

# List all platforms as JSON
adspec list --json

# Build a spec sheet
for p in meta tiktok google; do
  adspec $p --json >> specs.json
done
```

## Contributing

### Adding a new platform

1. Create `src/specs/your-platform.json` following the existing schema
2. Include: `name`, `slug`, `aliases`, and `placements` array
3. Each placement needs: `name`, `slug`, `formats`, `text`, `requirements`, `notes`
4. Submit a PR!

### Updating specs

Ad platforms change specs regularly. If you spot outdated info:

1. Update the relevant JSON file in `src/specs/`
2. Include a link to the official platform documentation in your PR
3. We'll merge fast — accuracy matters

### Schema

```json
{
  "name": "Platform Name",
  "slug": "platform",
  "aliases": ["alias1", "alias2"],
  "placements": [
    {
      "name": "Placement Name",
      "slug": "placement-slug",
      "aliases": ["alias"],
      "formats": {
        "image": { "dimensions": "WxH", "aspectRatio": "W:H", "maxSize": "XMB", "types": ["JPG", "PNG"] },
        "video": { "dimensions": "WxH", "aspectRatio": "W:H", "maxSize": "XMB", "types": ["MP4"], "duration": "Xs-Ys" }
      },
      "text": {
        "Field name": { "recommended": 125, "max": 2200 }
      },
      "requirements": ["Required things"],
      "notes": ["Helpful context"]
    }
  ]
}
```

## Philosophy

- **Accuracy > completeness.** Better to have correct specs for common placements than wrong specs for everything.
- **Zero dependencies.** This tool should never break because of a supply chain issue.
- **Offline first.** Specs are bundled. No API calls, no network, no accounts.
- **Community maintained.** Ad specs change constantly. PRs welcome.

## License

MIT © [Ad Machine](https://github.com/admachineai)
