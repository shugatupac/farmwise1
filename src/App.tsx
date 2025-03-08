import { useEffect } from 'react';
import './index.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Crops from './components/Crops';
import Animals from './components/Animals';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import GardenBeds from './components/GardenBeds.tsx';
import { useAppStore } from './store/appStore';

function App() {
  const { activeTab, initializeFromStorage } = useAppStore();
  
  useEffect(() => {
    // Load Google Font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Initialize data from localStorage
    initializeFromStorage();
    
    return () => {
      document.head.removeChild(link);
    };
  }, [initializeFromStorage]);

  // Render the active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'crops':
        return <Crops />;
      case 'animals':
        return <Animals />;
      case 'tasks':
        return <Tasks />;
      case 'settings':
        return <Settings />;
      case 'gardenBeds':
        return <GardenBeds />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 3L21 9V21H3V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="text-xl font-semibold text-gray-800">FarmWise</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">Welcome, Farmer</div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">F</div>
          </div>
        </div>
      </header>
      
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © 2023 FarmWise — Your complete farm management solution
        </div>
      </footer>
    </div>
  );
}

export default App;
