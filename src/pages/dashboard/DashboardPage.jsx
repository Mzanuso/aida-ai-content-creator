import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Button from '../../components/ui/Button';

const DashboardPage = () => {
  const { user, userData } = useAuth();
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const projectsRef = collection(db, 'projects');
        const q = query(
          projectsRef, 
          where('userId', '==', user.uid),
          orderBy('updatedAt', 'desc'),
          limit(3)
        );

        const querySnapshot = await getDocs(q);
        
        const projects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRecentProjects(projects);
      } catch (err) {
        console.error('Error fetching recent projects:', err);
        setError('Impossibile caricare i progetti recenti.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, [user]);

  // Statistiche di esempio (in un'app reale, queste verrebbero dal backend)
  const stats = [
    { name: 'Progetti Totali', value: recentProjects.length || 0 },
    { name: 'Progetti Completati', value: 0 },
    { name: 'Video Generati', value: 0 },
    { name: 'Spazio Utilizzato', value: '0 MB' },
  ];

  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Benvenuto, {userData?.displayName || user?.email?.split('@')[0] || 'Utente'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Ecco un riepilogo dei tuoi progetti e delle tue attività recenti.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Progetti Recenti</h2>
          <Link to="/projects">
            <Button variant="outline" size="sm">
              Vedi tutti
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
            <svg className="h-8 w-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
                Riprova
              </Button>
            </div>
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
            <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Non hai ancora creato alcun progetto.</p>
            <Link to="/projects/new" className="mt-4">
              <Button>Crea il tuo primo progetto</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex flex-col rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="h-40 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {project.title || 'Progetto senza titolo'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.description?.substring(0, 100) || 'Nessuna descrizione'}
                    {project.description?.length > 100 ? '...' : ''}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {project.status || 'In corso'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {project.updatedAt ? new Date(project.updatedAt.toDate()).toLocaleDateString() : 'Data sconosciuta'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Azioni Rapide</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Link
            to="/projects/new"
            className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nuovo Progetto</span>
          </Link>
          
          <Link
            to="/tutorials"
            className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Tutorial</span>
          </Link>
          
          <Link
            to="/settings"
            className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Impostazioni</span>
          </Link>
          
          <Link
            to="/help"
            className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aiuto</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
