import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/ui/Button';

const LandingPage = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated features focusing on the creative journey rather than technology
  const creativeJourneySteps = [
    {
      title: 'Scegli il tuo stile',
      description: 'Trova l\'estetica visiva che parla del tuo mondo interiore e riflette la tua visione unica.',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: 'Racconta la tua storia',
      description: 'Dai voce alla tua creatività e alle tue emozioni attraverso una narrazione che cattura l\'essenza di ciò che vuoi condividere.',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Visualizza le scene',
      description: 'Trasforma le parole in immagini evocative che danno vita alla tua visione e rendono tangibile la tua storia.',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Crea il tuo video',
      description: 'Vedi la tua storia prendere vita attraverso un video che riflette autenticamente la tua espressione personale.',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  // Example stories that inspire others
  const storiesData = [
    {
      title: "Il viaggio di Marco",
      author: "Marco B.",
      description: "Da un'idea semplice a un documentario che ha toccato il cuore di molti. Una testimonianza visiva dell'Italia rurale.",
      quote: "AIDA mi ha aiutato a trasformare i miei ricordi in una storia che potessi condividere con tutti.",
      image: "https://via.placeholder.com/600x400/1a1a2e/ffffff?text=Marco",
    },
    {
      title: "Memorie di domani",
      author: "Giulia T.",
      description: "Una riflessione poetica sul patrimonio familiare e il passaggio delle tradizioni attraverso le generazioni.",
      quote: "Ho potuto mostrare la bellezza delle nostre tradizioni senza perdermi nei dettagli tecnici.",
      image: "https://via.placeholder.com/600x400/16213e/ffffff?text=Giulia",
    },
    {
      title: "Ritmi urbani",
      author: "Alessandro P.",
      description: "La vita quotidiana di una metropoli, raccontata attraverso gli occhi di chi la vive ogni giorno.",
      quote: "Con AIDA ho potuto finalmente esprimere ciò che vedo ogni giorno nella mia città.",
      image: "https://via.placeholder.com/600x400/0f3460/ffffff?text=Alessandro",
    }
  ];

  return (
    <div>
      {/* Header */}