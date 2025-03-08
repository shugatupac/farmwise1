import { useState } from 'react';
import { useAppStore, GardenBed, PlantPlacement } from '../store/appStore';
import { ArrowUpDown, Cloud, Droplets, Filter, Grid3x3, Pencil, Leaf, Plus, Save, Trash2 } from 'lucide-react';
import { format, parseISO, addDays, isAfter } from 'date-fns';

const GardenBeds = () => {
  const { gardenBeds, addGardenBed, updateGardenBed, deleteGardenBed, 
          addPlantToGardenBed, updatePlantInGardenBed, removePlantFromGardenBed,
          calculateWaterNeeds } = useAppStore();
  
  const [isAddingBed, setIsAddingBed] = useState(false);
  const [editingBedId, setEditingBedId] = useState<string | null>(null);
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);
  
  const [newBed, setNewBed] = useState<Omit<GardenBed, 'id'>>({
    name: '',
    width: 4,
    length: 8,
    type: 'raised',
    location: 'Backyard',
    soilType: '',
    sunExposure: 'full',
    plants: [],
    notes: '',
    wateringSchedule: {
      frequency: 'daily',
      lastWatered: format(new Date(), 'yyyy-MM-dd'),
      waterAmount: 0
    }
  });
  
  const [newPlant, setNewPlant] = useState<Omit<PlantPlacement, 'id'>>({
    plantName: '',
    plantType: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'seed',
    position: { x: 0, y: 0 },
    spacing: 12,
    companions: []
  });

  const handleAddBed = () => {
    addGardenBed(newBed);
    setNewBed({
      name: '',
      width: 4,
      length: 8,
      type: 'raised',
      location: 'Backyard',
      soilType: '',
      sunExposure: 'full',
      plants: [],
      notes: '',
      wateringSchedule: {
        frequency: 'daily',
        lastWatered: format(new Date(), 'yyyy-MM-dd'),
        waterAmount: 0
      }
    });
    setIsAddingBed(false);
  };

  const handleEditBed = (bed: GardenBed) => {
    setEditingBedId(bed.id);
    setNewBed({
      name: bed.name,
      width: bed.width,
      length: bed.length,
      type: bed.type,
      location: bed.location,
      soilType: bed.soilType || '',
      sunExposure: bed.sunExposure,
      plants: bed.plants,
      notes: bed.notes,
      wateringSchedule: bed.wateringSchedule || {
        frequency: 'daily',
        lastWatered: format(new Date(), 'yyyy-MM-dd'),
        waterAmount: 0
      }
    });
  };

  const handleUpdateBed = () => {
    if (editingBedId) {
      updateGardenBed(editingBedId, newBed);
      setEditingBedId(null);
      setNewBed({
        name: '',
        width: 4,
        length: 8,
        type: 'raised',
        location: 'Backyard',
        soilType: '',
        sunExposure: 'full',
        plants: [],
        notes: '',
        wateringSchedule: {
          frequency: 'daily',
          lastWatered: format(new Date(), 'yyyy-MM-dd'),
          waterAmount: 0
        }
      });
    }
  };

  const handleAddPlant = () => {
    if (selectedBedId) {
      addPlantToGardenBed(selectedBedId, newPlant);
      setNewPlant({
        plantName: '',
        plantType: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'seed',
        position: { x: 0, y: 0 },
        spacing: 12,
        companions: []
      });
      setIsAddingPlant(false);
    }
  };

  const handleEditPlant = (plantId: string) => {
    if (selectedBedId) {
      const bed = gardenBeds.find(b => b.id === selectedBedId);
      const plant = bed?.plants.find(p => p.id === plantId);
      
      if (plant) {
        setEditingPlantId(plantId);
        setNewPlant({
          plantName: plant.plantName,
          plantType: plant.plantType,
          startDate: plant.startDate,
          harvestDate: plant.harvestDate,
          status: plant.status,
          position: plant.position,
          spacing: plant.spacing,
          companions: plant.companions || []
        });
      }
    }
  };

  const handleUpdatePlant = () => {
    if (selectedBedId && editingPlantId) {
      updatePlantInGardenBed(selectedBedId, editingPlantId, newPlant);
      setEditingPlantId(null);
      setNewPlant({
        plantName: '',
        plantType: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'seed',
        position: { x: 0, y: 0 },
        spacing: 12,
        companions: []
      });
    }
  };

  const handleWaterBed = (bedId: string) => {
    const bed = gardenBeds.find(b => b.id === bedId);
    if (bed && bed.wateringSchedule) {
      const waterAmount = calculateWaterNeeds(bedId);
      updateGardenBed(bedId, {
        wateringSchedule: {
          ...bed.wateringSchedule,
          lastWatered: format(new Date(), 'yyyy-MM-dd'),
          waterAmount
        }
      });
    }
  };

  const needsWatering = (bed: GardenBed) => {
    if (!bed.wateringSchedule) return false;
    
    const lastWatered = parseISO(bed.wateringSchedule.lastWatered);
    let daysToAdd = 1;
    
    switch (bed.wateringSchedule.frequency) {
      case 'daily':
        daysToAdd = 1;
        break;
      case 'twice-weekly':
        daysToAdd = 3;
        break;
      case 'weekly':
        daysToAdd = 7;
        break;
    }
    
    const nextWateringDate = addDays(lastWatered, daysToAdd);
    return isAfter(new Date(), nextWateringDate);
  };

  const getBedTypeLabel = (type: GardenBed['type']) => {
    switch (type) {
      case 'raised':
        return 'Raised Bed';
      case 'inground':
        return 'In-Ground';
      case 'container':
        return 'Container';
      case 'vertical':
        return 'Vertical';
      default:
        return type;
    }
  };

  const getPlantStatusColor = (status: PlantPlacement['status']) => {
    switch (status) {
      case 'seed':
        return 'bg-gray-100 text-gray-600';
      case 'seedling':
        return 'bg-blue-100 text-blue-600';
      case 'growing':
        return 'bg-green-100 text-green-600';
      case 'producing':
        return 'bg-yellow-100 text-yellow-600';
      case 'finished':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const selectedBed = selectedBedId ? gardenBeds.find(bed => bed.id === selectedBedId) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Garden Bed Management</h1>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={() => setIsAddingBed(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Garden Bed
        </button>
      </div>

      {/* Add/Edit Garden Bed Form */}
      {(isAddingBed || editingBedId) && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">
            {editingBedId ? 'Edit Garden Bed' : 'Add New Garden Bed'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Bed Name</label>
              <input
                type="text"
                className="form-input"
                value={newBed.name}
                onChange={(e) => setNewBed({ ...newBed, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={newBed.location}
                onChange={(e) => setNewBed({ ...newBed, location: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="form-label">Width (ft)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={newBed.width}
                  onChange={(e) => setNewBed({ ...newBed, width: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label">Length (ft)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={newBed.length}
                  onChange={(e) => setNewBed({ ...newBed, length: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Bed Type</label>
              <select
                className="form-input"
                value={newBed.type}
                onChange={(e) => setNewBed({ ...newBed, type: e.target.value as GardenBed['type'] })}
              >
                <option value="raised">Raised Bed</option>
                <option value="inground">In-Ground</option>
                <option value="container">Container</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div>
              <label className="form-label">Soil Type</label>
              <input
                type="text"
                className="form-input"
                value={newBed.soilType}
                onChange={(e) => setNewBed({ ...newBed, soilType: e.target.value })}
                placeholder="e.g., Loamy, Sandy, Clay"
              />
            </div>
            <div>
              <label className="form-label">Sun Exposure</label>
              <select
                className="form-input"
                value={newBed.sunExposure}
                onChange={(e) => setNewBed({ ...newBed, sunExposure: e.target.value as GardenBed['sunExposure'] })}
              >
                <option value="full">Full Sun</option>
                <option value="partial">Partial Sun</option>
                <option value="shade">Shade</option>
              </select>
            </div>
            <div>
              <label className="form-label">Watering Frequency</label>
              <select
                className="form-input"
                value={newBed.wateringSchedule?.frequency}
                onChange={(e) => setNewBed({ 
                  ...newBed, 
                  wateringSchedule: { 
                    ...newBed.wateringSchedule!, 
                    frequency: e.target.value as 'daily' | 'twice-weekly' | 'weekly'
                  } 
                })}
              >
                <option value="daily">Daily</option>
                <option value="twice-weekly">Twice Weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={3}
                value={newBed.notes}
                onChange={(e) => setNewBed({ ...newBed, notes: e.target.value })}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setIsAddingBed(false);
                setEditingBedId(null);
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={editingBedId ? handleUpdateBed : handleAddBed}
            >
              {editingBedId ? 'Update Garden Bed' : 'Add Garden Bed'}
            </button>
          </div>
        </div>
      )}

      {/* Garden Beds List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gardenBeds.map((bed) => (
          <div 
            key={bed.id} 
            className={`card hover:shadow-md transition-shadow cursor-pointer ${
              selectedBedId === bed.id ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setSelectedBedId(bed.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-lg">{bed.name}</h3>
              <div className="flex space-x-1">
                {needsWatering(bed) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                    <Droplets className="w-3 h-3 mr-1" />
                    Needs Water
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mb-2 text-sm text-gray-500">
              <span className="flex items-center">
                <Grid3x3 className="w-4 h-4 mr-1" />
                {bed.width} × {bed.length} ft
              </span>
              <span className="flex items-center">
                <Cloud className="w-4 h-4 mr-1" />
                {bed.sunExposure} sun
              </span>
            </div>
            
            <div className="mb-3 border border-gray-200 bg-gray-50 rounded p-2 flex justify-center items-center" style={{ height: '80px' }}>
              <div 
                className="border border-gray-300 bg-white relative"
                style={{ 
                  width: `${Math.min(bed.width * 15, 100)}px`, 
                  height: `${Math.min(bed.length * 8, 60)}px` 
                }}
              >
                {bed.plants.slice(0, 5).map((plant, index) => (
                  <div 
                    key={plant.id}
                    className="absolute w-2 h-2 bg-green-500 rounded-full"
                    style={{ 
                      left: `${(plant.position.x / bed.width) * 100}%`, 
                      top: `${(plant.position.y / bed.length) * 100}%` 
                    }}
                    title={plant.plantName}
                  />
                ))}
                {bed.plants.length > 5 && (
                  <div className="absolute right-0 bottom-0 text-xs text-gray-500 bg-white px-1">
                    +{bed.plants.length - 5} more
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-2">
              <span className="text-sm text-gray-500">
                {bed.plants.length} plants • {getBedTypeLabel(bed.type)}
              </span>
            </div>
            
            <div className="flex justify-between mt-2">
              <div className="flex space-x-1">
                <button 
                  className="btn btn-secondary text-xs py-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditBed(bed);
                  }}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </button>
                <button 
                  className="btn btn-secondary text-xs py-1 text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWaterBed(bed.id);
                  }}
                >
                  <Droplets className="w-3 h-3 mr-1" />
                  Water
                </button>
              </div>
              <button 
                className="text-red-600 hover:text-red-800"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteGardenBed(bed.id);
                  if (selectedBedId === bed.id) {
                    setSelectedBedId(null);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {gardenBeds.length === 0 && (
          <div className="card col-span-full flex flex-col items-center justify-center py-8 text-center">
            <Leaf className="w-12 h-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-500">No Garden Beds Yet</h3>
            <p className="text-gray-400 mb-4">Add your first garden bed to start planning your garden</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsAddingBed(true)}
            >
              Add Garden Bed
            </button>
          </div>
        )}
      </div>

      {/* Selected Garden Bed Detail View */}
      {selectedBed && (
        <div className="card mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Plants in {selectedBed.name}</h2>
            <button 
              className="btn btn-primary flex items-center text-sm" 
              onClick={() => setIsAddingPlant(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Leaf
            </button>
          </div>

          {/* Add/Edit Leaf Form */}
          {(isAddingPlant || editingPlantId) && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-md font-medium mb-3">
                {editingPlantId ? 'Edit Leaf' : 'Add New Leaf'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Leaf Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newPlant.plantName}
                    onChange={(e) => setNewPlant({ ...newPlant, plantName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Leaf Type</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newPlant.plantType}
                    onChange={(e) => setNewPlant({ ...newPlant, plantType: e.target.value })}
                    placeholder="e.g., Vegetable, Herb, Flower"
                  />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={newPlant.status}
                    onChange={(e) => setNewPlant({ ...newPlant, status: e.target.value as PlantPlacement['status'] })}
                  >
                    <option value="seed">Seed</option>
                    <option value="seedling">Seedling</option>
                    <option value="growing">Growing</option>
                    <option value="producing">Producing</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Planting Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newPlant.startDate}
                    onChange={(e) => setNewPlant({ ...newPlant, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Harvest Date (if applicable)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newPlant.harvestDate || ''}
                    onChange={(e) => setNewPlant({ ...newPlant, harvestDate: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="form-label">Spacing (inches)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    value={newPlant.spacing}
                    onChange={(e) => setNewPlant({ ...newPlant, spacing: Number(e.target.value) })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="form-label">Position X</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      max={selectedBed.width}
                      value={newPlant.position.x}
                      onChange={(e) => setNewPlant({ 
                        ...newPlant, 
                        position: { ...newPlant.position, x: Number(e.target.value) } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Position Y</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      max={selectedBed.length}
                      value={newPlant.position.y}
                      onChange={(e) => setNewPlant({ 
                        ...newPlant, 
                        position: { ...newPlant.position, y: Number(e.target.value) } 
                      })}
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="form-label">Companion Plants (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newPlant.companions?.join(', ') || ''}
                    onChange={(e) => setNewPlant({ 
                      ...newPlant, 
                      companions: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                    })}
                    placeholder="e.g., Basil, Marigold, Onion"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setIsAddingPlant(false);
                    setEditingPlantId(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={editingPlantId ? handleUpdatePlant : handleAddPlant}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {editingPlantId ? 'Update Leaf' : 'Add Leaf'}
                </button>
              </div>
            </div>
          )}

          {/* Garden Bed Visual Layout */}
          <div className="mb-6 border border-gray-200 bg-gray-50 rounded p-4">
            <div className="mx-auto" style={{ 
              width: `${Math.min(selectedBed.width * 40, 100)}%`, 
              height: `${Math.min(selectedBed.length * 20, 300)}px`,
              maxWidth: '100%',
              position: 'relative',
              backgroundColor: '#e5e7eb',
              border: '1px solid #d1d5db'
            }}>
              {selectedBed.plants.map((plant) => (
                <div 
                  key={plant.id}
                  className={`absolute rounded-full flex items-center justify-center ${
                    getPlantStatusColor(plant.status).split(' ')[0]
                  }`}
                  style={{ 
                    left: `${(plant.position.x / selectedBed.width) * 100}%`, 
                    top: `${(plant.position.y / selectedBed.length) * 100}%`,
                    width: `${Math.min(plant.spacing, 40)}px`,
                    height: `${Math.min(plant.spacing, 40)}px`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    border: '1px solid #d1d5db'
                  }}
                  title={`${plant.plantName} (${plant.plantType})`}
                  onClick={() => handleEditPlant(plant.id)}
                >
                  {plant.plantName.charAt(0)}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              Click on a plant to edit • Grid represents {selectedBed.width}' × {selectedBed.length}' area
            </div>
          </div>

          {/* Plants List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leaf</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planted</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Companions</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedBed.plants.map((plant) => (
                  <tr key={plant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{plant.plantName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{plant.plantType}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPlantStatusColor(plant.status)}`}>
                        {plant.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(plant.startDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {plant.companions?.join(', ') || '-'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800" 
                          onClick={() => handleEditPlant(plant.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800" 
                          onClick={() => removePlantFromGardenBed(selectedBed.id, plant.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {selectedBed.plants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                      No plants added to this garden bed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenBeds;
