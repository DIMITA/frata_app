import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  credits: number
  created_at: string
  updated_at: string
}

export const CREDIT_PACKS = [
  { id: 'starter',  label: 'Starter',  credits: 10,  price: 500,  currency: 'XOF' },
  { id: 'pro',      label: 'Pro',       credits: 50,  price: 2000, currency: 'XOF' },
  { id: 'business', label: 'Business',  credits: 200, price: 7000, currency: 'XOF' },
] as const

export type CreditPack = typeof CREDIT_PACKS[number]
