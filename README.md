# docusaurus-plugin-z535

A Docusaurus 3 plugin that renders ANSI Z535-style safety messages
(**DANGER**, **WARNING**, **CAUTION**, **NOTICE**) in docs, blog posts,
and MDX pages.

It follows the signal-word-panel conventions shared by **ANSI Z535.4**
(product safety signs and labels) and **ANSI Z535.6** (safety information
in manuals and other collateral). Both standards use the same colors, the
same panel structure, and the same rule that NOTICE never carries the
safety alert symbol, because NOTICE is not a personal-injury signal word.

```mdx
import SafetyAlert, {Hazard, Consequence, Avoidance} from '@theme/Z535SafetyAlert';

<SafetyAlert type="danger">
  <Hazard>Exposed high-voltage conductors.</Hazard>
  <Consequence>Contact will result in death or serious injury.</Consequence>
  <Avoidance>De-energize and lock out the circuit before servicing.</Avoidance>
</SafetyAlert>
```

renders as a red signal word panel with the safety alert symbol and the
word DANGER, above a white message panel with the three labeled parts.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [How it maps to Z535](#how-it-maps-to-z535)
- [Behavior details](#behavior-details)
- [Customizing](#customizing)
- [Limitations and out-of-scope items](#limitations-and-out-of-scope-items)
- [Project layout](#project-layout)

## Installation

Short version: copy this folder into your site at
`plugins/docusaurus-plugin-z535/`, then add it to `docusaurus.config.js`:

```js
plugins: ['./plugins/docusaurus-plugin-z535'],
```

**See [INSTALL.md](./INSTALL.md)** for full instructions. It covers
installing as an npm package (from a folder, tarball, or git), verifying
the install, global MDX registration, upgrading, uninstalling, and
troubleshooting.

## Usage

Import the component in any `.mdx` file:

```mdx
import SafetyAlert, {
  Hazard,
  Consequence,
  Avoidance,
} from '@theme/Z535SafetyAlert';

<SafetyAlert type="danger">
  <Hazard>Exposed high-voltage conductors.</Hazard>
  <Consequence>Contact will result in death or serious injury.</Consequence>
  <Avoidance>De-energize and lock out the circuit before servicing.</Avoidance>
</SafetyAlert>

<SafetyAlert type="warning">
  Lifting this unit without a second person may cause back injury.
</SafetyAlert>

<SafetyAlert type="caution" title="CAUTION — HOT SURFACE">
  Surface remains hot for 30 minutes after shutdown.
</SafetyAlert>

<SafetyAlert type="notice">
  Using non-OEM filters voids the equipment warranty.
</SafetyAlert>
```

`@theme/Z535SafetyAlert` resolves through Docusaurus's theme alias
system, the same mechanism `@theme/Admonition` uses. You don't need a
manual import path or a swizzle.

The message panel accepts any Markdown or MDX: multiple paragraphs,
lists, links, inline code, even headings. Leave a blank line after the
opening tag and before the closing tag when you want Markdown blocks
parsed:

```mdx
<SafetyAlert type="warning">

**Pinch point.** Keep hands clear of the hinge while closing the lid.

- Close the lid using the handle only.
- Never reach into the hinge area.

</SafetyAlert>
```

To use the components **without importing them on every page**, register
them in `src/theme/MDXComponents.js`. See
[INSTALL.md → Optional: use the components without importing them](./INSTALL.md#optional-use-the-components-without-importing-them).
This is a standard Docusaurus extension point and is more stable than the
admonition `customTypes` config, whose option names have shifted across
3.x releases.

### Choosing a signal word

The signal word comes from the hazard. Don't pick it for how it looks.
These are the standard's definitions in summary:

| `type` | Use when… |
|---|---|
| `danger` | A hazardous situation that, if not avoided, **will** result in death or serious injury. Use for the most extreme situations only. |
| `warning` | A hazardous situation that, if not avoided, **could** result in death or serious injury. |
| `caution` | A hazardous situation that, if not avoided, **could** result in minor or moderate injury. |
| `notice` | Information considered important but **not hazard-related**, such as property damage, equipment damage, or data loss. |

## API

### `<SafetyAlert>` (default export)

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `type` | `'danger' \| 'warning' \| 'caution' \| 'notice'` | yes | (none) | Selects the signal word, panel colors, and symbol rule. Case-insensitive (`"DANGER"` works). Any other value throws and fails the build. |
| `title` | `string` | no | the signal word | Replaces the displayed signal word text, e.g. `"DANGER — HIGH VOLTAGE"`. Keep the real signal word first: the standard is built around it, and an override that drops it is non-conforming. The accessible name always uses the real signal word, whatever `title` says. |
| `icon` | `boolean` | no | `true` | Set `false` to hide the safety alert symbol. For `notice` the symbol is **always** hidden, regardless of this prop. |
| `className` | `string` | no | (none) | Extra class name added to the outer `<aside>`. |
| `children` | MDX / React nodes | yes | (none) | The message panel content. |

### `<Hazard>`, `<Consequence>`, `<Avoidance>` (named exports)

Optional wrappers for the three-part message structure Z535.6 recommends:
the nature of the hazard, the consequence of not avoiding it, and how to
avoid it. Each renders a block with a bold lead-in label:

| Component | Default label |
|---|---|
| `Hazard` | `Hazard:` |
| `Consequence` | `Consequence:` |
| `Avoidance` | `To avoid:` |

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string \| false` | see above | Replaces the lead-in label, for example for translation (`label="Gefahr:"`) or house style (`label="Avoid by:"`). Pass `label={false}` to omit it. |
| `children` | MDX / React nodes | (none) | Inline text or Markdown, single- or multi-line. |

These wrappers are optional. Plain children inside `<SafetyAlert>` work
fine.

## How it maps to Z535

| Element | What the plugin does |
|---|---|
| Panel structure | A signal word panel on top, then a message panel. A black border surrounds both. |
| DANGER | White letters on safety red. |
| WARNING | Black letters on safety orange. |
| CAUTION | Black letters on safety yellow. |
| NOTICE | White *italic* letters on safety blue. **No** safety alert symbol. |
| Safety alert symbol | A solid triangle with an exclamation mark, placed before the signal word. The triangle uses the signal word's color (white on DANGER, black on WARNING and CAUTION). The exclamation mark uses the panel color, so it reads as a cut-out. The symbol is sized to be at least as tall as the signal word letters. |
| Signal word typography | Bold, uppercase, sans-serif (your site's base font). |
| Message panel | Black text on white, in both light and dark site themes. |
| Message content | Optional Hazard / Consequence / Avoidance structure (see above). |

### What's accurate here, and what's an approximation

- The signal words, the panel order (signal word panel, then message
  panel), the "no symbol on NOTICE" rule, and the italic NOTICE word
  follow the written standard.
- **The colors are sRGB approximations** of the Pantone spot colors in
  ANSI Z535.1:

  | Color | Pantone | Hex used | Used for |
  |---|---|---|---|
  | Safety Red | PMS 186 C | `#C8102E` | DANGER |
  | Safety Orange | PMS 151 C | `#FF6900` | WARNING |
  | Safety Yellow | PMS 116 C | `#FFC72C` | CAUTION |
  | Safety Blue | PMS 285 C | `#0057B8` | NOTICE |

  Pantone doesn't convert losslessly to screen RGB. If you need
  print-accurate color (for a PDF export pipeline, for example), get the
  actual PMS values from the standard and have your print vendor match
  them. Don't treat these hex codes as certified.
- **This plugin does not make your documentation compliant.** It provides
  correctly structured, correctly colored panels. Whether a given hazard
  is DANGER or WARNING, and whether the message text is adequate, are
  judgments for whoever owns your product safety documentation. Buy the
  standards from ANSI/NEMA and use them as the reference.

## Behavior details

- **Dark mode:** the panel colors are hard-coded rather than theme CSS
  variables, and they don't change under `[data-theme='dark']`. That's
  intentional: a safety color is a fixed signal, not part of the site's
  color scheme. The message panel stays black-on-white too. The plugin
  pins the Infima variables for headings, body text, links, code
  backgrounds, and table borders inside the message panel, so nested
  Markdown stays readable when the site is in dark mode.
- **Print / PDF:** alerts set `print-color-adjust: exact`, so browsers
  keep the panel colors when printing, and `break-inside: avoid`, so an
  alert isn't split across pages.
- **Accessibility:** each alert is an `<aside role="note">` with an
  accessible name such as "WARNING safety message". The safety alert
  symbol is decorative (`aria-hidden`) because the signal word carries
  the meaning. The Hazard / Consequence / Avoidance labels are real text,
  not CSS-generated content, so screen readers announce them reliably.
  The signal word panels meet WCAG AA contrast (black on orange and
  yellow, white on red and blue).
- **Invalid `type`:** throws `SafetyAlert: unknown type "…"`. That fails
  `docusaurus build`, which is deliberate: a typo in a signal word is a
  safety-content bug and shouldn't ship silently. In `docusaurus start`
  it shows up as an error on that page.
- **Valid HTML for multi-line MDX:** the part wrappers render as `<div>`,
  not `<p>`. MDX wraps multi-line children in `<p>`, and nesting a `<p>`
  inside a `<p>` would cause React hydration errors.

## Customizing

### Stable class names

Besides the hashed CSS-module classes, every alert carries stable global
classes that you can target from your site's `src/css/custom.css`:

| Class | Element |
|---|---|
| `z535-alert` | the outer `<aside>` |
| `z535-alert--danger`, `--warning`, `--caution`, `--notice` | the outer `<aside>`, by type |
| `z535-alert__signal` | the signal word panel |
| `z535-alert__message` | the message panel |
| `z535-hazard`, `z535-consequence`, `z535-avoidance` | the part wrappers |

For example, to tighten the spacing:

```css
.z535-alert { margin: 1rem 0; }
.z535-alert__message { padding: 0.5rem 0.75rem; }
```

Avoid restyling the signal word panel colors. They're the part the
standard fixes.

### Swizzling

`Z535SafetyAlert` is a normal theme component, so you can swizzle it.
The plugin doesn't declare a "safe" swizzle list, so Docusaurus requires
`--danger`:

```bash
# copy the component into src/theme/Z535SafetyAlert/ to edit freely
npx docusaurus swizzle docusaurus-plugin-z535 Z535SafetyAlert --eject --danger

# or wrap it
npx docusaurus swizzle docusaurus-plugin-z535 Z535SafetyAlert --wrap --danger
```

When you **wrap**, add `export * from '@theme-original/Z535SafetyAlert';`
to the generated file. Otherwise `Hazard`, `Consequence`, and `Avoidance`
stop resolving. An ejected copy doesn't pick up plugin upgrades.

## Limitations and out-of-scope items

These parts of Z535.4 / Z535.6 are **not** implemented:

- **Symbol / pictogram panels.** Z535 formats can include a separate
  panel with a hazard pictogram (ISO 7010 / Z535.3 style). Put an image
  in the message panel if you need one. There's no dedicated slot or
  side-by-side layout.
- **Safety instruction signs** (green "SAFETY INSTRUCTIONS"-style
  headers) and fire-safety / equipment-location formats.
- **Monochrome formats.** Z535.6 allows single-color (black and white)
  safety messages in manuals. The plugin always renders in color.
- **Grouped / section safety messages** and the other placement and
  layout rules for whole documents. Those are authoring decisions, not
  something a component can enforce.
- **Hazard-severity validation.** Nothing checks that the signal word
  matches the hazard. See [Choosing a signal word](#choosing-a-signal-word).
- **Markdown admonition syntax** (`:::danger`). The alerts are MDX
  components only, so they don't override Docusaurus's built-in
  admonitions.
- **TypeScript types.** None are shipped yet. MDX usage is unaffected. If
  you import the component from a `.tsx` file and type-check your site,
  add a `declare module '@theme/Z535SafetyAlert'` declaration.

## Project layout

```
docusaurus-plugin-z535/
├── package.json                      # name, entry point, peer deps
├── README.md                         # this file
├── INSTALL.md                        # installation and troubleshooting
└── src/
    ├── index.js                      # the plugin: exposes ./theme via getThemePath()
    └── theme/
        └── Z535SafetyAlert/
            ├── index.js              # SafetyAlert + Hazard/Consequence/Avoidance
            └── styles.module.css     # panel layout, Z535 colors, print/dark-mode rules
```

`src/index.js` uses `getThemePath()`, the same mechanism
`@docusaurus/theme-classic` uses to publish `@theme/Admonition`. Every
component in `src/theme/` becomes importable as `@theme/<Name>` and stays
swizzle-overridable by consuming sites.

The plugin takes no options. You register it, and the component becomes
available.

Tested with Docusaurus 3.10.2 (`classic` preset): in an ESM config and
with `require.resolve`, installed both as a copied local folder and as
an npm tarball, and with eject and wrap swizzles.
