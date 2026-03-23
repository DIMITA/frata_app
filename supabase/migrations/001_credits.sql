-- ============================================================
-- frata — Système de crédits
-- ============================================================

-- Table profiles (liée à auth.users)
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  credits     INTEGER NOT NULL DEFAULT 3,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Table des transactions de crédits
CREATE TABLE public.credit_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL,                         -- positif = ajout, négatif = déduction
  type            TEXT NOT NULL CHECK (type IN ('signup_bonus', 'purchase', 'usage')),
  description     TEXT,
  transaction_ref TEXT,                                     -- ID transaction KKiaPay
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture profil personnel" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Mise à jour profil personnel" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lecture transactions personnelles" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- Trigger : créer le profil + crédits offerts à l'inscription
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (NEW.id, NEW.email, 3);

  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 3, 'signup_bonus', '3 crédits offerts à l''inscription');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Fonction RPC : déduire 1 crédit (atomique)
-- ============================================================
CREATE OR REPLACE FUNCTION public.deduct_credit(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET credits = credits - 1, updated_at = NOW()
  WHERE id = p_user_id AND credits > 0;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'credits_insufficient';
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -1, 'usage', 'Suppression de métadonnées');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction RPC : ajouter des crédits après paiement (appelée par l'Edge Function)
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id UUID, p_amount INTEGER, p_ref TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET credits = credits + p_amount, updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO public.credit_transactions (user_id, amount, type, description, transaction_ref)
  VALUES (p_user_id, p_amount, 'purchase', 'Achat de crédits', p_ref);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Index
-- ============================================================
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);
