import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import ColorPalette from '../../components/style/ColorPalette';
import KeywordSelector from '../../components/style/KeywordSelector';
import StyleGallery from '../../components/style/StyleGallery';

const StylePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Style options
  const [selectedTab, setSelectedTab] = useState('gallery'); // 'gallery', 'palette', 'keywords'
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedColors, setSelectedColors] = useState(['#1A73E8', '#34A853', '#EA4335']);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const projectRef = doc(db, 'projects', projectId);
        const projectSnap = await getDoc(projectRef);
        
        if (!projectSnap.exists()) {
          setError('Progetto non trovato.');
          return;
        }
        
        const projectData = projectSnap.data();
        
        // Verifica che l'utente sia il proprietario del progetto
        if (projectData.userId !== user.uid) {
          setError('Non hai il permesso di accedere a questo progetto.');
          return;
        }
        
        setProject({ id: projectSnap.id, ...projectData });
        
        // Se il progetto ha già delle impostazioni di stile, le carica
        if (projectData.style) {
          if (projectData.style.type === 'gallery' && projectData.style.styleId) {
            setSelectedTab('gallery');
            setSelectedStyle({ id: projectData.style.styleId });
          } else if (projectData.style.type === 'palette' && projectData.style.colors) {
            setSelectedTab('palette');
            setSelectedColors(projectData.style.colors);
          } else if (projectData.style.type === 'keywords' && projectData.style.keywords) {
            setSelectedTab('keywords');
            setSelectedKeywords(projectData.style.keywords);
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Si è verificato un errore nel caricamento del progetto.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, user]);
  
  const handleStyleSelection = (style) => {
    setSelectedStyle(style);
  };
  
  const handleColorChange = (colors) => {
    setSelectedColors(colors);
  };
  
  const handleKeywordChange = (keywords) => {
    setSelectedKeywords(keywords);
  };
  
  const handleSave = async () => {
    if (!projectId || !user) return;
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const projectRef = doc(db, 'projects', projectId);
      
      let styleData = {};
      
      if (selectedTab === 'gallery' && selectedStyle) {
        styleData = {
          type: 'gallery',
          styleId: selectedStyle.id,
          // Aggiungi altre informazioni dello stile necessarie
          name: selectedStyle.name,
          category: selectedStyle.category,
          thumbnailUrl: selectedStyle.thumbnailUrl,
          colors: selectedStyle.colors,
          keywords: selectedStyle.keywords,
        };
      } else if (selectedTab === 'palette') {
        styleData = {
          type: 'palette',
          colors: selectedColors,
        };
      } else if (selectedTab === 'keywords') {
        styleData = {
          type: 'keywords',
          keywords: selectedKeywords,
        };
      }
      
      await updateDoc(projectRef, {
        style: styleData,
        updatedAt: serverTimestamp(),
      });
      
      setMessage({
        type: 'success',
        text: 'Stile salvato con successo!',
      });
      
      // Aggiorna il progetto in locale
      setProject(prev => ({ ...prev, style: styleData }));
      
      // Dopo un breve ritardo, naviga alla pagina successiva
      setTimeout(() => {
        navigate(`/projects/${projectId}/storytelling`);
      }, 1500);
    } catch (err) {
      console.error('Error saving style:', err);
      setMessage({
        type: 'error',
        text: 'Si è verificato un errore durante il salvataggio dello stile.',
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Alert variant="error" className="max-w-md">
          {error}
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Seleziona lo stile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Scegli lo stile visivo per il tuo video "{project?.title || 'Nuovo Progetto'}"
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
            disabled={
              (selectedTab === 'gallery' && !selectedStyle) ||
              (selectedTab === 'keywords' && selectedKeywords.length === 0)
            }
          >
            Salva e Continua
          </Button>
        </div>
      </div>
      
      {message.text && (
        <Alert
          variant={message.type}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}
      
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  selectedTab === 'gallery'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                onClick={() => setSelectedTab('gallery')}
              >
                Galleria stili
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  selectedTab === 'palette'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                onClick={() => setSelectedTab('palette')}
              >
                Palette colori
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  selectedTab === 'keywords'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                onClick={() => setSelectedTab('keywords')}
              >
                Parole chiave
              </button>
            </li>
          </ul>
        </div>
        
        {selectedTab === 'gallery' && (
          <StyleGallery onSelectStyle={handleStyleSelection} />
        )}
        
        {selectedTab === 'palette' && (
          <ColorPalette onChange={handleColorChange} initialColors={selectedColors} />
        )}
        
        {selectedTab === 'keywords' && (
          <KeywordSelector onChange={handleKeywordChange} initialKeywords={selectedKeywords} />
        )}
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={saving}
          disabled={
            (selectedTab === 'gallery' && !selectedStyle) ||
            (selectedTab === 'keywords' && selectedKeywords.length === 0)
          }
        >
          Salva e Continua
        </Button>
      </div>
    </div>
  );
};

export default StylePage;
