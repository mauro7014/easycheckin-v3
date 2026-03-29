import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();

  const { qr, guest_name, guest_dni } = req.body;

  // Buscar propietario
  const { data: owners } = await supabase
    .from('owners')
    .select('*')
    .eq('id', qr)
    .single();

  if(!owners) return res.status(404).json({message:'Propietario no encontrado'});

  // Cobrar 1€ automáticamente a tarjeta del propietario
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100, // 1€ = 100 cents
    currency: 'eur',
    customer: owners.stripe_customer,
    payment_method_types: ['card'],
    confirm: true,
  });

  // Generar PDF
  const pdfPath = `/tmp/${guest_name.replace(' ','_')}.pdf`;
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.text(`Check-in realizado\nNombre: ${guest_name}\nDNI: ${guest_dni}\nPropietario: ${owners.name}`);
  doc.end();

  // Subir info a Supabase
  const { data, error } = await supabase.from('checkins').insert([{
    owner_id: owners.id,
    guest_name,
    guest_dni,
    pdf_url: pdfPath,
    amount: 1
  }]);

  res.json({message:'Check-in exitoso y cobro realizado'});
}