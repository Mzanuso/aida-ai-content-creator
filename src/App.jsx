import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Layout
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pagine pubbliche
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Pagine protette
import DashboardPage from './pages/dashboard/DashboardPage'
import ProjectsPage from './pages/projects/ProjectsPage'
import ProjectPage from './pages/projects/ProjectPage'
import StylePage from './pages/editor/StylePage'
import StorytellingPage from './pages/editor/StorytellingPage'
import StoryboardPage from './pages/editor/StoryboardPage'
import VideoPage from './pages/editor/VideoPage'

// Componente per le rotte protette
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Caricamento...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* Rotte pubbliche */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Rotte protette */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="/projects/:projectId/style" element={<StylePage />} />
        <Route path="/projects/:projectId/storytelling" element={<StorytellingPage />} />
        <Route path="/projects/:projectId/storyboard" element={<StoryboardPage />} />
        <Route path="/projects/:projectId/video" element={<VideoPage />} />
      </Route>
      
      {/* Rotta di fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App