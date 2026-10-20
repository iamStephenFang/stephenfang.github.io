# Reading font subsets

Chinese reading text uses self-hosted, CJK-only subsets of Adobe Source Han Serif
2.003. English keeps its system serif. The complete upstream font is not committed.

Coverage includes the site's actual CJK characters **plus all 3,755 GB2312 level-1
common Chinese characters**. The baseline is kept in `common-characters.txt` in
GB2312 order (byte pairs B0A1–D7F9), generated with Python's `gb2312` codec; it is
not extracted from current posts. This gives new articles some headroom without
shipping the full CJK font. The coverage check verifies both sources, and the
generator always retains the baseline even when articles stop using a character.

The generator pins the upstream commit and SHA-256. It preserves weights 400–700
in variable WOFF2, groups at most 256 characters per file, and generates exact
`unicode-range` declarations. Browsers request only the chunks used on the page.
`font-display: swap` keeps text readable while fonts load; there is no blanket
preload of all chunks or dependency on a third-party font service at runtime.

Generated files are committed so normal builds need neither Python nor a font
download. `npm run fonts:check` runs before production builds and reports newly
introduced CJK characters requiring a refresh. It scans article and UI sources.

To refresh after adding characters:

```sh
python3 -m venv /tmp/blog-font-tools
/tmp/blog-font-tools/bin/pip install -r scripts/fonts/requirements.txt
/tmp/blog-font-tools/bin/python scripts/fonts/generate.py
npm run fonts:check
```

An existing upstream TTF can be supplied with `--source /path/to/font.ttf`.
Existing chunk membership is preserved to avoid invalidating unrelated files.
Review the generated CSS, manifest and font files together.

The modified subsets use the internal name “Blog CJK Serif” to respect the OFL
reserved name. Attribution and the upstream license are in
`public/fonts/reading/LICENSE.txt`.

References: [Adobe Source Han Serif](https://github.com/adobe-fonts/source-han-serif),
[web.dev font best practices](https://web.dev/articles/font-best-practices).
