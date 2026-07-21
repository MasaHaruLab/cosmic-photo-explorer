// Shared demo-mode bootstrap for the sub-pages (?demo=1).
//
// Three URL flags:
//   demo=1   turn demo mode on
//   auto=1   skip the ▶ button and start immediately on load (set automatically when a
//            page is reached by the chain — the opening gesture already happened)
//   chain=1  after this scene finishes, hand off to the next page so the whole 7-scene
//            walkthrough plays as ONE continuous take from a single ▶ click
//
// Flow the visitor sees: open the homepage ?demo=1&chain=1 URL → (put Chrome in native
// full screen, ⌃⌘F, so it stays full screen across page jumps) → start the screen
// recording → click ▶ once → every page drives itself and auto-advances to the next.
// Nothing fires until that click, so the recording starts perfectly clean — no
// automation cursor, no "Claude 操控" banner (the page drives itself), no dead time.
//
// A page opened with just ?demo=1 (no chain) plays only its own scene and stops — handy
// for re-recording a single scene.
//
// The homepage keeps its own equivalent logic inside main.js (bundled module). Each
// sub-page passes a runSequence() closure that can reach its own internals (probes,
// OrbitControls, switchTo, I18N…) plus opts { next, durationMs } for the hand-off.
window.setupCosmicDemo = function (runSequence, opts) {
  opts = opts || {}
  const params = new URLSearchParams(location.search)
  if (params.get('demo') !== '1') return
  const chain = params.get('chain') === '1'
  const auto = params.get('auto') === '1'

  const hideCursor = document.createElement('style')
  hideCursor.textContent = '*{cursor:none !important}'

  const start = () => {
    document.head.appendChild(hideCursor)
    try { runSequence() } catch (e) { console.error('[demo]', e) }
    if (chain && opts.next) {
      setTimeout(() => {
        location.href = opts.next + '?demo=1&auto=1&chain=1'
      }, opts.durationMs || 20000)
    }
  }

  if (auto) {
    // Reached by the chain — native full screen persists, so no gesture is needed.
    start()
    return
  }

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.textContent = '▶ 开始演示'
  btn.style.cssText =
    'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483647;' +
    'padding:22px 48px;font-size:24px;font-weight:600;color:#fff;background:#0a84ff;border:0;' +
    'border-radius:16px;cursor:pointer;box-shadow:0 8px 40px rgba(10,132,255,0.5);'
  btn.addEventListener('click', () => {
    // Only grab element-fullscreen for a standalone single-scene recording; in chain
    // mode we rely on native full screen (element-fullscreen would drop on the first
    // page jump and leave later scenes windowed).
    if (!chain && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {})
    }
    btn.remove()
    start()
  })
  document.body.appendChild(btn)
}
