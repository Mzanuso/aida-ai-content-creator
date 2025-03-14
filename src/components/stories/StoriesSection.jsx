import React from 'react';

const StoriesSection = ({ stories }) => {
  return (
    <section id="stories" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Storie che ispirano
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Scopri come altri creatori hanno dato vita alle loro visioni uniche.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {stories.map((story, index) => (
            <div
              key={story.title}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={story.image} alt={story.title} />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6 dark:bg-gray-700">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Storia
                  </p>
                  <a href="#" className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{story.title}</p>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300">{story.description}</p>
                  </a>
                </div>
                <div className="mt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{story.author}</span>
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        {story.author.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {story.author}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-md bg-gray-100 p-4 dark:bg-gray-600">
                    <blockquote className="italic text-gray-700 dark:text-gray-300">"{story.quote}"</blockquote>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;