(function (global) {
  'use strict'

  const speed = Number(global.COSMIC_ROTATION_DEG_PER_SEC)
  const resumeDelay = Number(global.COSMIC_ROTATION_RESUME_DELAY_MS)

  global.COSMIC_ROTATION_DEG_PER_SEC = Number.isFinite(speed) && speed > 0 ? speed : 2
  global.COSMIC_ROTATION_RESUME_DELAY_MS = Number.isFinite(resumeDelay) && resumeDelay >= 0 ? resumeDelay : 3000
})(window)
