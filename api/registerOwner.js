import Stripe from "stripe";
import { supabase } from "./supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { nombre, email, payment_method } = req.body;

  // Crear cliente en Stripe
  const customer = await stripe.customers.create({
    name: nombre,
    email,
    payment_method,
    invoice_settings: { default_payment_method: payment_method }
  });

  // Guardar en Supabase
  const { data, error } = await supabase.from("propietarios").insert({
    nombre,
    email,
    stripe_customer_id: customer.id,
    stripe_paymentmethod: payment_method
  });

  res.status(200).json({ data, error });
}