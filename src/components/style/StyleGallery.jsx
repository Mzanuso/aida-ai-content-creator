import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';

const StyleGallery = ({ onSelectStyle }) => {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
  });

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setLoading(true);
        setError(null);

        // In un'applicazione reale, queste verrebbero caricate da Firestore
        // Questo è un placeholder per mostrare come funzionerebbe l'UI
        const stylesCollection = collection(db, 'styles');
        const stylesQuery = query(stylesCollection, orderBy('createdAt', 'desc'), limit(20));
        
        // Per ora creiamo dei dati simulati
        const mockStyles = [
          {
            id: 'sref_96616859',
            name: 'Serene Coastal',
            category: 'Landscape',
            thumbnailUrl: 'https://via.placeholder.com/300x200/4682B4/FFFFFF?text=Coastal',
            keywords: ['Coastal', 'Serene', 'Aquatic'],
            colors: ['#4682B4', '#87CEEB', '#F5F5F5'],
          },
          {
            id: 'sref_78459201',
            name: 'Urban Night',
            category: 'Urban',
            thumbnailUrl: 'https://via.placeholder.com/300x200/1A1A2E/FFFFFF?text=Urban+Night',
            keywords: ['Urban', 'Night', 'Neon'],
            colors: ['#1A1A2E', '#E94560', '#16213E'],
          },
          {
            id: 'sref_36521478',
            name: 'Vibrant Nature',
            category: 'Nature',
            thumbnailUrl: 'https://via.placeholder.com/300x200/228B22/FFFFFF?text=Nature',
            keywords: ['Nature', 'Vibrant', 'Lush'],
            colors: ['#228B22', '#ADFF2F', '#006400'],
          },
          {
            id: 'sref_12547896',
            name: 'Minimalist Studio',
            category: 'Interior',
            thumbnailUrl: 'https://via.placeholder.com/300x200/E0E0E0/000000?text=Minimalist',
            keywords: ['Minimalist', 'Clean', 'Modern'],
            colors: ['#FFFFFF', '#E0E0E0', '#000000'],
          },
          {
            id: 'sref_45632187',
            name: 'Abstract Art',
            category: 'Abstract',
            thumbnailUrl: 'https://via.placeholder.com/300x200/FF5733/FFFFFF?text=Abstract',
            keywords: ['Abstract', 'Colorful', 'Geometric'],
            colors: ['#FF5733', '#FFC300', '#DAF7A6'],
          },
          {
            id: 'sref_89756412',
            name: 'Vintage Film',
            category: 'Film',
            thumbnailUrl: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Vintage+Film',
            keywords: ['Vintage', 'Film', 'Retro'],
            colors: ['#8B4513', '#D2B48C', '#F5DEB3'],
          },
          {
            id: 'sref_12345678',
            name: 'Neon Future',
            category: 'Futuristic',
            thumbnailUrl: 'https://via.placeholder.com/300x200/8A2BE2/FFFFFF?text=Neon+Future',
            keywords: ['Neon', 'Futuristic', 'Cyberpunk'],
            colors: ['#8A2BE2', '#00FFFF', '#FF00FF'],
          },
          {
            id: 'sref_87654321',
            name: 'Pastel Dream',
            category: 'Abstract',
            thumbnailUrl: 'https://via.placeholder.com/300x200/FFB6C1/000000?text=Pastel',
            keywords: ['Pastel', 'Soft', 'Dreamy'],
            colors: ['#FFB6C1', '#ADD8E6', '#FFDAB9'],
          },
        ];
        
        setStyles(mockStyles);
      } catch (err) {
        console.error('Error fetching styles:', err);
        setError('Impossibile caricare gli stili.');
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    if (onSelectStyle) {
      onSelectStyle(style);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (category) => {
    setFilters({ ...filters, category });
  };

  // Filtra gli stili in base alla ricerca e ai filtri
  const filteredStyles = styles.filter((style) => {
    const matchesSearch = 
      style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      style.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filters.category === 'all' || style.category === filters.category;
    
    return matchesSearch && matchesCategory;
  });

  // Estrai tutte le categorie uniche per i filtri
  const categories = ['all', ...new Set(styles.map(style => style.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">Galleria Stili</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredStyles.length} stili disponibili
        </span>
      </div>
      
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cerca stili per nome o parole chiave..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${
                filters.category === category
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category === 'all' ? 'Tutte le categorie' : category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Style grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
            <button
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Riprova
            </button>
          </div>
        </div>
      ) : filteredStyles.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Nessuno stile trovato.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filteredStyles.map((style) => (
            <div
              key={style.id}
              onClick={() => handleStyleSelect(style)}
              className={`group cursor-pointer overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${
                selectedStyle?.id === style.id ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
              }`}
            >
              <div className="aspect-w-3 aspect-h-2 relative overflow-hidden">
                <img
                  src={style.thumbnailUrl}
                  alt={style.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex space-x-1">
                    {style.colors.map((color, index) => (
                      <div
                        key={index}
                        className="h-4 w-4 rounded-full border border-white"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{style.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {style.category}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {style.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleGallery;
