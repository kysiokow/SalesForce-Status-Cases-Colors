function scheduleNextClock() {
    // Pobieramy ustawienie z pamięci. Jeśli go nie ma, domyślnie przyjmujemy true.
    chrome.storage.sync.get({"enable-clock": true}, (data) => {
        
        // TEST: To zobaczysz w konsoli (F12 -> Console) na stronie Salesforce
        console.log("Status zegara w main_logic.js:", data["enable-clock"]);

        if (data["enable-clock"] === false) {
            console.log("Zegar jest wyłączony w ustawieniach. Przerywam odliczanie.");
            return; 
        }

        const now = new Date();
        const nextCheck = new Date();

        // Ustalenie godziny (pełna lub wpół do)
        if (now.getMinutes() < 30) {
            nextCheck.setMinutes(30, 0, 0);
        } else {
            nextCheck.setHours(now.getHours() + 1, 0, 0, 0);
        }

        const diff = nextCheck.getTime() - now.getTime();
        console.log(`Następne powiadomienie o godzinie za: ${Math.round(diff/1000/60)} min.`);

        setTimeout(() => {
            const timeString = nextCheck.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            showClockOverlay(timeString);
            scheduleNextClock(); // Planowanie kolejnego
        }, diff);
    });
}

function showClockOverlay(timeString) {
    if (document.getElementById('sf-clock-display')) return;

    const clockDiv = document.createElement('div');
    clockDiv.id = 'sf-clock-display';
    clockDiv.innerText = `Aktualna godzina: ${timeString}`;
    clockDiv.className = 'custom-welcome-message';
    clockDiv.style.borderColor = '#1589ee'; 
    
    document.body.appendChild(clockDiv);

    setTimeout(() => {
        clockDiv.style.opacity = '0';
        setTimeout(() => clockDiv.remove(), 500);
    }, 5000);
}

// Start mechanizmu
scheduleNextClock();