import { createContext, useContext, useState, useEffect } from 'react'
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, displayName) {
    try {
      // Creare un nuovo utente con email e password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Aggiornare il profilo con il displayName
      await updateProfile(user, { displayName })
      
      // Creare un documento utente in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName,
        createdAt: new Date().toISOString(),
        photoURL: null,
        projects: []
      })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function updateUserEmail(email) {
    return updateEmail(auth.currentUser, email)
  }

  function updateUserPassword(password) {
    return updatePassword(auth.currentUser, password)
  }

  async function updateUserProfile(data) {
    try {
      const updates = {}
      if (data.displayName) {
        updates.displayName = data.displayName
        await updateProfile(auth.currentUser, { displayName: data.displayName })
      }
      
      // Aggiorna i dati in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await setDoc(userRef, { ...data }, { merge: true })
      
      // Aggiorna lo stato locale
      const docSnap = await getDoc(userRef)
      if (docSnap.exists()) {
        setUserData(docSnap.data())
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Carica i dati dell'utente da Firestore
        const userRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(userRef)
        
        if (docSnap.exists()) {
          setUserData(docSnap.data())
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })
    
    return unsubscribe
  }, [])

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}