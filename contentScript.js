let cachedColors = {};
let cachedLang = null;
let timeoutId = null;

// 1. Pobierz dane raz na starcie
chrome.storage.sync.get(null, (colors) => {
  cachedColors = colors;
  fullRefresh();
});

// 2. Nasłuchuj zmian w popupie (nie trzeba wtedy odświeżać całej strony)
chrome.storage.onChanged.addListener((changes) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    cachedColors[key] = newValue;
  }
  fullRefresh();
});

function fullRefresh() {
  cachedLang = detectLang();
  const css = buildStatusCss(cachedColors, cachedLang);
  applyCss(css);
}

// 3. Debouncing dla MutationObserver
function debouncedRefresh() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    // Sprawdzamy czy język się nie zmienił lub czy nie doszły nowe elementy
    fullRefresh();
  }, 300); // 300ms spokoju zanim zadziała
}

// Reszta Twoich funkcji (detectLang, buildStatusCss, applyCss) zostaje bez zmian, 
// ale wywołuj je przez debouncedRefresh

const mo = new MutationObserver((mutations) => {
  // Optymalizacja: reaguj tylko jeśli dodano nowe węzły DOM
  const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
  if (hasNewNodes) {
    debouncedRefresh();
  }
});

mo.observe(document.documentElement, { childList: true, subtree: true });S