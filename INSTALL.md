# Installing docusaurus-plugin-z535

## Requirements

| | Version | Notes |
|---|---|---|
| Docusaurus | 3.x | Tested on 3.10.2 with the `classic` preset. |
| Node.js | ≥ 18 | Whatever your Docusaurus version requires. |
| React | 18 or 19 | Already present in every Docusaurus 3 site. |

The plugin has **no runtime dependencies** of its own: it only imports
`react`, which every Docusaurus site already has.

There are two ways to install it. Pick one.

---

## Option A: Copy into your site as a local plugin (simplest)

1. Copy this whole `docusaurus-plugin-z535/` folder into your site, for
   example to `<site-root>/plugins/docusaurus-plugin-z535/`:

   ```
   my-site/
   ├── docusaurus.config.js
   ├── plugins/
   │   └── docusaurus-plugin-z535/
   │       ├── package.json
   │       └── src/
   │           ├── index.js
   │           └── theme/Z535SafetyAlert/…
   └── docs/
   ```

2. Register it in `docusaurus.config.js` with a path relative to the
   site root. This works in both ESM (`export default config`, the
   default for new 3.x sites) and CommonJS (`module.exports = …`) configs:

   ```js
   const config = {
     // ...
     plugins: ['./plugins/docusaurus-plugin-z535'],
     // ...
   };
   ```

   `require.resolve('./plugins/docusaurus-plugin-z535')` also works, if
   that's the style your config already uses.

3. Go to [Verify the install](#verify-the-install).

---

## Option B: Install as an npm package

`package.json` is included, so you can install the plugin like any other
package, from a local folder, a tarball, or a git repository:

```bash
# from a folder on disk (npm creates a symlink)
npm install /path/to/docusaurus-plugin-z535

# or from a packed tarball
cd /path/to/docusaurus-plugin-z535 && npm pack     # -> docusaurus-plugin-z535-0.1.0.tgz
cd /path/to/my-site && npm install /path/to/docusaurus-plugin-z535-0.1.0.tgz

# or from git
npm install git+https://<your-host>/<you>/docusaurus-plugin-z535.git
```

(`yarn add` and `pnpm add` take the same kinds of specifiers.)

Then register it by package name, in either config format:

```js
plugins: ['docusaurus-plugin-z535'],
```

> **Keep "docusaurus" in the package name.** The theme component ships as
> untranspiled JSX. Docusaurus only runs Babel on files inside
> `node_modules` when the path contains `docusaurus`, so renaming the
> package to something like `z535-alerts` causes a JSX syntax error at
> build time.

---

## Verify the install

1. Create `docs/z535-test.mdx`:

   ```mdx
   import SafetyAlert from '@theme/Z535SafetyAlert';

   <SafetyAlert type="danger">If you can read this in a red panel, it works.</SafetyAlert>
   ```

2. Run `npm start` (restart it if it was already running, because new
   plugins are only picked up at startup) and open `/docs/z535-test`.

3. Run `npm run build` once too. The static build renders every page
   server-side and is where an invalid `type` gets caught (see
   [Troubleshooting](#troubleshooting)).

Delete the test page when you're done.

---

## Optional: use the components without importing them

To use `<SafetyAlert>` in any MDX file without an `import` line,
register it globally. Create (or extend) `src/theme/MDXComponents.js` in
your site:

```js
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

If your site already has a `src/theme/MDXComponents.js`, add these
entries to the existing object.

---

## Upgrading

- **Option A:** replace the `plugins/docusaurus-plugin-z535/` folder with
  the new version, then restart the dev server.
- **Option B:** re-run the `npm install …` command with the new folder,
  tarball, or git ref.

If you swizzled (ejected) `Z535SafetyAlert`, your copy in
`src/theme/Z535SafetyAlert/` is **not** updated. Diff it against the new
`src/theme/Z535SafetyAlert/` by hand.

## Uninstalling

1. Remove the entry from `plugins` in `docusaurus.config.js`.
2. Delete the `plugins/docusaurus-plugin-z535/` folder (Option A) or run
   `npm uninstall docusaurus-plugin-z535` (Option B).
3. Remove any `import … from '@theme/Z535SafetyAlert'` lines and
   `<SafetyAlert>` usages from your MDX, plus the entries in
   `src/theme/MDXComponents.js` if you added them. Otherwise the build
   fails with "Module not found".

---

## Troubleshooting

**`Module not found: Can't resolve '@theme/Z535SafetyAlert'`**
The plugin isn't registered, or the dev server was started before you
registered it. Check the `plugins` entry and its path, then restart
`npm start`.

**Build fails with `Docusaurus static site generation failed`, and the
cause is `SafetyAlert: unknown type "…"`**
`type` must be `danger`, `warning`, `caution`, or `notice` (any case).
The error is deliberate: a mistyped signal word fails the build instead
of shipping a page with a missing or wrongly colored safety message.

**`SyntaxError: Unexpected token '<'` / "Support for the experimental
syntax 'jsx' isn't currently enabled"**
The package was installed into `node_modules` under a name without
"docusaurus" in it, so Docusaurus didn't transpile it. Keep the package
name `docusaurus-plugin-z535`, or use Option A.

**`ESModulesLinkingWarning: export 'Hazard' (imported as 'Hazard') was
not found in '@theme/Z535SafetyAlert'`** (after swizzling with `--wrap`)
The generated wrapper only re-exports the default export, so `Hazard`,
`Consequence`, and `Avoidance` come through as `undefined` and the page
fails to render. Add this line
to your `src/theme/Z535SafetyAlert/index.js`:

```js
export * from '@theme-original/Z535SafetyAlert';
```

**Panels print without their colors.**
The plugin sets `print-color-adjust: exact`, which modern browsers honor.
If your PDF pipeline still strips backgrounds, enable "Background
graphics" in the print dialog or the equivalent option in your PDF tool,
such as `printBackground: true` in Puppeteer.
