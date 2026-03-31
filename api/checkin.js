import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { qr, guest_name, guest_dni } = req.body;

  try {
    // Buscar owner
    const { data: owner, error } = await supabase
      .from('owners')
      .select('*')
      .eq('id', qr)
      .single();

    if (error || !owner) {
      return res.status(404).json({ message: 'Owner no encontrado' });
    }

    // Cobro 1€
    await stripe.paymentIntents.create({
      amount: 100,
      currency: 'eur',
      customer: owner.stripe_customer,
      payment_method_types: ['card'],
      confirm: true,
    });

    // Guardar checkin
    await supabase.from('checkins').insert([{
      owner_id: owner.id,
      guest_name,
      guest_dni,
      amount: 1
    }]);

    return res.json({ message: 'Check-in OK y cobro realizado' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno' });
  }
}