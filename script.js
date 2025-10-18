// --- Globale Variablen ---
let total = 0;
const values = {};
let earning_base_mult = 0.2;
let total_base_mult = 1.2;
let discount = 0; // Rabatt in Dezimalform

// --- Hilfsfunktionen ---
const $ = id => document.getElementById(id);

function formatToUSD(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(num);
}

function updateDisplay() {
    const total_mult = total_base_mult - discount;
    const earning_mult = earning_base_mult - discount;
    $('cost').innerText = `Kosten: ${formatToUSD(total)}`;
    $('earning').innerText = `Gewinn: ${formatToUSD(total * earning_mult)}`;
    $('total').innerText = `Gesamtpreis: ${formatToUSD(total * total_mult)}`;
}

// --- Preisberechnung ---
function calculate(price) {
    total += price;
    updateDisplay();
}

function toggleOption(button, price) {
    button.classList.toggle('active');
    calculate(button.classList.contains('active') ? price : -price);
}

// --- Reset-Funktion ---
function resetForm() {
    document.querySelectorAll('.button-group button.active')
        .forEach(b => b.classList.remove('active'));

    document.querySelectorAll('select').forEach(sel => sel.value = sel.querySelector('[data-code="0"]').value);

    document.querySelectorAll('input[type="text"]').forEach(i => i.value = "");

    Object.keys(values).forEach(k => values[k] = 0);
    total = 0;
    discount = 0;
    updateDisplay();
}

// --- Dropdown-Handling ---
const dropdowns = ['motor', 'bremse', 'getriebe', 'federung', 'panzerung', 'turbo', 'felgenart'];

dropdowns.forEach(id => {
    values[id] = 0;
    $(id).addEventListener('change', e => {
        const code = Number(e.target.selectedOptions[0].dataset.code);
        calculate(-values[id]);
        values[id] = code;
        calculate(code);
    });
});

// --- Rabatt-Buttons ---
document.querySelectorAll('.rabatt-section button').forEach(btn => {
    btn.addEventListener('click', () => {
        const percent = parseInt(btn.id.replace('p', '')) || 0;
        discount = percent / 100;
        updateDisplay();

        // Visuelles Feedback
        document.querySelectorAll('.rabatt-section button')
            .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Discord
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1401495775384698930/a6GKCzi_g4PO02B6KQ0F8uPMEHmIIKr-JX22l2XPFkMaPX7_juVT9o8nmBajD2Qs_-K_';

document.querySelector('.send').addEventListener('click', () => {
    const tuner = document.getElementById('tuner').value;
    const name = document.getElementById('name').value;
    const fahrzeug = document.getElementById('fahrzeug').value;
    const fraktion = document.getElementById('fraktion').value;
    const cost = document.getElementById('cost').innerText;
    const earning = document.getElementById('earning').innerText;
    const total = document.getElementById('total').innerText;

    const content = `🔧 **Tuning Nachweis** 🔧\n
**Tuner:** ${tuner}
**Kunde:** ${name}
**Fahrzeug:** ${fahrzeug}
**Fraktion:** ${fraktion}
**Kosten:** ${"$" + cost.split('$')[1]}
**Gewinn:** ${"$" + earning.split('$')[1]}
**Gesamtpreis:** ${"$" + total.split('$')[1]}`;

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