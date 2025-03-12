const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * Genera uno storyboard basato sulla sceneggiatura
 * @param {Object} data - Dati di input (script e styleInfo)
 * @param {string} userId - ID dell'utente autenticato
 * @return {Promise<Object>} - Risultato della generazione dello storyboard
 */
async function generate(data, userId) {
  const { script, styleInfo, projectId } = data;
  
  if (!script || !script.parts || script.parts.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'La sceneggiatura non può essere vuota'
    );
  }
  
  try {
    // In un'implementazione reale, qui ci sarebbe la chiamata a GoAPI
    // per utilizzare l'AI "Agente regista"
    // Per ora, simuliamo la risposta
    
    // Prepara il prompt per l'AI
    const aiPrompt = buildPrompt(script, styleInfo);
    
    // Simula la generazione dei prompt per Midjourney
    const midjourneyPrompts = generateMidjourneyPrompts(script, styleInfo);
    
    // Simula la generazione delle direzioni di regia
    const directions = generateDirections(script, styleInfo);
    
    // Simula la generazione del prompt per la musica
    const musicPrompt = generateMusicPrompt(script, styleInfo);
    
    // Salva lo storyboard nel database
    const projectRef = db.collection('projects').doc(projectId);
    
    await projectRef.update({
      storyboard: {
        midjourneyPrompts,
        directions,
        musicPrompt,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { 
      success: true, 
      storyboard: {
        midjourneyPrompts,
        directions,
        musicPrompt
      }
    };
  } catch (error) {
    console.error('Errore nella generazione dello storyboard:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Errore durante la generazione dello storyboard',
      error.message
    );
  }
}

/**
 * Costruisce il prompt per l'AI
 * @param {Object} script - Sceneggiatura
 * @param {Object} styleInfo - Informazioni sullo stile
 * @return {string} - Prompt completo per l'AI
 */
function buildPrompt(script, styleInfo) {
  let prompt = `Sei un "Agente regista" specializzato in regia, fotografia e prompt engineering per Midjourney. `;
  prompt += `Analizzerai una sceneggiatura e svilupperai uno storyboard dettagliato con prompts per Midjourney. `;
  
  prompt += `La sceneggiatura è divisa in queste parti:\n`;
  
  script.parts.forEach((part, index) => {
    prompt += `${index + 1}. ${part.title}: ${part.content}\n`;
  });
  
  if (styleInfo && styleInfo.keywords && styleInfo.keywords.length > 0) {
    prompt += `\nLo stile deve riflettere queste keywords: ${styleInfo.keywords.join(', ')}. `;
  }
  
  if (styleInfo && styleInfo.rgbColors && styleInfo.rgbColors.length > 0) {
    prompt += `\nLa palette colori di riferimento include: ${styleInfo.rgbColors.join(', ')}. `;
  }
  
  prompt += `\nCrea 6-12 prompt per Midjourney che raccontino visivamente questa storia. `;
  prompt += `Per ogni scena, specifica anche i movimenti di camera, le luci e altri dettagli tecnici. `;
  prompt += `Infine, crea un prompt per la generazione di musica che accompagni il video.`;
  
  return prompt;
}

/**
 * Genera i prompt per Midjourney (simulazione)
 * @param {Object} script - Sceneggiatura
 * @param {Object} styleInfo - Informazioni sullo stile
 * @return {Array<Object>} - Prompt per Midjourney
 */
function generateMidjourneyPrompts(script, styleInfo) {
  // In un'implementazione reale, questo verrebbe sostituito dalla risposta dell'AI
  const basePrompts = [
    {
      description: "Inquadratura iniziale ampia che stabilisce l'ambientazione",
      prompt: "Wide establishing shot of [setting based on script], [time of day], atmospheric lighting, [style keywords], --ar 16:9"
    },
    {
      description: "Primo piano del protagonista principale",
      prompt: "Close-up portrait of the main character, [emotional state], [style keywords], cinematic lighting, shallow depth of field, --ar 16:9"
    },
    {
      description: "Momento di conflitto o tensione",
      prompt: "Dramatic scene showing conflict, intense emotions, [style keywords], dynamic composition, cinematic lighting, --ar 16:9"
    },
    {
      description: "Dettaglio significativo",
      prompt: "Extreme close-up of important detail or object, [style keywords], dramatic lighting, symbolism, --ar 16:9"
    },
    {
      description: "Momento di climax o cambiamento",
      prompt: "Climactic moment, dramatic action, [style keywords], powerful composition, cinematic lighting, --ar 16:9"
    },
    {
      description: "Inquadratura finale risolutiva",
      prompt: "Final resolving shot, [emotional tone], [style keywords], balanced composition, symbolic lighting, --ar 16:9"
    }
  ];
  
  // Personalizza i prompt in base alla sceneggiatura e allo stile
  return basePrompts.map(promptObj => {
    // Sostituisci i placeholder con informazioni reali dello stile
    let updatedPrompt = promptObj.prompt;
    
    if (styleInfo && styleInfo.keywords && styleInfo.keywords.length > 0) {
      // Prendi fino a 3 keywords casuali
      const selectedKeywords = styleInfo.keywords
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .join(', ');
      
      updatedPrompt = updatedPrompt.replace('[style keywords]', selectedKeywords);
    } else {
      updatedPrompt = updatedPrompt.replace('[style keywords]', 'artistic, detailed, cinematic');
    }
    
    return {
      ...promptObj,
      prompt: updatedPrompt
    };
  });
}

/**
 * Genera le direzioni di regia (simulazione)
 * @param {Object} script - Sceneggiatura
 * @param {Object} styleInfo - Informazioni sullo stile
 * @return {Array<Object>} - Direzioni di regia
 */
function generateDirections(script, styleInfo) {
  // In un'implementazione reale, questo verrebbe sostituito dalla risposta dell'AI
  return script.parts.map((part, index) => ({
    sceneNumber: index + 1,
    title: part.title,
    cameraMovement: ['static shot', 'slow pan', 'tracking shot', 'dolly zoom', 'crane shot'][index % 5],
    lighting: ['naturalistic', 'high contrast', 'soft diffused', 'dramatic', 'silhouette'][index % 5],
    mood: ['serene', 'tense', 'mysterious', 'joyful', 'melancholic'][index % 5],
    notes: `Questa scena rappresenta ${part.title.toLowerCase()} della storia. Enfatizzare l'emozione attraverso composizione e inquadratura.`
  }));
}

/**
 * Genera il prompt per la musica (simulazione)
 * @param {Object} script - Sceneggiatura
 * @param {Object} styleInfo - Informazioni sullo stile
 * @return {string} - Prompt per la musica
 */
function generateMusicPrompt(script, styleInfo) {
  // In un'implementazione reale, questo verrebbe sostituito dalla risposta dell'AI
  return `Crea una colonna sonora cinematografica che evolve attraverso 5 fasi emotive: 
1. Introduzione - atmosfera contemplativa e d'attesa
2. Sviluppo - crescendo di tensione e mistero
3. Conflitto - intensità emotiva al culmine
4. Climax - momento di svolta drammatico
5. Risoluzione - conclusione riflessiva e catartica

La musica dovrebbe incorporare elementi [strumenti e stile basati sul contesto della storia] con una durata complessiva di circa 2 minuti.`;
}

module.exports = {
  generate
};