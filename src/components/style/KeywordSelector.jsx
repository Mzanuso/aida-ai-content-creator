import React, { useState } from 'react';

// Lista di parole chiave comuni per stili visivi
const suggestionCategories = {
  'Stili artistici': [
    'Impressionismo', 'Minimalismo', 'Pop Art', 'Astratto', 'Retrò', 
    'Vintage', 'Surrealismo', 'Cubismo', 'Art Deco', 'Futuristico',
    'Gotico', 'Barocco', 'Realismo', 'Espressionismo', 'Anime'
  ],
  'Mood': [
    'Calmo', 'Energico', 'Sereno', 'Allegro', 'Malinconico', 
    'Drammatico', 'Misterioso', 'Romantico', 'Nostalgico', 'Etereo', 
    'Oscuro', 'Luminoso', 'Tranquillo', 'Intenso', 'Vibrante'
  ],
  'Texture e Materiali': [
    'Legno', 'Metallo', 'Vetro', 'Acqua', 'Pietra', 
    'Tessuto', 'Carta', 'Ceramica', 'Velluto', 'Sabbia',
    'Marmo', 'Cemento', 'Plastica', 'Pelle', 'Cristallo'
  ],
};

const KeywordSelector = ({ onChange, initialKeywords = ['', '', ''], maxKeywords = 3 }) => {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [activeCategory, setActiveCategory] = useState('Stili artistici');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleKeywordChange = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
    
    if (onChange) {
      onChange(newKeywords.filter(k => k.trim() !== ''));
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    // Trova il primo slot vuoto o sostituisci il primo se tutti sono pieni
    const emptyIndex = keywords.findIndex(k => k.trim() === '');
    const indexToUpdate = emptyIndex !== -1 ? emptyIndex : 0;
    
    // Verifica che la parola chiave non sia già presente
    if (!keywords.includes(suggestion)) {
      handleKeywordChange(indexToUpdate, suggestion);
    }
  };
  
  const removeKeyword = (index) => {
    handleKeywordChange(index, '');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">Parole Chiave</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Seleziona fino a {maxKeywords} parole chiave</span>
      </div>
      
      <div className="space-y-2">
        {keywords.map((keyword, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(index, e.target.value)}
              placeholder={`Parola chiave ${index + 1}`}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="ml-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div>
        <button
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {showSuggestions ? 'Nascondi suggerimenti' : 'Mostra suggerimenti'}
        </button>
      </div>
      
      {showSuggestions && (
        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4">
            <div className="flex space-x-2 overflow-x-auto">
              {Object.keys(suggestionCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${
                    activeCategory === category
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {suggestionCategories[activeCategory].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  keywords.includes(suggestion)
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                disabled={keywords.includes(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordSelector;
