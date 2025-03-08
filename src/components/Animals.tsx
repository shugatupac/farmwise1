import { useState } from 'react';
import { useAppStore, Animal } from '../store/appStore';
import { ArrowUpDown, Check, Droplets, Egg, Filter, Pencil, Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Animals = () => {
  const { animals, addAnimal, updateAnimal, deleteAnimal, recordAnimalProduction, recordFeedingEvent } = useAppStore();
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState<string | null>(null);
  const [recordingProduction, setRecordingProduction] = useState<{id: string, type: string} | null>(null);
  const [productionAmount, setProductionAmount] = useState(0);
  const [feedingAnimal, setFeedingAnimal] = useState<string | null>(null);
  const [feedData, setFeedData] = useState({ type: '', amount: 0 });
  const [addingToMainFarm, setAddingToMainFarm] = useState(false);
  
  const [newAnimal, setNewAnimal] = useState<Omit<Animal, 'id'>>({
    name: '',
    type: '',
    breed: '',
    birthDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'healthy',
    notes: '',
    productionType: 'eggs',
    feedType: '',
    feedConsumption: 0,
    lastFedDate: format(new Date(), 'yyyy-MM-dd'),
    productionStats: {
      eggsCollected: 0,
      lastCollection: ''
    }
  });

  const handleAddAnimal = () => {
    addAnimal(newAnimal);
    setNewAnimal({
      name: '',
      type: '',
      breed: '',
      birthDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'healthy',
      notes: '',
      productionType: 'eggs',
      feedType: '',
      feedConsumption: 0,
      lastFedDate: format(new Date(), 'yyyy-MM-dd'),
      productionStats: {
        eggsCollected: 0,
        lastCollection: ''
      }
    });
    setIsAddingAnimal(false);
    setAddingToMainFarm(false);
  };

  const handleEditAnimal = (animal: Animal) => {
    setEditingAnimalId(animal.id);
    setNewAnimal({
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      birthDate: animal.birthDate,
      status: animal.status,
      notes: animal.notes,
      productionType: animal.productionType || 'eggs',
      feedType: animal.feedType || '',
      feedConsumption: animal.feedConsumption || 0,
      lastFedDate: animal.lastFedDate || format(new Date(), 'yyyy-MM-dd'),
      productionStats: animal.productionStats || {
        eggsCollected: 0,
        lastCollection: ''
      }
    });
  };

  const handleUpdateAnimal = () => {
    if (editingAnimalId) {
      updateAnimal(editingAnimalId, newAnimal);
      setEditingAnimalId(null);
      setNewAnimal({
        name: '',
        type: '',
        breed: '',
        birthDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'healthy',
        notes: '',
        productionType: 'eggs',
        feedType: '',
        feedConsumption: 0,
        lastFedDate: format(new Date(), 'yyyy-MM-dd'),
        productionStats: {
          eggsCollected: 0,
          lastCollection: ''
        }
      });
    }
  };

  const handleRecordProduction = () => {
    if (recordingProduction && productionAmount > 0) {
      recordAnimalProduction(recordingProduction.id, recordingProduction.type, productionAmount);
      setRecordingProduction(null);
      setProductionAmount(0);
    }
  };

  const handleRecordFeeding = () => {
    if (feedingAnimal && feedData.type && feedData.amount > 0) {
      recordFeedingEvent(feedingAnimal, feedData.type, feedData.amount);
      setFeedingAnimal(null);
      setFeedData({ type: '', amount: 0 });
    }
  };

  const getStatusColor = (status: Animal['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-600';
      case 'sick':
        return 'bg-red-100 text-red-600';
      case 'treatment':
        return 'bg-yellow-100 text-yellow-600';
      case 'other':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getProductionIcon = (type?: string) => {
    switch (type) {
      case 'eggs':
        return <Egg className="w-4 h-4" />;
      case 'milk':
        return <Droplets className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  const isSmallLivestock = (type: string) => {
    const smallTypes = ['chicken', 'rabbit', 'goat', 'sheep', 'duck', 'goose', 'turkey', 'guinea pig', 'bee'];
    return smallTypes.some(smallType => type.toLowerCase().includes(smallType));
  };

  // Filter for backyard livestock
  const backyardAnimals = animals.filter(animal => isSmallLivestock(animal.type));
  const largeAnimals = animals.filter(animal => !isSmallLivestock(animal.type));

  const handleAddMainFarmAnimal = () => {
    setAddingToMainFarm(true);
    setIsAddingAnimal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Animal Management</h1>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={() => setIsAddingAnimal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Animal
        </button>
      </div>

      {(isAddingAnimal || editingAnimalId) && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">
            {editingAnimalId ? 'Edit Animal' : addingToMainFarm ? 'Add Main Farm Animal' : 'Add New Animal'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Animal Name</label>
              <input
                type="text"
                className="form-input"
                value={newAnimal.name}
                onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Animal Type</label>
              <input
                type="text"
                className="form-input"
                value={newAnimal.type}
                onChange={(e) => setNewAnimal({ ...newAnimal, type: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Breed</label>
              <input
                type="text"
                className="form-input"
                value={newAnimal.breed}
                onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Birth Date</label>
              <input
                type="date"
                className="form-input"
                value={newAnimal.birthDate}
                onChange={(e) => setNewAnimal({ ...newAnimal, birthDate: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={newAnimal.status}
                onChange={(e) => setNewAnimal({ ...newAnimal, status: e.target.value as Animal['status'] })}
              >
                <option value="healthy">Healthy</option>
                <option value="sick">Sick</option>
                <option value="treatment">Under Treatment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Production Type</label>
              <select
                className="form-input"
                value={newAnimal.productionType}
                onChange={(e) => setNewAnimal({ ...newAnimal, productionType: e.target.value as any })}
              >
                <option value="eggs">Eggs</option>
                <option value="milk">Milk</option>
                <option value="meat">Meat</option>
                <option value="fiber">Fiber/Wool</option>
                <option value="breeding">Breeding</option>
                <option value="pet">Pet/Non-production</option>
              </select>
            </div>
            <div>
              <label className="form-label">Feed Type</label>
              <input
                type="text"
                className="form-input"
                value={newAnimal.feedType}
                onChange={(e) => setNewAnimal({ ...newAnimal, feedType: e.target.value })}
                placeholder="e.g., Layer pellets, hay, grass"
              />
            </div>
            <div>
              <label className="form-label">Daily Feed Amount (kg/lbs)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={newAnimal.feedConsumption}
                onChange={(e) => setNewAnimal({ ...newAnimal, feedConsumption: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={3}
                value={newAnimal.notes}
                onChange={(e) => setNewAnimal({ ...newAnimal, notes: e.target.value })}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setIsAddingAnimal(false);
                setEditingAnimalId(null);
                setAddingToMainFarm(false);
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={editingAnimalId ? handleUpdateAnimal : handleAddAnimal}
            >
              {editingAnimalId ? 'Update Animal' : 'Add Animal'}
            </button>
          </div>
        </div>
      )}

      {recordingProduction && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Record Production</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Production Type</label>
              <div className="form-input bg-gray-50">{recordingProduction.type}</div>
            </div>
            <div>
              <label className="form-label">Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={productionAmount}
                onChange={(e) => setProductionAmount(parseFloat(e.target.value) || 0)}
                placeholder={recordingProduction.type === 'eggs' ? "Number of eggs" : "Amount in liters/kg"}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button 
              className="btn btn-secondary" 
              onClick={() => setRecordingProduction(null)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleRecordProduction}
            >
              Record
            </button>
          </div>
        </div>
      )}

      {feedingAnimal && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Record Feeding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Feed Type</label>
              <input
                type="text"
                className="form-input"
                value={feedData.type}
                onChange={(e) => setFeedData({...feedData, type: e.target.value})}
                placeholder="e.g., Layer pellets, hay, grass"
              />
            </div>
            <div>
              <label className="form-label">Amount (kg/lbs)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={feedData.amount}
                onChange={(e) => setFeedData({...feedData, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button 
              className="btn btn-secondary" 
              onClick={() => setFeedingAnimal(null)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleRecordFeeding}
            >
              Record Feeding
            </button>
          </div>
        </div>
      )}

      {/* Backyard Animals Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Backyard Livestock</h2>
          <div className="flex space-x-2">
            <button className="btn btn-secondary flex items-center text-sm py-1">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </button>
            <button className="btn btn-secondary flex items-center text-sm py-1">
              <ArrowUpDown className="w-4 h-4 mr-1" />
              Sort
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Fed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backyardAnimals.map((animal) => (
                <tr key={animal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{animal.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{animal.type} ({animal.breed})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getProductionIcon(animal.productionType)}
                      <span className="ml-1">
                        {animal.productionType === 'eggs' ? 
                          `${animal.productionStats?.eggsCollected || 0} eggs` : 
                          animal.productionType === 'milk' ? 
                          `${animal.productionStats?.milkProduced || 0} L` : 
                          animal.productionType}
                      </span>
                      <button 
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => setRecordingProduction({id: animal.id, type: animal.productionType || 'eggs'})}
                      >
                        Record
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {animal.lastFedDate ? format(parseISO(animal.lastFedDate), 'MMM d, yyyy') : 'Not recorded'}
                    <button 
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => setFeedingAnimal(animal.id)}
                    >
                      Feed
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(animal.status)}`}>
                      {animal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800" 
                        onClick={() => handleEditAnimal(animal)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800" 
                        onClick={() => deleteAnimal(animal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {backyardAnimals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No backyard animals found. Add your first animal to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Farm Livestock Section */}
      {largeAnimals.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Main Farm Livestock</h2>
            <button 
              className="btn btn-primary flex items-center" 
              onClick={handleAddMainFarmAnimal}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Animal
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {largeAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{animal.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{animal.type} ({animal.breed})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(animal.birthDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(animal.status)}`}>
                        {animal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800" 
                          onClick={() => handleEditAnimal(animal)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800" 
                          onClick={() => deleteAnimal(animal.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Animals;
