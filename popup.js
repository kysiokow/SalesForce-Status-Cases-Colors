const fields = [
  "oczekiwanie",
  "odpowiedzOtrzymana",
  "otwartaPonownie",
  "wTrakcie",
  "zgloszenie",
  "zakonczona",
  "mailReplyAll",
  "mailReply",
  "mailDelete",
  "mailForward",
  "mailWrite"
];

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(fields, (data) => {
    fields.forEach((k) => {
      const el = document.getElementById(k);
      if (el) el.value = data[k] || '#cccccc';
    });
  });

  document.getElementById('save').addEventListener('click', () => {
    const toSave = {};
    fields.forEach((k) => {
      const el = document.getElementById(k);
      if (el) toSave[k] = el.value;
    });
    chrome.storage.sync.set(toSave, () => {
      // prosto i bez dodatkowych uprawnień
      alert('Zapisano kolory!');
    });
  });
});
