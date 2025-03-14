import React from 'react';

const StyleGallery = ({ styles }) => {
  return (
    <section id="styles" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trova il tuo stile unico
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Lasciati ispirare da mondi visivi che risuonano con la tua sensibilità.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {styles.map((style, index) => (
            <div 
              key={style.name}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={style.image}
                  alt={style.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-xl font-semibold">{style.name}</h3>
                <p className="mt-2 text-sm text-gray-200">{style.description}</p>
                <div className="mt-3 flex space-x-2">
                  {style.colors.map((color, colorIndex) => (
                    <div 
                      key={colorIndex} 
                      className="h-5 w-5 rounded-full" 
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleGallery;