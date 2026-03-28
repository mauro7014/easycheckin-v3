// js/dashboard.js - Panel del Dueño
async function loadDashboard() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) { window.location.href = 'index.html'; return; }

    try {
        const { data: owner } = await sb.from('owners').select('*').eq('user_id', user.id).single();
        document.getElementById('owner-name').innerText = `Bienvenido, ${owner.full_name}`;

        const qrContainer = document.getElementById("qrcode");
        const checkinUrl = `${window.location.origin}/checkin.html?id=${owner.id}`;
        qrContainer.innerHTML = ""; 
        new QRCode(qrContainer, { text: checkinUrl, width: 180, height: 180 });
        document.getElementById("qr-link").innerText = checkinUrl;

        const { data: checkins } = await sb.from('checkins').select('*').eq('owner_id', owner.id).order('created_at', { ascending: false });
        const tableBody = document.getElementById('checkins-body');
        tableBody.innerHTML = checkins.map(c => `<tr><td style="padding:10px;">${c.guest_name}</td><td style="padding:10px;">${c.document_id}</td><td style="padding:10px;">${c.checkin_date} ✅</td></tr>`).join('');
    } catch (err) { console.error(err); }
}

window.logout = async () => { await sb.auth.signOut(); window.location.href = 'index.html'; };
loadDashboard();
