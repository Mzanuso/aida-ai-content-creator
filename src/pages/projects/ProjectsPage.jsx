import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, startAfter, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const projectsPerPage = 12;

  const fetchProjects = async (isLoadMore = false) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let projectsQuery = query(
        collection(db, 'projects'),
        where('userId', '==', user.uid),
        orderBy(sortBy, sortDirection),
        limit(projectsPerPage)
      );

      if (isLoadMore && lastVisible) {
        projectsQuery = query(
          collection(db, 'projects'),
          where('userId', '==', user.uid),
          orderBy(sortBy, sortDirection),
          startAfter(lastVisible),
          limit(projectsPerPage)
        );
      }

      const querySnapshot = await getDocs(projectsQuery);
      
      if (querySnapshot.empty) {
        setHasMoreProjects(false);
        if (!isLoadMore) {
          setProjects([]);
        }
        return;
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);

      const fetchedProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      if (isLoadMore) {
        setProjects(prev => [...prev, ...fetchedProjects]);
      } else {
        setProjects(fetchedProjects);
      }

      setHasMoreProjects(fetchedProjects.length === projectsPerPage);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Impossibile caricare i progetti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user, sortBy, sortDirection]);

  const handleLoadMore = () => {
    fetchProjects(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In un'app reale, qui si implementerebbe la ricerca in Firestore
    // Per ora implementiamo una ricerca locale
    // In un'app reale con molti progetti, è meglio usare Algolia o un altro servizio di ricerca
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      await deleteDoc(doc(db, 'projects', selectedProject.id));
      
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
      
      setMessage({
        type: 'success',
        text: `Progetto "${selectedProject.title}" eliminato con successo.`,
      });
      
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting project:', err);
      setMessage({
        type: 'error',
        text: 'Si è verificato un errore durante l\'eliminazione del progetto.',
      });
    }
  };

  // Filtra i progetti in base al termine di ricerca
  const filteredProjects = searchTerm 
    ? projects.filter(project => 
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">I tuoi progetti</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestisci e organizza tutti i tuoi progetti video.
          </p>
        </div>
        <Link to="/projects/new">
          <Button variant="primary">
            Nuovo Progetto
          </Button>
        </Link>
      </div>
      
      {message.text && (
        <Alert
          variant={message.type}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}
      
      {/* Search and filters */}
      <div className="rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per titolo o descrizione..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Sort controls */}
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-700 dark:text-gray-300">Ordina per:</label>
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="updatedAt-desc">Ultimo aggiornamento</option>
              <option value="updatedAt-asc">Primo aggiornamento</option>
              <option value="createdAt-desc">Più recenti</option>
              <option value="createdAt-asc">Meno recenti</option>
              <option value="title-asc">Titolo (A-Z)</option>
              <option value="title-desc">Titolo (Z-A)</option>
            </select>
          </div>
        </form>
      </div>
      
      {/* Projects list */}
      {loading && projects.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : filteredProjects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
          <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Nessun progetto trovato con questi criteri di ricerca.' : 'Non hai ancora creato alcun progetto.'}
          </p>
          <Link to="/projects/new" className="mt-4">
            <Button>Crea il tuo primo progetto</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
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
                
                {/* Status badge */}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {project.status === 'completed' ? 'Completato' : 'In corso'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {project.title || 'Progetto senza titolo'}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {project.description || 'Nessuna descrizione'}
                </p>
                
                <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ultimo aggiornamento: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              
              <div className="flex border-t border-gray-200 dark:border-gray-700">
                <Link
                  to={`/projects/${project.id}`}
                  className="flex flex-1 items-center justify-center p-3 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visualizza
                </Link>
                <button
                  onClick={() => openDeleteModal(project)}
                  className="flex items-center justify-center p-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Load more button */}
      {hasMoreProjects && filteredProjects.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            isLoading={loading}
          >
            Carica altri progetti
          </Button>
        </div>
      )}
      
      {/* Delete modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Conferma eliminazione
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sei sicuro di voler eliminare il progetto "{selectedProject?.title || 'Senza titolo'}"? Questa azione non può essere annullata.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
              >
                Annulla
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteProject}
              >
                Elimina
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
