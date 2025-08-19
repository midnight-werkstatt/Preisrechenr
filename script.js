// Globale Variablen zum Rechnen
let total = 0;
let motor = 0;
let bremse = 0;
let getriebe = 0;
let federung = 0;
let panzerung = 0;
let turbo = 0;
let felgenart = 0;

// Funktionen
function toggleOption(button, price) {
    if(button.classList.toggle('active')) {
        calculate(price);
    } else {
        calculate(-price);
    }
}

function calculate(price) {
    total += price;

    document.getElementById('cost').innerText = `Kosten: ${formatToUSD(total)}`;
    document.getElementById('earning').innerText = `Gewinn: ${formatToUSD(total * 0.2)}`;
    document.getElementById('total').innerText = `Gesamtpreis: ${formatToUSD(total * 1.2)}`;
}

function formatToUSD(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
function resetForm() {
    // Setzt Buttons zurück
    document.querySelectorAll('.button-group button.active').forEach(button => {button.classList.toggle('active');});
    // Setzt Dropdowns zurück
    document.querySelectorAll('select').forEach(selection => {
        [...selection.options].forEach(opt => {
            if(opt.dataset.code === "0") {
                opt.selected = true;
            }
        })
    });
    // Variablen aufräumen, Gesammtpreis usw auf 0 setzen
    total = 0;
    motor = 0;
    bremse = 0;
    getriebe = 0;
    federung = 0;
    panzerung = 0;
    turbo = 0;
    felgenart = 0;
    calculate(0);
}

// Dropdown
document.getElementById('motor').addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    if(motor !== Number(selectedOption.dataset.code)) {
        calculate(-motor)
        motor = Number(selectedOption.dataset.code);
        calculate(motor);
    }
});
document.getElementById('bremse').addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    if(bremse !== Number(selectedOption.dataset.code)) {
        calculate(-bremse)
        bremse = Number(selectedOption.dataset.code);
        calculate(bremse);
    }
});
document.getElementById('getriebe').addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    if(getriebe !== Number(selectedOption.dataset.code)) {
        calculate(-getriebe)
        getriebe = Number(selectedOption.dataset.code);
        calculate(getriebe);
    }
});
document.getElementById('federung').addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    if(federung !== Number(selectedOption.dataset.code)) {
        calculate(-federung)
        federung = Number(selectedOption.dataset.code);
        calculate(federung);
    }
});
document.getElementById('panzerung').addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    if(panzerung !== Number(selectedOption.dataset.code)) {
        calculate(-panzerung)
        panzerung = Number(selectedOption.dataset.code);
        calculate(panzerung);
    }
});
document.getElementById('turbo').addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    if(turbo !== Number(selectedOption.dataset.code)) {
        calculate(-turbo)
        turbo = Number(selectedOption.dataset.code);
        calculate(turbo);
    }
});
document.getElementById('felgenart').addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    if(felgenart !== Number(selectedOption.dataset.code)) {
        calculate(-felgenart)
        felgenart = Number(selectedOption.dataset.code);
        calculate(felgenart);
    }
});

// Discord
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1401495775384698930/a6GKCzi_g4PO02B6KQ0F8uPMEHmIIKr-JX22l2XPFkMaPX7_juVT9o8nmBajD2Qs_-K_';

document.querySelector('.send').addEventListener('click', () => {
    const tuner = document.getElementById('tuner').value;
    const name = document.getElementById('name').value;
    const fahrzeug = document.getElementById('fahrzeug').value;
    const fraktion = document.getElementById('fraktion').value;
    const total = document.getElementById('total').innerText;

    let aktiveButtons = Array.from(document.querySelectorAll('button.active')).map(btn => btn.innerText).join(', ');
    let felgenDropdown = document.getElementById('felgenart');
    let felgenart = felgenDropdown.options[felgenDropdown.selectedIndex].text;

    // Falls Felgen gewählt wurden, zur Liste hinzufügen
    if (felgenDropdown.value !== "") {
        aktiveButtons += `, Felgenart: ${felgenart}`;
    }

    const content = `🔧 **Tuning Nachweis** 🔧\n
**Tuner:** ${tuner}
**Kunde:** ${name}
**Fahrzeug:** ${fahrzeug}
**Fraktion:** ${fraktion}
**Gesamtpreis:** ${total}`;

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    }).then(response => {
        if (response.ok) {
            alert('Nachweis erfolgreich an Discord gesendet!');
            resetForm();
        } else {
            alert('Fehler beim Senden an Discord.');
        }
    }).catch(error => {
        alert('Ein Fehler ist aufgetreten: ' + error.message);
    });
});

// Immer ein sauberes Form
window.onload = () => {
    resetForm()
}