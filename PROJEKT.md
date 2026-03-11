# Web: Jakub Sojka – Finanční poradce / Pojišťovací makléř

## Inspirace
- https://wealthstrategy.cz/ (konkurent, podobný obsah a zaměření)

## Osobní info (TODO – doplnit od klienta)
- Jméno: Jakub Sojka
- Telefon: TODO
- Email: TODO
- Sídlo / město: TODO
- Google Places ID: TODO (pro načítání recenzí)
- Facebook / Instagram: TODO
- Fotky: ZATÍM ŽÁDNÉ – dodat později

---

## Design

- **Styl**: Moderní, čistý, profesionální
- **Barvy**: Světle modrá – klidná, důvěryhodná paleta (místo fialové jako wealthstrategy)
  - Primary: #2563EB (modrá)
  - Light: #EFF6FF
  - Accent: #0EA5E9
  - Text: #0F172A
  - Background: #FFFFFF / #F8FAFC
- **Font**: Inter (Google Fonts)
- **Na začátku působí jako srovnávač** – důraz na srovnání pojistného, úspory

---

## Sekce webu (top → bottom)

### 1. Navbar
- Logo / jméno "Jakub Sojka"
- Menu: Pojištění | Hypotéky | O mně | Reference | Kontakt
- CTA tlačítko: "Získat nabídku"
- Hamburger na mobilu

### 2. Hero – Srovnávač pojištění
- Hlavní titulek: "Ušetřete na pojištění – srovnám za vás"
- Podtitulek: důraz na to, že je to ZDARMA, ONLINE, RYCHLE
- **SPZ formulář** (hlavní CTA):
  - Pole: SPZ (auto-format "ABC 1234")
  - Po zadání SPZ → rozbalí se formulář: Jméno, Telefon, Email
  - Odeslání → uloží do Supabase (typ: spz_pojisteni)
- Loga pojišťovacích partnerů (karusel)

### 3. Jak to funguje (3 kroky)
- Vyplníš krátký formulář
- Dostaneš srovnání nabídek
- Vybereme nejlepší a zařídíme vše online

### 4. Služby (karty)
- Pojištění vozidla (povinné ručení, havarijní)
- Životní pojištění
- Pojištění majetku
- Hypotéky a úvěry
- Cestovní pojištění

### 5. O Jakubovi
- Foto (TODO)
- Bio text (TODO)
- Filozofie / přístup ke klientům
- Tlačítka: Kontaktovat | Reference

### 6. Statistiky
- X+ spokojených klientů
- X+ uzavřených smluv
- X mil. Kč pojištěného majetku
- 98% klientů doporučuje

### 7. Kolik klienti ušetřili
- Tabulka/karty s konkrétními příklady úspor (anonymizovaně)
- Např. "Jan K. – auto pojištění – ušetřil 3 200 Kč/rok"
- (TODO – získat reálné příklady od Jakuba)

### 8. Google Recenze
- Dynamické načítání přes Google Places API
- Zobrazení: jméno, hvězdičky, text recenze, datum
- Proklik na Google recenze Jakuba
- Fallback: statické recenze pokud API nefunguje

### 9. Hypoteční kalkulačka
- Pole: Výše hypotéky (Kč), Úroková sazba (%), Doba splácení (roky)
- Výsledek: měsíční splátka, celkem zaplaceno, celkový úrok
- Po výpočtu → formulář: Jméno, Telefon, Email + "Chci nezávaznou konzultaci"
- Odeslání → Supabase (typ: hypoteka)

### 10. FAQ
- Kolik to stojí? (ZDARMA)
- Jak dlouho trvá srovnání?
- Budu muset podepsat papíry? (elektronický podpis)
- Budete mi pak volat? (jen pokud si to přeješ)
- Spolupracujete se všemi pojišťovnami?

### 11. Kontaktní formulář
- Jméno, Telefon, Email, Zpráva, typ zájmu (dropdown)
- Odeslání → Supabase (typ: kontakt)

### 12. Footer
- Kontakt: tel, email
- Soc. sítě: FB, IG
- Rychlé linky
- GDPR / Zásady ochrany osobních údajů
- Copyright Jakub Sojka 2026

---

## Technická architektura

### Frontend
- **Čisté HTML + CSS + vanilla JavaScript** (žádný framework)
- Soubory:
  - `index.html` – hlavní stránka
  - `css/style.css` – styly
  - `js/main.js` – interakce, formuláře, kalkulačka
  - `js/reviews.js` – Google recenze
  - `js/supabase.js` – komunikace s DB
  - `img/` – obrázky a loga

### Databáze – Supabase
- **URL**: TODO (po vytvoření projektu na supabase.io)
- **Anon Key**: TODO

**Tabulka `leads`:**
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  jmeno TEXT,
  email TEXT,
  telefon TEXT,
  typ TEXT, -- 'spz_pojisteni' | 'hypoteka' | 'kontakt' | 'newsletter'
  spz TEXT,
  zprava TEXT,
  kalkulacka_data JSONB -- pro hypoteční kalkulačku: výše, sazba, doba, splátka
);
```

**RLS (Row Level Security):**
- INSERT povolen pro všechny (anon key z frontendu)
- SELECT zakázán pro anon (jen Jakub přes Supabase dashboard)

### Google Recenze
- Google Places API (potřeba API klíč z Google Cloud Console)
- Places ID Jakubova Google profilu: TODO
- Fallback na statické recenze

### Hosting
- Netlify (zdarma, deploy z GitHubu)
- nebo vlastní CZ hosting

---

## TODO checklist

- [ ] Získat osobní info od Jakuba (tel, email, bio, foto)
- [ ] Získat příklady úspor klientů
- [ ] Vytvořit Supabase projekt + tabulku leads
- [ ] Získat Google API klíč + Places ID
- [ ] Dodat fotky
- [ ] Dodat text "O mně"
- [ ] Dodat loga pojišťovacích partnerů
- [ ] Napojit vlastní doménu
- [ ] GDPR texty

---

## Stav projektu
- [x] Složka vytvořena
- [x] PROJEKT.md sepsán
- [ ] HTML struktura
- [ ] CSS / design
- [ ] JS / interakce
- [ ] Supabase napojení
- [ ] Google recenze
- [ ] Hypoteční kalkulačka
- [ ] Deploy
