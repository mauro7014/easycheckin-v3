// js/checkin.js - Huésped y Cobro
const ownerId = new URLSearchParams(window.location.search).get('id');
const btnPay = document.getElementById('btn-pay');

document.getElementById('checkin-form').onsubmit = async (e) => {
    e.preventDefault();
    if (!ownerId) return alert("Falta ID del dueño");

    btnPay.disabled = true;
    btnPay.innerText = "Pagando 1€...";

    const guestData = {
        guest_name: document.getElementById('g-name').value,
        document_id: document.getElementById('g-doc').value,
        checkin_date: document.getElementById('g-in').value
    };

    try {
        const res = await fetch('/api/pay', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ownerId, guestData })
        });
        const result = await res.json();

        if (result.ok) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.text("EASYCHECKIN - COMPROBANTE", 20, 20);
            doc.text(`Huesped: ${guestData.guest_name}`, 20, 40);
            doc.save('comprobante.pdf');
            alert("¡Éxito! Pago y check-in realizados.");
            location.reload();
        } else { throw new Error(result.error); }
    } catch (err) { alert("Error: " + err.message); btnPay.disabled = false; }
};
