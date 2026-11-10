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

## Installation

1. Clone this repository.

```bash
git clone https://github.com/bocere/docusaurus-plugin-z535
```

1. Copy the folder to your site.

```bash
cp docusaurus-plugin-z535 /<path-to-site>/plugins
```

1. Add it to `docusaurus.config.js`:

```js
const config: Config = {
  ...
  plugins: ['./plugins/docusaurus-plugin-z535'],
  ...
};
```

1. Create or add the following to the `src/theme/MDXComponents.js` file.

```mdx
import MDXComponents from '@theme-original/MDXComponents';
import SafetyAlert, {
  Hazard,
  Consequence,
  Avoidance,
} from '@theme/Z535SafetyAlert';

export default {
  ...MDXComponents,
  SafetyAlert,
  Hazard,
  Consequence,
  Avoidance,
};
```

1. Restart the site.

## Usage

```mdx
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

Choose the type from the hazard. Don't pick it for how it looks.

| `type` | Use when… |
|---|---|
| `danger` | A hazardous situation that, if not avoided, **will** result in death or serious injury. Use for the most extreme situations only. |
| `warning` | A hazardous situation that, if not avoided, **could** result in death or serious injury. |
| `caution` | A hazardous situation that, if not avoided, **could** result in minor or moderate injury. |
| `notice` | Information considered important but **not hazard-related**, such as property damage, equipment damage, or data loss. |

