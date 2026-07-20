# liro.prompt Prompt Archive Status

Status checked: 2026-06-13

## Direct Answer

The archive keeps a clear distinction between original source prompts and reconstructed working prompts. Locked records are represented by usable reconstructions rather than claims that the original gated text was recovered.

What this project has instead is a complete working archive:

- Total records found: 253
- Original prompts fetched from the source session: 89
- Paid-only prompts reconstructed as usable replacements: 164
- Folders with `working-prompt.md`: 253

## Ready Files

Every prompt folder under `liro-prompts/` has:

- `prompt.md`: original extraction record; paid-only files include a marked reconstructed section.
- `working-prompt.md`: the prompt to paste into an AI website builder.
- `metadata.json`: source metadata, endpoint result, and working prompt mode.

Use `liro-prompts/INDEX.md` as the table of contents.

## Source Policy

For original prompts, `working-prompt.md` contains the prompt returned by the source session.

For locked prompts, `working-prompt.md` is not the original gated text. It is a practical replacement built from public metadata, preview media URLs, title, category, page type, and visible design language. This keeps the archive usable without bypassing authentication or paywall controls.

## Public Research Notes

Public references checked for validation:

- Public catalog and design-library patterns were used to validate the archive structure.
- 21st.dev exposes public React component patterns and animated hero/component categories useful for validating interaction patterns.
- Replo publishes prompt-library guidance for high-converting landing pages.
- Current AI website-builder guidance recommends detailed prompts with clear purpose, audience, structure, visual style, and interaction requirements instead of vague one-shot prompts.

The reconstruction script follows that shape: each locked prompt includes product context, visual system, layout structure, copy, animation behavior, responsiveness, and quality constraints.

## Verification

Run this from the project root:

```bash
node -e "const d=require('./liro-prompts/raw-results.json'); const items=d.items||d; const m=items.reduce((a,x)=>(a[x.status]=(a[x.status]||0)+1,a),{}); const wp=require('node:child_process').execSync('find liro-prompts -name working-prompt.md | wc -l').toString().trim(); console.log(JSON.stringify({total:items.length,status:m,workingPromptFiles:Number(wp)},null,2))"
```

Expected result:

```json
{
  "total": 253,
  "status": {
    "paid_only": 164,
    "fetched": 89
  },
  "workingPromptFiles": 253
}
```
