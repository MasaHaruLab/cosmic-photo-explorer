# Runtime Modes

Cosmic Photo Explorer has two top-level runtime modes.

## 1. Real mode

Definition:
- views derived from real observational data and conservative rendering logic

Requirements:
- explicit provenance
- no hidden speculative fill
- explanation layer can mention uncertainty and boundary

Phase 1 usage:
- Milky Way overview scene
- anchor exploration
- cinematic zoom to selected targets

## 2. Speculative mode

Definition:
- views that go beyond direct observational support

Requirements:
- explicit labeling
- same photoreal visual language
- separate manifests or clearly separate entries
- interpretation layer must state what is inferred or imagined

Phase 1 usage:
- not required for first runnable shell
- schema support should exist now so the architecture does not collapse later

## 3. Why split now

If the split is postponed, the frontend will accidentally encode fake imagery as if it were equally real.
The product must be allowed to be imaginative, but never ambiguous about where imagination starts.

## 4. UI implications

The runtime should always be able to answer:
- what am I looking at?
- how do we know this?
- where does direct observation stop?

## 5. Engineering implications

- scene manifests must include `mode`
- anchors must include `mode`
- zoom presets must include `mode`
- interpretation content must support boundary notes
