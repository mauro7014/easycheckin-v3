const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send();
    const { ownerId, guestData } = req.body;
    try {
        const { data: owner } = await sb.from('owners').select('*').eq('id', ownerId).single();
        const payment = await stripe.paymentIntents.create({
            amount: 100, currency: 'eur', customer: owner.stripe_customer_id,
            payment_method: owner.stripe_payment_method || 'pm_card_visa',
            off_session: true, confirm: true
        });
        await sb.from('checkins').insert([{ ...guestData, owner_id: ownerId, stripe_payment_id: payment.id }]);
        res.status(200).json({ ok: true });
    } catch (e) { res.status(400).json({ error: e.message }); }
};
