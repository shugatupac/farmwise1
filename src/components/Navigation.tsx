import { Cat, Flower2, LayoutDashboard, Settings, Sprout, SquareCheck } from 'lucide-react';
import { useAppStore, TabType } from '../store/appStore';

const Navigation = () => {
  const { activeTab, setActiveTab } = useAppStore();

  const tabs: { id: TabType; label: string; icon: JSX.Element }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      id: 'crops', 
      label: 'Crops', 
      icon: <Sprout className="w-5 h-5" /> 
    },
    { 
      id: 'gardenBeds', 
      label: 'Garden Beds', 
      icon: <Flower2 className="w-5 h-5" /> 
    },
    { 
      id: 'animals', 
      label: 'Animals', 
      icon: <Cat className="w-5 h-5" /> 
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: <SquareCheck className="w-5 h-5" /> 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
