# MotionSites Prompt Archive Status

Status checked: 2026-06-13

## Direct Answer

There is no legitimate no-login route to retrieve the original MotionSites `paid_only` prompt text. The live site routes locked cards to pricing, and the public `get-prompt` endpoint returns `paid_only` for those records.

What this project has instead is a complete working archive:

- Total MotionSites records found: 253
- Original prompts fetched from MotionSites: 89
- Paid-only prompts reconstructed as usable replacements: 164
- Folders with `working-prompt.md`: 253

## Ready Files

Every prompt folder under `motionsites-prompts/` has:

- `prompt.md`: original extraction record; paid-only files include a marked reconstructed section.
- `working-prompt.md`: the prompt to paste into an AI website builder.
- `metadata.json`: source metadata, endpoint result, and working prompt mode.

Use `motionsites-prompts/INDEX.md` as the table of contents.

## Source Policy

For free prompts, `working-prompt.md` contains the original prompt returned by the MotionSites endpoint.

For paid-only prompts, `working-prompt.md` is not the original locked text. It is a practical replacement built from public MotionSites metadata, public preview media URLs, title, category, page type, and visible design language. This keeps the archive usable without bypassing authentication or paywall controls.

## Public Research Notes

Public references checked for validation:

- MotionSites publicly describes itself as a premium AI hero prompt and design library.
- 21st.dev exposes public React component patterns and animated hero/component categories useful for validating interaction patterns.
- Replo publishes prompt-library guidance for high-converting landing pages.
- Current AI website-builder guidance recommends detailed prompts with clear purpose, audience, structure, visual style, and interaction requirements instead of vague one-shot prompts.

The reconstruction script follows that shape: each locked prompt includes product context, visual system, layout structure, copy, animation behavior, responsiveness, and quality constraints.

## Verification

Run this from the project root:

```bash
node -e "const d=require('./motionsites-prompts/raw-results.json'); const items=d.items||d; const m=items.reduce((a,x)=>(a[x.status]=(a[x.status]||0)+1,a),{}); const wp=require('node:child_process').execSync('find motionsites-prompts -name working-prompt.md | wc -l').toString().trim(); console.log(JSON.stringify({total:items.length,status:m,workingPromptFiles:Number(wp)},null,2))"
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
