const defaultColors = {
  "hdr-bg": "#b4f58c",
  "row-bg": "#ebf5cd",
  "st-wait": "#0258f9",
  "st-recv": "#c0890a",
  "st-reop": "#e5fa05",
  "st-prog": "#05fa77",
  "st-acpt": "#e105fa",
  "st-done": "#434345",
  "enable-clock": true // Domyślnie zegar jest włączony
};

// Pomocnicza funkcja do wczytywania danych do pól w popupie
function updateInputs(data) {
  // Wczytywanie kolorów
  Object.keys(defaultColors).forEach(key => {
    const el = document.getElementById(key);
    if(el && data[key]) {
      el.value = data[key];
    }
  });
  
  // Wczytywanie stanu "ptaszka" dla zegara
  const clockCb = document.getElementById('enable-clock');
  if(clockCb) {
    // Jeśli w pamięci nie ma jeszcze tego klucza, używamy true (domyślny)
    clockCb.checked = data["enable-clock"] !== false;
  }
}

// 1. Ładowanie ustawień przy otwarciu popupu
chrome.storage.sync.get(defaultColors, (data) => {
  updateInputs(data);
});

// 2. Zapisywanie ustawień po kliknięciu przycisku
document.getElementById('save').addEventListener('click', () => {
  let settings = {};
  
  // Zbieramy kolory z inputów
  Object.keys(defaultColors).forEach(key => {
    const el = document.getElementById(key);
    if(el && el.type === 'color') {
      settings[key] = el.value;
    }
  });

  // Zbieramy stan checkboxa zegara
  const clockCb = document.getElementById('enable-clock');
  if(clockCb) {
    settings["enable-clock"] = clockCb.checked;
  }

  // Zapis do pamięci Chrome
  chrome.storage.sync.set(settings, () => {
    const statusMsg = document.getElementById('status-msg');
    if (statusMsg) {
      statusMsg.innerText = "Zapisano! Przeładuj stronę Salesforce.";
      statusMsg.className = 'msg-success';
      setTimeout(() => { statusMsg.innerText = ''; }, 3000);
    }
  });
});

// 3. Reset do ustawień domyślnych
document.getElementById('reset').addEventListener('click', () => {
  if(confirm("Czy na pewno przywrócić domyślne ustawienia?")) {
    chrome.storage.sync.set(defaultColors, () => {
      updateInputs(defaultColors);
    });
  }
});

// 4. EKSPORT (JSON)
document.getElementById('exportBtn').addEventListener('click', () => {
  chrome.storage.sync.get(null, (data) => {
    const jsonStr = JSON.stringify(data);
    document.getElementById('io-config').value = jsonStr;
    document.getElementById('io-config').select();
    navigator.clipboard.writeText(jsonStr);
    alert("Kod skopiowany do schowka!");
  });
});

// 5. IMPORT (JSON)
document.getElementById('importBtn').addEventListener('click', () => {
  const jsonInput = document.getElementById('io-config').value;
  try {
    const parsed = JSON.parse(jsonInput);
    chrome.storage.sync.set(parsed, () => {
      updateInputs(parsed);
      alert("Zaimportowano! Kliknij Zapisz i Zastosuj.");
    });
  } catch (e) {
    alert("Błąd: Nieprawidłowy format kodu!");
  }
});