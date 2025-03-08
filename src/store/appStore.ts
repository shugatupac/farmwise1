import { create } from 'zustand';
import { format } from 'date-fns';

export type TabType = 'dashboard' | 'crops' | 'animals' | 'tasks' | 'settings' | 'gardenBeds';

export interface Crop {
  id: string;
  name: string;
  type: string;
  area: number;
  plantingDate: string;
  harvestDate: string | null;
  status: 'planted' | 'growing' | 'ready-to-harvest' | 'harvested';
  notes: string;
}

export interface Animal {
  id: string;
  name: string;
  type: string;
  breed: string;
  birthDate: string;
  status: 'healthy' | 'sick' | 'treatment' | 'other';
  notes: string;
  // Small livestock specific fields
  productionType?: 'eggs' | 'meat' | 'milk' | 'fiber' | 'breeding' | 'pet';
  feedConsumption?: number; // Daily amount in kg/lbs
  feedType?: string;
  lastFedDate?: string;
  productionStats?: {
    eggsCollected?: number;
    milkProduced?: number;
    woolCollected?: number;
    lastCollection?: string;
  };
}

export interface GardenBed {
  id: string;
  name: string;
  width: number;
  length: number;
  type: 'raised' | 'inground' | 'container' | 'vertical';
  location: string;
  soilType?: string;
  sunExposure: 'full' | 'partial' | 'shade';
  plants: PlantPlacement[];
  notes: string;
  wateringSchedule?: {
    frequency: 'daily' | 'twice-weekly' | 'weekly';
    lastWatered: string;
    waterAmount: number; // in liters/gallons
  };
}

export interface PlantPlacement {
  id: string;
  plantName: string;
  plantType: string;
  startDate: string;
  harvestDate?: string;
  status: 'seed' | 'seedling' | 'growing' | 'producing' | 'finished';
  position: {
    x: number;
    y: number;
  };
  spacing: number; // in inches/cm
  companions?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'crops' | 'animals' | 'general' | 'garden';
  relatedItemId?: string; // ID of related crop, animal or garden bed
}

export interface FarmSettings {
  name: string;
  location: string;
  size: number;
  sizeUnit: 'acres' | 'hectares' | 'sqft' | 'sqm';
  ownerName: string;
  gardenType?: 'backyard' | 'community' | 'urban' | 'suburban' | 'rural';
  firstFrostDate?: string;
  lastFrostDate?: string;
  growingZone?: string;
}

export interface Weather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temperature: number;
    condition: string;
  }>;
  frostWarning?: boolean;
  rainPrediction?: number; // Chance of rain as percentage
  soilTemp?: number;
}

interface AppState {
  activeTab: TabType;
  crops: Crop[];
  animals: Animal[];
  tasks: Task[];
  settings: FarmSettings;
  weather: Weather;
  gardenBeds: GardenBed[];
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  addCrop: (crop: Omit<Crop, 'id'>) => void;
  updateCrop: (id: string, crop: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;
  addAnimal: (animal: Omit<Animal, 'id'>) => void;
  updateAnimal: (id: string, animal: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateSettings: (settings: Partial<FarmSettings>) => void;
  addGardenBed: (gardenBed: Omit<GardenBed, 'id'>) => void;
  updateGardenBed: (id: string, gardenBed: Partial<GardenBed>) => void;
  deleteGardenBed: (id: string) => void;
  addPlantToGardenBed: (gardenBedId: string, plant: Omit<PlantPlacement, 'id'>) => void;
  updatePlantInGardenBed: (gardenBedId: string, plantId: string, plantUpdates: Partial<PlantPlacement>) => void;
  removePlantFromGardenBed: (gardenBedId: string, plantId: string) => void;
  recordAnimalProduction: (animalId: string, productType: string, amount: number) => void;
  recordFeedingEvent: (animalId: string, feedType: string, amount: number) => void;
  calculateWaterNeeds: (gardenBedId: string) => number;
  updateWeatherData: (weather: Partial<Weather>) => void;
  initializeFromStorage: () => void;
}

// Sample weather data
const mockWeather: Weather = {
  temperature: 24,
  condition: 'Sunny',
  humidity: 65,
  windSpeed: 8,
  frostWarning: false,
  rainPrediction: 10,
  soilTemp: 18,
  forecast: [
    { day: 'Mon', temperature: 24, condition: 'Sunny' },
    { day: 'Tue', temperature: 22, condition: 'Partly Cloudy' },
    { day: 'Wed', temperature: 21, condition: 'Cloudy' },
    { day: 'Thu', temperature: 20, condition: 'Rain' },
    { day: 'Fri', temperature: 23, condition: 'Sunny' },
  ],
};

// Sample data
const defaultCrops: Crop[] = [
  {
    id: '1',
    name: 'Winter Wheat',
    type: 'Grain',
    area: 25,
    plantingDate: '2023-09-15',
    harvestDate: null,
    status: 'growing',
    notes: 'Good growth so far.'
  },
  {
    id: '2',
    name: 'Corn',
    type: 'Grain',
    area: 35,
    plantingDate: '2023-05-10',
    harvestDate: '2023-09-30',
    status: 'harvested',
    notes: 'Yield was better than expected.'
  }
];

const defaultAnimals: Animal[] = [
  {
    id: '1',
    name: 'Bella',
    type: 'Cow',
    breed: 'Holstein',
    birthDate: '2020-04-15',
    status: 'healthy',
    notes: 'Producing well.',
    productionType: 'milk',
    feedType: 'Hay and grain mix',
    feedConsumption: 12,
    lastFedDate: format(new Date(), 'yyyy-MM-dd'),
    productionStats: {
      milkProduced: 28,
      lastCollection: format(new Date(), 'yyyy-MM-dd'),
    }
  },
  {
    id: '2',
    name: 'Clucky',
    type: 'Chicken',
    breed: 'Rhode Island Red',
    birthDate: '2022-03-12',
    status: 'healthy',
    notes: 'Good layer',
    productionType: 'eggs',
    feedType: 'Layer pellets',
    feedConsumption: 0.15,
    lastFedDate: format(new Date(), 'yyyy-MM-dd'),
    productionStats: {
      eggsCollected: 145,
      lastCollection: format(new Date(), 'yyyy-MM-dd'),
    }
  }
];

const defaultGardenBeds: GardenBed[] = [
  {
    id: '1',
    name: 'Tomato Bed',
    width: 4,
    length: 8,
    type: 'raised',
    location: 'South Side',
    soilType: 'Loamy mix with compost',
    sunExposure: 'full',
    plants: [
      {
        id: '101',
        plantName: 'Roma Tomato',
        plantType: 'Vegetable',
        startDate: '2023-04-15',
        status: 'producing',
        position: { x: 1, y: 1 },
        spacing: 24,
        companions: ['Basil', 'Marigold']
      },
      {
        id: '102',
        plantName: 'Basil',
        plantType: 'Herb',
        startDate: '2023-04-20',
        status: 'growing',
        position: { x: 2, y: 1 },
        spacing: 10
      }
    ],
    notes: 'Added extra compost this year',
    wateringSchedule: {
      frequency: 'daily',
      lastWatered: format(new Date(), 'yyyy-MM-dd'),
      waterAmount: 4
    }
  },
  {
    id: '2',
    name: 'Herb Container',
    width: 2,
    length: 2,
    type: 'container',
    location: 'Patio',
    soilType: 'Potting mix',
    sunExposure: 'partial',
    plants: [
      {
        id: '201',
        plantName: 'Rosemary',
        plantType: 'Herb',
        startDate: '2023-03-10',
        status: 'growing',
        position: { x: 0, y: 0 },
        spacing: 12
      }
    ],
    notes: 'Needs to be moved inside during winter',
    wateringSchedule: {
      frequency: 'twice-weekly',
      lastWatered: format(new Date(), 'yyyy-MM-dd'),
      waterAmount: 1
    }
  }
];

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Apply fertilizer to wheat fields',
    description: 'Use the new organic fertilizer on all wheat fields.',
    dueDate: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    status: 'pending',
    priority: 'high',
    category: 'crops'
  },
  {
    id: '2',
    title: 'Collect eggs',
    description: 'Collect and clean eggs from the chicken coop',
    dueDate: format(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    status: 'pending',
    priority: 'medium',
    category: 'animals',
    relatedItemId: '2'
  },
  {
    id: '3',
    title: 'Harvest ripe tomatoes',
    description: 'Pick ripe tomatoes from the tomato bed',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'pending',
    priority: 'medium',
    category: 'garden',
    relatedItemId: '1'
  }
];

const defaultSettings: FarmSettings = {
  name: 'Green Valley Farm',
  location: 'Midwestern USA',
  size: 150,
  sizeUnit: 'acres',
  ownerName: 'John Farmer',
  gardenType: 'backyard',
  firstFrostDate: '2023-10-15',
  lastFrostDate: '2023-04-30',
  growingZone: '6b'
};

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'dashboard',
  crops: defaultCrops,
  animals: defaultAnimals,
  tasks: defaultTasks,
  settings: defaultSettings,
  weather: mockWeather,
  gardenBeds: defaultGardenBeds,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  addCrop: (crop) => set((state) => {
    const newCrop = { ...crop, id: Date.now().toString() };
    const crops = [...state.crops, newCrop];
    localStorage.setItem('farmapp-crops', JSON.stringify(crops));
    return { crops };
  }),
  
  updateCrop: (id, cropUpdates) => set((state) => {
    const crops = state.crops.map(c => 
      c.id === id ? { ...c, ...cropUpdates } : c
    );
    localStorage.setItem('farmapp-crops', JSON.stringify(crops));
    return { crops };
  }),
  
  deleteCrop: (id) => set((state) => {
    const crops = state.crops.filter(c => c.id !== id);
    localStorage.setItem('farmapp-crops', JSON.stringify(crops));
    return { crops };
  }),
  
  addAnimal: (animal) => set((state) => {
    const newAnimal = { ...animal, id: Date.now().toString() };
    const animals = [...state.animals, newAnimal];
    localStorage.setItem('farmapp-animals', JSON.stringify(animals));
    return { animals };
  }),
  
  updateAnimal: (id, animalUpdates) => set((state) => {
    const animals = state.animals.map(a => 
      a.id === id ? { ...a, ...animalUpdates } : a
    );
    localStorage.setItem('farmapp-animals', JSON.stringify(animals));
    return { animals };
  }),
  
  deleteAnimal: (id) => set((state) => {
    const animals = state.animals.filter(a => a.id !== id);
    localStorage.setItem('farmapp-animals', JSON.stringify(animals));
    return { animals };
  }),
  
  addTask: (task) => set((state) => {
    const newTask = { ...task, id: Date.now().toString() };
    const tasks = [...state.tasks, newTask];
    localStorage.setItem('farmapp-tasks', JSON.stringify(tasks));
    return { tasks };
  }),
  
  updateTask: (id, taskUpdates) => set((state) => {
    const tasks = state.tasks.map(t => 
      t.id === id ? { ...t, ...taskUpdates } : t
    );
    localStorage.setItem('farmapp-tasks', JSON.stringify(tasks));
    return { tasks };
  }),
  
  deleteTask: (id) => set((state) => {
    const tasks = state.tasks.filter(t => t.id !== id);
    localStorage.setItem('farmapp-tasks', JSON.stringify(tasks));
    return { tasks };
  }),
  
  updateSettings: (settingsUpdates) => set((state) => {
    const settings = { ...state.settings, ...settingsUpdates };
    localStorage.setItem('farmapp-settings', JSON.stringify(settings));
    return { settings };
  }),

  addGardenBed: (gardenBed) => set((state) => {
    const newGardenBed = { ...gardenBed, id: Date.now().toString() };
    const gardenBeds = [...state.gardenBeds, newGardenBed];
    localStorage.setItem('farmapp-gardenBeds', JSON.stringify(gardenBeds));
    return { gardenBeds };
  }),

  updateGardenBed: (id, gardenBedUpdates) => set((state) => {
    const gardenBeds = state.gardenBeds.map(gb => 
      gb.id === id ? { ...gb, ...gardenBedUpdates } : gb
    );
    localStorage.setItem('farmapp-gardenBeds', JSON.stringify(gardenBeds));
    return { gardenBeds };
  }),

  deleteGardenBed: (id) => set((state) => {
    const gardenBeds = state.gardenBeds.filter(gb => gb.id !== id);
    localStorage.setItem('farmapp-gardenBeds', JSON.stringify(gardenBeds));
    return { gardenBeds };
  }),

  addPlantToGardenBed: (gardenBedId, plant) => set((state) => {
    const newPlant = { ...plant, id: Date.now().toString() };
    const gardenBeds = state.gardenBeds.map(gb => {
      if (gb.id === gardenBedId) {
        return {
          ...gb,
          plants: [...gb.plants, newPlant]
        };
      }
      return gb;
    });
    localStorage.setItem('farmapp-gardenBeds', JSON.stringify(gardenBeds));
    return { gardenBeds };
  }),

  updatePlantInGardenBed: (gardenBedId, plantId, plantUpdates) => set((state) => {
    const gardenBeds = state.gardenBeds.map(gb => {
      if (gb.id === gardenBedId) {
        return {
          ...gb,
          plants: gb.plants.map(p => 
            p.id === plantId ? { ...p, ...plantUpdates } : p
          )
        };
      }
      return gb;
    });
    localStorage.setItem('farmapp-gardenBeds', JSON.stringify(gardenBeds));
    return { gardenBeds };
  }),

  removePlantFromGardenBed: (gardenBedId, plantId) => set((state) => {
    const gardenBeds = state.gardenBeds.map(gb => {
      if (gb.id === gardenBedId) {
        return {
          ...gb,
          plants: gb.plants.filter(p => p.id !== plantId)
        };
      }
      return gb;
    });
    localStorage.setItem('farmapp-gardenBeds', JSON.stringify(gardenBeds));
    return { gardenBeds };
  }),

  recordAnimalProduction: (animalId, productType, amount) => set((state) => {
    const animals = state.animals.map(animal => {
      if (animal.id === animalId) {
        const stats = animal.productionStats || {};
        
        if (productType === 'eggs') {
          return {
            ...animal,
            productionStats: {
              ...stats,
              eggsCollected: (stats.eggsCollected || 0) + amount,
              lastCollection: format(new Date(), 'yyyy-MM-dd')
            }
          };
        } else if (productType === 'milk') {
          return {
            ...animal,
            productionStats: {
              ...stats,
              milkProduced: (stats.milkProduced || 0) + amount,
              lastCollection: format(new Date(), 'yyyy-MM-dd')
            }
          };
        } else if (productType === 'wool') {
          return {
            ...animal,
            productionStats: {
              ...stats,
              woolCollected: (stats.woolCollected || 0) + amount,
              lastCollection: format(new Date(), 'yyyy-MM-dd')
            }
          };
        }
      }
      return animal;
    });
    
    localStorage.setItem('farmapp-animals', JSON.stringify(animals));
    return { animals };
  }),

  recordFeedingEvent: (animalId, feedType, amount) => set((state) => {
    const animals = state.animals.map(animal => {
      if (animal.id === animalId) {
        return {
          ...animal,
          feedType,
          feedConsumption: amount,
          lastFedDate: format(new Date(), 'yyyy-MM-dd')
        };
      }
      return animal;
    });
    
    localStorage.setItem('farmapp-animals', JSON.stringify(animals));
    return { animals };
  }),

  calculateWaterNeeds: (gardenBedId) => {
    const { gardenBeds, weather } = get();
    const gardenBed = gardenBeds.find(gb => gb.id === gardenBedId);
    
    if (!gardenBed) return 0;
    
    const baseWaterNeed = gardenBed.width * gardenBed.length * 0.5; // 0.5 gallon per square foot as base
    
    // Adjust for weather conditions
    let weatherMultiplier = 1.0;
    
    if (weather.temperature > 30) {
      weatherMultiplier += 0.3; // Hot weather needs more water
    } else if (weather.temperature < 10) {
      weatherMultiplier -= 0.2; // Cold weather needs less water
    }
    
    if (weather.humidity < 40) {
      weatherMultiplier += 0.2; // Dry air needs more water
    } else if (weather.humidity > 80) {
      weatherMultiplier -= 0.1; // Humid air needs less water
    }
    
    if (weather.rainPrediction && weather.rainPrediction > 50) {
      weatherMultiplier -= 0.5; // High chance of rain needs less water
    }
    
    // Adjust for sun exposure
    if (gardenBed.sunExposure === 'full') {
      weatherMultiplier += 0.2; // Full sun needs more water
    } else if (gardenBed.sunExposure === 'shade') {
      weatherMultiplier -= 0.2; // Shade needs less water
    }
    
    return Math.max(0, baseWaterNeed * weatherMultiplier);
  },

  updateWeatherData: (weatherUpdates) => set((state) => {
    const weather = { ...state.weather, ...weatherUpdates };
    return { weather };
  }),
  
  initializeFromStorage: () => {
    // Only load from localStorage if data exists
    set((state) => {
      const cropsData = localStorage.getItem('farmapp-crops');
      const animalsData = localStorage.getItem('farmapp-animals');
      const tasksData = localStorage.getItem('farmapp-tasks');
      const settingsData = localStorage.getItem('farmapp-settings');
      const gardenBedsData = localStorage.getItem('farmapp-gardenBeds');
      
      return {
        crops: cropsData ? JSON.parse(cropsData) : state.crops,
        animals: animalsData ? JSON.parse(animalsData) : state.animals,
        tasks: tasksData ? JSON.parse(tasksData) : state.tasks,
        settings: settingsData ? JSON.parse(settingsData) : state.settings,
        gardenBeds: gardenBedsData ? JSON.parse(gardenBedsData) : state.gardenBeds
      };
    });
  }
}));
