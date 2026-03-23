import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CREDIT_PACKS: Record<string, { credits: number; price: number }> = {
  starter:  { credits: 10,  price: 500  },
  pro:      { credits: 50,  price: 2000 },
  business: { credits: 200, price: 7000 },
}

Deno.serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  try {
    const { transactionId, packId, userId } = await req.json()

    if (!transactionId || !packId || !userId) {
      return json({ error: 'Paramètres manquants' }, 400)
    }

    const pack = CREDIT_PACKS[packId]
    if (!pack) {
      return json({ error: 'Pack invalide' }, 400)
    }

    // 1. Vérifier la transaction KKiaPay
    const kkiapaySecret = Deno.env.get('KKIAPAY_PRIVATE_KEY')
    const verifyRes = await fetch(
      `https://api.kkiapay.me/api/v1/transactions/${transactionId}/status`,
      { headers: { 'x-secret-key': kkiapaySecret ?? '' } }
    )

    if (!verifyRes.ok) {
      return json({ error: 'Impossible de vérifier la transaction' }, 402)
    }

    const tx = await verifyRes.json()

    // Vérifier que le paiement est bien validé et que le montant correspond
    if (tx.status !== 'SUCCESS') {
      return json({ error: `Transaction non validée (statut: ${tx.status})` }, 402)
    }

    if (Number(tx.amount) < pack.price) {
      return json({ error: 'Montant insuffisant' }, 402)
    }

    // 2. Créditer l'utilisateur via Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier que cette transaction n'a pas déjà été utilisée (idempotence)
    const { data: existing } = await supabase
      .from('credit_transactions')
      .select('id')
      .eq('transaction_ref', transactionId)
      .single()

    if (existing) {
      return json({ error: 'Transaction déjà traitée' }, 409)
    }

    const { error } = await supabase.rpc('add_credits', {
      p_user_id: userId,
      p_amount: pack.credits,
      p_ref: transactionId,
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return json({ error: 'Erreur lors de l\'ajout des crédits' }, 500)
    }

    return json({ success: true, credits_added: pack.credits })
  } catch (err) {
    console.error('Edge function error:', err)
    return json({ error: 'Erreur interne' }, 500)
  }
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
