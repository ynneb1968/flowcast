# 🚀 Flowcast — Guida al Deploy su Vercel

## Struttura del Progetto
```
flowcast/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    └── App.jsx
```

---

## 📦 Deploy su Vercel (5 minuti)

### STEP 1 — Crea account GitHub
1. Vai su https://github.com
2. Clicca "Sign up" e crea account gratuito

### STEP 2 — Carica il progetto su GitHub
1. Clicca "+" in alto a destra → "New repository"
2. Nome: `flowcast`
3. Clicca "Create repository"
4. Trascina tutti i file di questa cartella nella pagina del repository
5. Clicca "Commit changes"

### STEP 3 — Deploy su Vercel
1. Vai su https://vercel.com
2. Clicca "Sign up with GitHub"
3. Clicca "Add New Project"
4. Seleziona il repository `flowcast`
5. Clicca "Deploy" → attendi 2 minuti

✅ Il tuo link sarà tipo: https://flowcast-TUONOME.vercel.app

---

## 🌐 Dominio Personalizzato (opzionale)
1. Compra dominio su https://www.namecheap.com (~€10/anno)
2. In Vercel → Settings → Domains → aggiungi il tuo dominio
3. Segui le istruzioni per configurare i DNS

---

## 💻 Sviluppo Locale
```bash
npm install
npm run dev
```
Apri http://localhost:5173

---

## ⚙️ Variabili d'Ambiente
Per abilitare le chiamate AI reali, crea un file `.env.local`:
```
VITE_ANTHROPIC_API_KEY=la_tua_chiave_api
```
Ottieni la chiave su: https://console.anthropic.com

---

Realizzato con ❤️ da Flowcast · Powered by RedAbissi
