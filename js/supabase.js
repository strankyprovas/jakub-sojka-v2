// =============================================
// SUPABASE KONFIGURACE
// Vyplň URL a klíč po vytvoření projektu na supabase.io
// =============================================

const SUPABASE_URL = 'DOPLNIT_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'DOPLNIT_SUPABASE_ANON_KEY';

// Odeslání leadu do Supabase
async function saveLead(data) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Supabase error:', err);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Network error:', e);
    return false;
  }
}

/*
SQL pro vytvoření tabulky v Supabase (spusť v SQL editoru):

CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  jmeno TEXT,
  email TEXT,
  telefon TEXT,
  typ TEXT,
  spz TEXT,
  zprava TEXT,
  kalkulacka_data JSONB
);

-- RLS: INSERT povolíme pro všechny (anon key), SELECT jen pro Jakuba přes dashboard
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for all" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for authenticated" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');
*/
