/*
 * Shared bilingual engine for the whole site — a plain classic script (no
 * bundler) so the static pages in public/ and the Vite-bundled main app can
 * both use it via window.I18N.
 *
 * Content model: every translatable string is a { zh, en } pair registered
 * under a key. The DOM is localized declaratively:
 *   <h1 data-i18n="page.title"></h1>          -> textContent
 *   <p  data-i18n-html="intro"></p>            -> innerHTML (keeps inline tags)
 *   <img data-i18n-attr="alt:img.alt">         -> attribute(s), "attr:key;attr:key"
 * Dynamic strings built in JS use I18N.t('key', { name: '...' }).
 *
 * Adding new content later: append a { zh, en } entry and (for markup) tag the
 * element with data-i18n. See TRANSLATION-GUIDE.md for the wording standard.
 */
(function () {
  const STORAGE_KEY = 'cosmic-lang'
  const SUPPORTED = ['zh', 'en']

  const stored = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })()
  let lang = SUPPORTED.includes(stored) ? stored : 'zh'

  const dict = Object.create(null)
  const listeners = []

  function t(key, params) {
    const entry = dict[key]
    let value = entry ? entry[lang] ?? entry.zh ?? key : key
    if (params) {
      for (const name in params) {
        value = value.split('{' + name + '}').join(String(params[name]))
      }
    }
    return value
  }

  function register(entries) {
    for (const key in entries) dict[key] = entries[key]
  }

  function getLang() {
    return lang
  }

  function apply(root) {
    const scope = root || document
    for (const el of scope.querySelectorAll('[data-i18n]')) {
      el.textContent = t(el.getAttribute('data-i18n'))
    }
    for (const el of scope.querySelectorAll('[data-i18n-html]')) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'))
    }
    for (const el of scope.querySelectorAll('[data-i18n-attr]')) {
      for (const pair of el.getAttribute('data-i18n-attr').split(';')) {
        const [attr, key] = pair.split(':').map((part) => part.trim())
        if (attr && key) el.setAttribute(attr, t(key))
      }
    }
  }

  function syncToggles() {
    for (const btn of document.querySelectorAll('[data-lang-toggle]')) {
      // Show the language you would switch TO.
      btn.textContent = lang === 'zh' ? 'EN' : '中文'
      btn.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文')
    }
  }

  function setLang(next) {
    if (!SUPPORTED.includes(next) || next === lang) return
    lang = next
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Private-mode storage failures shouldn't break the toggle.
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    apply()
    syncToggles()
    for (const fn of listeners) {
      try {
        fn(lang)
      } catch {
        // A misbehaving listener must not stop the others.
      }
    }
  }

  function toggle() {
    setLang(lang === 'zh' ? 'en' : 'zh')
  }

  function onChange(fn) {
    listeners.push(fn)
  }

  function mountToggles() {
    for (const btn of document.querySelectorAll('[data-lang-toggle]')) {
      if (btn.dataset.langBound) continue
      btn.dataset.langBound = '1'
      btn.addEventListener('click', toggle)
    }
    syncToggles()
  }

  // Site-wide creator credit. Injected once on every page that loads this
  // shared engine (the static pages and the bundled app all do), so the line
  // stays identical everywhere and can't drift, and any future page gets it for
  // free. It carries data-i18n so apply() re-localizes it on language toggle.
  function mountCredit() {
    if (document.querySelector('.site-credit')) return
    register({
      'credit.madeby': {
        zh: '由 AmbrosiaZ 与 Claude Code 共同打造 · 2026',
        en: 'Made by AmbrosiaZ & Claude Code · 2026',
      },
    })
    const el = document.createElement('div')
    el.className = 'site-credit'
    el.setAttribute('data-i18n', 'credit.madeby')
    el.style.cssText =
      'text-align:center;padding:26px 16px 32px;font-size:12px;letter-spacing:.04em;opacity:.5'
    document.body.appendChild(el)
  }

  window.I18N = { t, register, getLang, setLang, toggle, onChange, apply, mountToggles }

  // Static pages register their dict in an inline <script> during parse, so by
  // DOMContentLoaded everything is ready to localize. The bundled app calls
  // apply() itself after building its DOM.
  function boot() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    mountToggles()
    mountCredit()
    apply()
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
