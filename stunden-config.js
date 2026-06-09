/* ══════════════════════════════════════════════════════════════
   KAROHILFT – Stunden-App Konfiguration
   Nur diese Datei anpassen – alle anderen Dateien bleiben gleich
   ══════════════════════════════════════════════════════════════ */

// ── Supabase-Verbindung ─────────────────────────────────────────
// 1. Gratis-Account anlegen auf: https://supabase.com
// 2. Neues Projekt erstellen
// 3. Project Settings → API → URL und "anon public" key kopieren
window.SUPABASE_URL = '';   // z.B. 'https://xyzabc.supabase.co'
window.SUPABASE_KEY = '';   // z.B. 'eyJhbGciOiJIUzI1Ni...'

// ── Demo-Modus ──────────────────────────────────────────────────
// true  = Daten werden nur lokal im Browser gespeichert (zum Testen)
// false = Daten werden in Supabase gespeichert (für den echten Betrieb)
window.DEMO_MODUS = true;

// ── Admin-Passwort ──────────────────────────────────────────────
window.ADMIN_PASSWORT = 'karohilft2024';  // bitte ändern!

// ── Liste Ihrer Betreuer/innen ──────────────────────────────────
window.BETREUER_LISTE = [
  'Anna Mustermann',
  'Maria Beispiel',
  'Josef Muster',
  // weitere einfach hier hinzufügen ...
];

// ── Liste der betreuten Familien / Personen ─────────────────────
window.FAMILIEN_LISTE = [
  'Familie Maier',
  'Familie Fischer',
  'Herr Bauer',
  'Frau Huber',
  // weitere einfach hier hinzufügen ...
];

/* ── SQL für Supabase (einmalig im SQL-Editor ausführen) ─────────

CREATE TABLE stunden_eintraege (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  betreuer     TEXT NOT NULL,
  familie      TEXT NOT NULL,
  datum        DATE NOT NULL,
  von_uhrzeit  TIME NOT NULL,
  bis_uhrzeit  TIME NOT NULL,
  stunden      NUMERIC(5,2) NOT NULL,
  notizen      TEXT DEFAULT '',
  erstellt_am  TIMESTAMPTZ DEFAULT NOW()
);

-- Jeder darf Einträge hinzufügen (Betreuer-Formular)
ALTER TABLE stunden_eintraege ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_fuer_alle" ON stunden_eintraege FOR INSERT WITH CHECK (true);
CREATE POLICY "lesen_fuer_alle"  ON stunden_eintraege FOR SELECT USING (true);
CREATE POLICY "loeschen_fuer_alle" ON stunden_eintraege FOR DELETE USING (true);

─────────────────────────────────────────────────────────────── */
