const axios = require('axios');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const db = admin.firestore();

/**
 * Genera una sceneggiatura utilizzando l'AI
 * @param {Object} data - Dati di input (prompt e styleInfo)
 * @param {string} userId - ID dell'utente autenticato
 * @return {Promise<Object>} - Sceneggiatura generata
 */
async function generate(data, userId) {
  const { prompt, styleInfo, projectId } = data;
  
  if (!prompt || prompt.trim().length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Il prompt non può essere vuoto'
    );
  }
  
  try {
    // In un'implementazione reale, qui ci sarebbe la chiamata a GoAPI
    // per utilizzare l'AI "Agente scrittore"
    // Per ora, simuliamo la risposta
    
    // Prepara il prompt per l'AI
    const aiPrompt = buildPrompt(prompt, styleInfo);
    
    // Simula una risposta dall'AI
    const scriptParts = generateScriptParts(prompt, styleInfo);
    
    // Salva la sceneggiatura nel database
    const projectRef = db.collection('projects').doc(projectId);
    
    await projectRef.update({
      script: {
        prompt: prompt,
        styleInfo: styleInfo,
        parts: scriptParts,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { 
      success: true, 
      script: {
        parts: scriptParts,
        prompt: prompt
      }
    };
  } catch (error) {
    console.error('Errore nella generazione della sceneggiatura:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Errore durante la generazione della sceneggiatura',
      error.message
    );
  }
}

/**
 * Costruisce il prompt per l'AI
 * @param {string} userPrompt - Prompt dell'utente
 * @param {Object} styleInfo - Informazioni sullo stile
 * @return {string} - Prompt completo per l'AI
 */
function buildPrompt(userPrompt, styleInfo) {
  // Costruzione del prompt con le informazioni di stile
  let prompt = `Sei un "Agente scrittore" specializzato in copywriting, sceneggiatura e scrittura creativa per video e cinema. `;
  prompt += `Crea una sceneggiatura suddivisa in 5 parti narrative distinte per un video che racconta: "${userPrompt}". `;
  
  if (styleInfo && styleInfo.keywords && styleInfo.keywords.length > 0) {
    prompt += `Lo stile deve riflettere queste keywords: ${styleInfo.keywords.join(', ')}. `;
  }
  
  if (styleInfo && styleInfo.rgbColors && styleInfo.rgbColors.length > 0) {
    prompt += `La palette colori di riferimento include: ${styleInfo.rgbColors.join(', ')}. `;
  }
  
  prompt += `Ogni parte della sceneggiatura deve essere di almeno 200 caratteri e deve comprendere dettagli visivi, emotivi e narrativi.`;
  
  return prompt;
}

/**
 * Genera le parti della sceneggiatura (simulazione)
 * @param {string} userPrompt - Prompt dell'utente
 * @param {Object} styleInfo - Informazioni sullo stile
 * @return {Array<Object>} - Parti della sceneggiatura
 */
function generateScriptParts(userPrompt, styleInfo) {
  // In un'implementazione reale, questo verrebbe sostituito dalla risposta dell'AI
  return [
    {
      title: 'Introduzione',
      content: `La scena si apre presentando il contesto principale della nostra storia. ${userPrompt} inizia a prendere forma mentre introduciamo i personaggi principali e l'ambiente circostante. L'atmosfera è carica di attesa e possibilità.`
    },
    {
      title: 'Sviluppo',
      content: `Approfondiamo gli elementi narrativi mentre i protagonisti iniziano il loro percorso. Gli ostacoli emergono e le relazioni si definiscono. La tensione cresce gradualmente e il pubblico inizia a comprendere le poste in gioco.`
    },
    {
      title: 'Conflitto',
      content: `Raggiungiamo il punto di massima tensione mentre i conflitti centrali emergono pienamente. I personaggi affrontano sfide significative e devono prendere decisioni importanti. Le emozioni sono intense e i dilemmi morali diventano evidenti.`
    },
    {
      title: 'Climax',
      content: `Nel momento culminante, tutte le tensioni convergono verso un punto di svolta decisivo. I protagonisti si trovano di fronte alla sfida definitiva e devono dimostrare la loro crescita interiore. L'azione raggiunge il suo apice di intensità.`
    },
    {
      title: 'Risoluzione',
      content: `Mentre la storia giunge al termine, i conflitti trovano la loro risoluzione e i personaggi completano il loro arco narrativo. L'atmosfera cambia, offrendo una nuova prospettiva e una sensazione di completamento. Il pubblico viene lasciato con un messaggio o un'emozione finale.`
    }
  ];
}

module.exports = {
  generate
};