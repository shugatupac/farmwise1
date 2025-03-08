import { useState } from 'react';
import { useAppStore, FarmSettings } from '../store/appStore';
import { Save } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useAppStore();
  const [formData, setFormData] = useState<FarmSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'size' ? Number(value) : value
    }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    
    // Reset the saved message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Farm Settings</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Farm Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="form-label">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                className="form-input"
                value={formData.ownerName}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Farm Size</label>
                <input
                  type="number"
                  name="size"
                  className="form-input"
                  value={formData.size}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              
              <div>
                <label className="form-label">Unit</label>
                <select
                  name="sizeUnit"
                  className="form-input"
                  value={formData.sizeUnit}
                  onChange={handleChange}
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </button>
          </div>
          
          {isSaved && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md text-center">
              Settings saved successfully!
            </div>
          )}
        </form>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-medium mb-4">About Farm Manager</h2>
        <p className="text-gray-600 mb-4">
          Farm Manager is a comprehensive solution designed to help farmers manage their operations
          more efficiently. Track crops, animals, and tasks all in one place.
        </p>
        <p className="text-gray-600">
          Version 1.0.0 | © 2023 Farm Manager
        </p>
      </div>
    </div>
  );
};

export default Settings;
