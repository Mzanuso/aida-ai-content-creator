# Roadmap di sviluppo AIDA

Questo documento delinea le fasi di sviluppo pianificate per AIDA, la piattaforma di creazione contenuti video assistita da AI.

## Fase 1: Setup iniziale e autenticazione ✅

- [x] Creazione del repository GitHub
- [x] Configurazione dell'ambiente di sviluppo con React e Vite
- [x] Configurazione Firebase (Authentication, Firestore, Storage, Functions)
- [x] Creazione struttura base del progetto
- [x] Creazione struttura per Firebase Functions
- [x] Implementazione sistema di autenticazione (login, registrazione, recupero password)
- [x] Creazione landing page e flow di onboarding utente
- [x] Implementazione componenti principali (Button, Input, Alert, ecc.)
- [x] Tema chiaro/scuro con ThemeContext
- [x] Layout principale con Header, Sidebar e navigazione

## Fase 2: Dashboard e gestione progetti ✅

- [x] Creazione dashboard utente con panoramica progetti
- [x] Implementazione lista progetti con ordinamento e ricerca
- [x] Funzionalità di eliminazione progetti
- [ ] Creazione nuovo progetto
- [ ] Pagina dettaglio progetto
- [ ] Funzionalità di condivisione e pubblicazione

## Fase 3: Modulo STYLE ✅

- [x] Implementazione interfaccia utente per selezione stile
- [x] Sviluppo di visualizzatori per palette colori RGB
- [x] Sistema per selezione di keywords con suggerimenti
- [x] Galleria di immagini per selezione stile visivo con filtro e ricerca
- [x] Pagina di selezione stile con schede per le diverse modalità
- [x] Preview degli stili selezionati
- [x] Salvataggio preferenze stile in database

## Fase 4: Modulo STORYTELLING 🔄

- [ ] Interfaccia per input della storia
- [ ] Integrazione con AI "Agente scrittore" via Firebase Functions
- [ ] Implementazione editor per 5 parti della sceneggiatura
- [ ] Funzionalità per riscrivere/rigenerare parti specifiche
- [ ] Sistema di revisione e feedback
- [ ] Salvataggio automatico delle modifiche

## Fase 5: Modulo STORYBOARD ⏱️

- [ ] Interfaccia dello storyboard con sequenza di immagini
- [ ] Integrazione con AI "Agente regista" via Firebase Functions
- [ ] Sistema di invio prompts a Midjourney
- [ ] Visualizzatore di immagini generate
- [ ] Strumenti di editing immagini
- [ ] Upscaling automatico delle immagini

## Fase 6: Modulo VIDEO e AUDIO ⏱️

- [ ] Dashboard per editing video
- [ ] Timeline per sequenza video e audio
- [ ] Integrazione con servizi AI di generazione video
- [ ] Editor per voice-over e soundtrack
- [ ] Preview del video in tempo reale
- [ ] Funzionalità di esportazione e condivisione

## Fase 7: Ottimizzazione e pubblicazione ⏱️

- [ ] Ottimizzazione performance
- [ ] Testing utente e raccolta feedback
- [ ] Implementazione metriche di analytics
- [ ] Integrazione con piattaforme social (TikTok, Instagram, ecc.)
- [ ] Documentazione utente e tutorial
- [ ] Rilascio versione beta
- [ ] Sistema di notifiche
- [ ] Pagina impostazioni utente
- [ ] Statistiche di utilizzo

## Prossimi passi immediati

1. **Completare la gestione progetti**:
   - Implementare la creazione di un nuovo progetto
   - Sviluppare la pagina di dettaglio del progetto
   - Aggiungere funzionalità di anteprima e navigazione tra i moduli

2. **Sviluppare il modulo STORYTELLING**:
   - Creare un editor di testo per la sceneggiatura
   - Implementare l'integrazione con "Agente scrittore" AI
   - Sviluppare l'interfaccia di revisione e modifica
   - Aggiungere funzionalità per generare e modificare le 5 parti della sceneggiatura

3. **Preparare l'infrastruttura per il modulo STORYBOARD**:
   - Iniziare lo sviluppo dell'integrazione con l'API di Midjourney
   - Progettare l'interfaccia di visualizzazione dello storyboard
   - Creare i componenti per l'editing delle immagini

## Legenda

- ✅ Completato
- 🔄 In corso
- ⏱️ Pianificato
- ❌ Bloccato
