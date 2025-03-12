import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    // Il redirect a /login avverrà automaticamente grazie al ProtectedRoute in App.jsx
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950 sm:px-6">
      {/* Menu button (mobile) */}
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus-visible:outline-none dark:text-gray-400 dark:hover:text-gray-50 lg:hidden"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Chiudi menu' : 'Apri menu'}
      >
        {isSidebarOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Logo */}
      <Link to="/dashboard" className="mr-auto flex items-center gap-2 lg:ml-0">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-500">AIDA</span>
      </Link>

      {/* Right section with theme toggle and user menu */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          onClick={toggleDarkMode}
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

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <span className="sr-only">Apri menu utente</span>
            <div className="relative h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {user?.displayName ? user.displayName.substring(0, 1).toUpperCase() : user?.email?.substring(0, 1).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="hidden text-sm font-medium text-gray-900 dark:text-gray-50 md:block">
              {user?.displayName || user?.email?.split('@')[0]}
            </span>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{user?.displayName}</p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                Profilo
              </Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                Impostazioni
              </Link>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Esci
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
