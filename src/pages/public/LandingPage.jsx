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
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 shadow-md' : 'bg-transparent'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">AIDA</span>
              </div>
              <nav className="ml-10 hidden space-x-8 md:flex">
                <a href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Funzionalità</a>
                <a href="#examples" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Esempi</a>
                <a href="#cta" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Inizia ora</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                aria-label={darkMode ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
              >
                {darkMode ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
              {user ? (
                <Link to="/dashboard">
                  <Button variant="primary">Dashboard</Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline">Accedi</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary">Registrati</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Updated with new human-centered messaging */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">La tua storia è unica.</span>
                <span className="block text-blue-400">Raccontala come merita.</span>
              </h1>
              <p className="mt-4 text-xl text-gray-300">
                Sii te stesso. Noi ti aiutiamo a brillare.
              </p>
              <p className="mt-4 text-lg text-gray-400">
                AIDA ti guida passo dopo passo nella creazione di video che esprimono la tua autenticità, con un assistente sempre pronto ad aiutarti.
              </p>
              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="primary" size="lg">
                      Vai alla dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant="primary" size="lg">
                      Inizia a creare
                    </Button>
                  </Link>
                )}
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800 px-5 py-3 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Scopri di più
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg sm:h-72 md:h-80 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-4">
                    <svg className="h-24 w-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 8l6 4-6 4V8z" />
                    </svg>
                    <span className="text-lg font-medium text-white">La tua espressione, la nostra passione</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between rounded-md bg-black/30 p-2 backdrop-blur-sm">
                  <div className="h-2 w-2/3 rounded-full bg-white"></div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <div className="h-2 w-2 rounded-full bg-white/50"></div>
                    <div className="h-2 w-2 rounded-full bg-white/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated to focus on creative journey */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Il tuo viaggio creativo
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Ogni fase è un'opportunità per esprimere la tua visione personale.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {creativeJourneySteps.map((step, index) => (
              <div 
                key={step.title} 
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {`${index + 1}. ${step.title}`}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storie che ispirano Section - NEW */}