function applyUserColors() {
  chrome.storage.sync.get(null, (settings) => {
    const styleId = 'sf-theme-overrides';
    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    let cssContent = ":root {";
    for (const [key, value] of Object.entries(settings)) {
      // Jeśli kolor jest z HEX, dodajemy mu lekkie przezroczystości dla statusów (opcjonalnie)
      cssContent += `--${key}: ${value} !important;`;
    }
    cssContent += "}";
    
    styleTag.innerHTML = cssContent;
  });
}

// Uruchomienie przy starcie strony
applyUserColors();