import { useState } from 'react';
import { useAppStore, Crop } from '../store/appStore';
import { ArrowUpDown, Pencil, Filter, Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Crops = () => {
  const { crops, addCrop, updateCrop, deleteCrop } = useAppStore();
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState<string | null>(null);
  const [newCrop, setNewCrop] = useState<Omit<Crop, 'id'>>({
    name: '',
    type: '',
    area: 0,
    plantingDate: format(new Date(), 'yyyy-MM-dd'),
    harvestDate: null,
    status: 'planted',
    notes: ''
  });

  const handleAddCrop = () => {
    addCrop(newCrop);
    setNewCrop({
      name: '',
      type: '',
      area: 0,
      plantingDate: format(new Date(), 'yyyy-MM-dd'),
      harvestDate: null,
      status: 'planted',
      notes: ''
    });
    setIsAddingCrop(false);
  };

  const handleEditCrop = (crop: Crop) => {
    setEditingCropId(crop.id);
    setNewCrop({
      name: crop.name,
      type: crop.type,
      area: crop.area,
      plantingDate: crop.plantingDate,
      harvestDate: crop.harvestDate,
      status: crop.status,
      notes: crop.notes
    });
  };

  const handleUpdateCrop = () => {
    if (editingCropId) {
      updateCrop(editingCropId, newCrop);
      setEditingCropId(null);
      setNewCrop({
        name: '',
        type: '',
        area: 0,
        plantingDate: format(new Date(), 'yyyy-MM-dd'),
        harvestDate: null,
        status: 'planted',
        notes: ''
      });
    }
  };

  const getStatusColor = (status: Crop['status']) => {
    switch (status) {
      case 'planted':
        return 'bg-blue-100 text-blue-600';
      case 'growing':
        return 'bg-green-100 text-green-600';
      case 'ready-to-harvest':
        return 'bg-yellow-100 text-yellow-600';
      case 'harvested':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Crop Management</h1>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={() => setIsAddingCrop(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Crop
        </button>
      </div>

      {(isAddingCrop || editingCropId) && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">
            {editingCropId ? 'Pencil Crop' : 'Add New Crop'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Crop Name</label>
              <input
                type="text"
                className="form-input"
                value={newCrop.name}
                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Crop Type</label>
              <input
                type="text"
                className="form-input"
                value={newCrop.type}
                onChange={(e) => setNewCrop({ ...newCrop, type: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Area (acres)</label>
              <input
                type="number"
                className="form-input"
                value={newCrop.area}
                onChange={(e) => setNewCrop({ ...newCrop, area: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="form-label">Planting Date</label>
              <input
                type="date"
                className="form-input"
                value={newCrop.plantingDate}
                onChange={(e) => setNewCrop({ ...newCrop, plantingDate: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Harvest Date (if applicable)</label>
              <input
                type="date"
                className="form-input"
                value={newCrop.harvestDate || ''}
                onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value || null })}
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={newCrop.status}
                onChange={(e) => setNewCrop({ ...newCrop, status: e.target.value as Crop['status'] })}
              >
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="ready-to-harvest">Ready to Harvest</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={3}
                value={newCrop.notes}
                onChange={(e) => setNewCrop({ ...newCrop, notes: e.target.value })}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setIsAddingCrop(false);
                setEditingCropId(null);
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={editingCropId ? handleUpdateCrop : handleAddCrop}
            >
              {editingCropId ? 'Update Crop' : 'Add Crop'}
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Crop List</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (acres)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planting Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {crops.map((crop) => (
                <tr key={crop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{crop.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crop.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crop.area}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(crop.plantingDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(crop.status)}`}>
                      {crop.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800" 
                        onClick={() => handleEditCrop(crop)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800" 
                        onClick={() => deleteCrop(crop.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {crops.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No crops found. Add your first crop to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Crops;
