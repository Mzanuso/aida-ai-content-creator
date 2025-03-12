import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { projectId } = useParams();
  const location = useLocation();

  // Chiudi la sidebar quando cambia la route (solo su mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Gestisce il toggle della sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} projectId={projectId} />

        {/* Main content */}
        <main 
          className={`flex-1 overflow-y-auto p-4 transition-all duration-300 sm:p-6 lg:ml-64 ${
            isSidebarOpen ? 'lg:ml-0' : ''
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Overlay di sfondo scuro quando la sidebar è aperta (solo su mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default MainLayout;
