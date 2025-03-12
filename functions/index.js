const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Moduli per le diverse funzionalità
const scriptGenerator = require('./src/scriptGenerator');
const storyboardGenerator = require('./src/storyboardGenerator');
const imageGenerator = require('./src/imageGenerator');
const videoGenerator = require('./src/videoGenerator');
const voiceoverGenerator = require('./src/voiceoverGenerator');
const soundtrackGenerator = require('./src/soundtrackGenerator');

// Funzione per generare sceneggiatura
exports.generateScript = functions.https.onCall(async (data, context) => {
  // Verifica che l'utente sia autenticato
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utente deve essere autenticato per utilizzare questa funzione'
    );
  }
  
  return await scriptGenerator.generate(data, context.auth.uid);
});

// Funzione per generare storyboard
exports.generateStoryboard = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utente deve essere autenticato per utilizzare questa funzione'
    );
  }
  
  return await storyboardGenerator.generate(data, context.auth.uid);
});

// Funzione per generare immagini con Midjourney
exports.generateImages = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utente deve essere autenticato per utilizzare questa funzione'
    );
  }
  
  return await imageGenerator.generate(data, context.auth.uid);
});

// Funzione per generare video da immagini
exports.generateVideos = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utente deve essere autenticato per utilizzare questa funzione'
    );
  }
  
  return await videoGenerator.generate(data, context.auth.uid);
});

// Funzione per generare voce narrante
exports.generateVoiceover = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utente deve essere autenticato per utilizzare questa funzione'
    );
  }
  
  return await voiceoverGenerator.generate(data, context.auth.uid);
});

// Funzione per generare colonna sonora
exports.generateSoundtrack = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utente deve essere autenticato per utilizzare questa funzione'
    );
  }
  
  return await soundtrackGenerator.generate(data, context.auth.uid);
});

// Funzione per salvare e processare i file delle immagini degli stili
exports.processStyleImage = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  // Verifica che sia un file in /styles/
  if (!filePath.startsWith('styles/')) {
    return null;
  }
  
  try {
    // Estrai il codice sref dal percorso del file
    const fileNameMatch = filePath.match(/\/(\d+)_/);
    if (!fileNameMatch) {
      console.error('Formato nome file non valido:', filePath);
      return null;
    }
    
    const srefCode = fileNameMatch[1];
    
    // Cerca il file di analisi corrispondente
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({ prefix: `styles/${srefCode}_` });
    
    const analysisFile = files.find(file => file.name.includes('_analysis.'));
    
    if (!analysisFile) {
      console.log('File di analisi non trovato per:', srefCode);
      return null;
    }
    
    // Leggi il contenuto del file di analisi
    const [content] = await analysisFile.download();
    const analysisText = content.toString('utf-8');
    
    // Estrai informazioni rilevanti dal testo di analisi
    const rgbMatches = analysisText.match(/RGB\([^)]+\)/g) || [];
    const keywords = extractKeywords(analysisText);
    
    // Salva le informazioni in Firestore
    await admin.firestore().collection('styles').doc(srefCode).set({
      srefCode,
      imagePath: filePath,
      analysisPath: analysisFile.name,
      rgbColors: rgbMatches,
      keywords,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Errore nel processamento dell\'immagine di stile:', error);
    return { success: false, error: error.message };
  }
});

// Funzione di utilità per estrarre keywords dal testo di analisi
function extractKeywords(text) {
  const keywordsSection = text.split('KEYWORDS:')[1];
  if (!keywordsSection) return [];
  
  const endSection = keywordsSection.indexOf('SOCIAL MEDIA:');
  const keywordsText = endSection > -1 
    ? keywordsSection.substring(0, endSection) 
    : keywordsSection;
  
  return keywordsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}
