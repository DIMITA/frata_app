import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useCredits(user: User | null) {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchCredits = useCallback(async () => {
    if (!user) { setCredits(null); return }
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()
    setCredits(data?.credits ?? 0)
    setLoading(false)
  }, [user])

  useEffect(() => { fetchCredits() }, [fetchCredits])

  async function deductCredit(): Promise<boolean> {
    if (!user || credits === null || credits <= 0) return false

    // Décrémenter optimistiquement
    setCredits(c => (c ?? 0) - 1)

    const { error } = await supabase.rpc('deduct_credit', { p_user_id: user.id })
    if (error) {
      // Rollback
      setCredits(c => (c ?? 0) + 1)
      return false
    }
    return true
  }

  return { credits, loading, fetchCredits, deductCredit }
}
