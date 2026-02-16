// i18n tytułów statusów i akcji mailowych
const i18nTitles = {
  oczekiwanie: { pl: 'Oczekiwanie na odpowiedź', fr: 'En attente de réponse', en: 'Waiting for response' },
  odpowiedzOtrzymana: { pl: 'Odpowiedź otrzymana', fr: 'Réponse reçue', en: 'Response received' },
  otwartaPonownie: { pl: 'Otwarta ponownie', fr: 'Rouverte', en: 'Reopened' },
  wTrakcie: { pl: 'W trakcie realizacji', fr: 'En cours', en: 'In progress' },
  zgloszenie: { pl: 'Zgłoszenie przyjęte', fr: 'Demande acceptée', en: 'Request accepted' },
  zakonczona: { pl: 'Zakończona', fr: 'Terminée', en: 'Closed' }
};

const i18nMail = {
  mailReplyAll:  { pl: 'Odpowiedz wszystkim', fr: 'Répondre à tous', en: 'Reply all' },
  mailReply:     { pl: 'Odpowiedz',           fr: 'Répondre',        en: 'Reply' },
  mailDelete:    { pl: 'Usuń',                fr: 'Supprimer',       en: 'Delete' },
  mailForward:   { pl: 'Przekaż',             fr: 'Transférer',      en: 'Forward' },
  mailWrite:     { pl: 'Napisz wiadomość email...', fr: 'Écrire un e-mail…', en: 'Compose email...' }
};

function getPageLangCandidate() {
  const docLang = (document.documentElement.lang || '').toLowerCase();
  if (/^pl/.test(docLang)) return 'pl';
  if (/^fr/.test(docLang)) return 'fr';
  if (/^en/.test(docLang)) return 'en';
  return null;
}

function existsSelector(sel){
  try{ return document.querySelector(sel) !== null; }catch{ return false; }
}

function languageAppearsInDom(lang){
  const sampleKeys = ['oczekiwanie','odpowiedzOtrzymana','wTrakcie'];
  return sampleKeys.some(k => {
    const t = (i18nTitles[k]||{})[lang];
    return t ? existsSelector(`span[title="${t}"]`) : false;
  });
}

function detectLang(){
  const hint = getPageLangCandidate();
  if (hint && languageAppearsInDom(hint)) return hint;
  for (const l of ['pl','fr','en']){ if (languageAppearsInDom(l)) return l; }
  return 'en';
}

function buildStatusCss(colors, lang){
  let css = '';
  Object.entries(i18nTitles).forEach(([key,map])=>{
    const title = map[lang];
    const userColor = colors[key];
    if (title && userColor){
      css += `
span[title="${title}"]{background-color:${userColor} !important;border-radius:8px !important;font-weight:bold;}`;
    }
  });
  Object.entries(i18nMail).forEach(([key,map])=>{
    const title = map[lang];
    const userColor = colors[key];
    if (title && userColor){
      const tag = key === 'mailWrite' ? 'button' : 'a';
      css += `
${tag}[title="${title}"]{background-color:${userColor} !important;border-radius:8px !important;font-weight:bold;}`;
    }
  });
  return css;
}

function applyCss(css){
  let style = document.getElementById('userCustomStyles');
  if(!style){ style = document.createElement('style'); style.id='userCustomStyles'; document.documentElement.appendChild(style); }
  style.textContent = css;
}

function refresh(){
  chrome.storage.sync.get(null, (colors)=>{
    const lang = detectLang();
    const css = buildStatusCss(colors, lang);
    applyCss(css);
  });
}

refresh();

// Opcjonalny observer dla dynamicznego DOM w Salesforce
const mo = new MutationObserver(()=>{ refresh(); });
mo.observe(document.documentElement,{childList:true,subtree:true});
