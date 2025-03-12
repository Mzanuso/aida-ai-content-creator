import React, { useState } from 'react';

const ColorPalette = ({ onChange, initialColors = ['#1A73E8', '#34A853', '#EA4335'] }) => {
  const [colors, setColors] = useState(initialColors);

  const handleColorChange = (index, color) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
    
    if (onChange) {
      onChange(newColors);
    }
  };

  // Funzione per convertire hex a RGB per visualizzazione
  const hexToRgb = (hex) => {
    // Rimuovi il # se presente
    hex = hex.replace('#', '');
    
    // Converti a RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `RGB(${r}, ${g}, ${b})`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">Palette di Colori</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Seleziona 3 colori</span>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {colors.map((color, index) => (
          <div key={index} className="w-full sm:w-auto">
            <div 
              className="mb-2 h-16 w-full rounded-md sm:w-24"
              style={{ backgroundColor: color }}
            ></div>
            <div className="flex flex-col space-y-1">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="h-8 w-full cursor-pointer rounded-md border border-gray-300 p-0 dark:border-gray-700"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {hexToRgb(color)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-2 font-medium text-gray-900 dark:text-white">Anteprima Palette</div>
        <div className="flex h-12 w-full overflow-hidden rounded-md">
          {colors.map((color, index) => (
            <div
              key={index}
              className="h-full flex-1"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
