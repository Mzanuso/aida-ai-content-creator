import { functions } from './firebase'
import { httpsCallable } from 'firebase/functions'

// Questo file contiene tutte le chiamate alle Cloud Functions di Firebase
// che interagiscono con servizi esterni come GoAPI, Midjourney, ecc.

// Agente scrittore: genera una sceneggiatura basata su un input dell'utente
export async function generateScript(prompt, styleInfo) {
  try {
    const generateScriptFn = httpsCallable(functions, 'generateScript')
    const result = await generateScriptFn({ prompt, styleInfo })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error generating script:', error)
    return { success: false, error: error.message }
  }
}

// Agente regista: genera prompts per Midjourney basati sulla sceneggiatura
export async function generateStoryboard(script, styleInfo) {
  try {
    const generateStoryboardFn = httpsCallable(functions, 'generateStoryboard')
    const result = await generateStoryboardFn({ script, styleInfo })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error generating storyboard:', error)
    return { success: false, error: error.message }
  }
}

// Genera immagini con Midjourney
export async function generateImages(prompts, styleInfo) {
  try {
    const generateImagesFn = httpsCallable(functions, 'generateImages')
    const result = await generateImagesFn({ prompts, styleInfo })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error generating images:', error)
    return { success: false, error: error.message }
  }
}

// Genera video da immagini
export async function generateVideos(images, directions) {
  try {
    const generateVideosFn = httpsCallable(functions, 'generateVideos')
    const result = await generateVideosFn({ images, directions })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error generating videos:', error)
    return { success: false, error: error.message }
  }
}

// Genera voce narrante con servizi AI
export async function generateVoiceover(script, voice) {
  try {
    const generateVoiceoverFn = httpsCallable(functions, 'generateVoiceover')
    const result = await generateVoiceoverFn({ script, voice })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error generating voiceover:', error)
    return { success: false, error: error.message }
  }
}

// Genera colonna sonora
export async function generateSoundtrack(mood, length) {
  try {
    const generateSoundtrackFn = httpsCallable(functions, 'generateSoundtrack')
    const result = await generateSoundtrackFn({ mood, length })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error generating soundtrack:', error)
    return { success: false, error: error.message }
  }
}