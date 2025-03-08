import { useAppStore } from '../store/appStore';
import { Squircle, ArrowDownRight, ArrowUpRight, ChartBar, Cloud, Droplets, Wind } from 'lucide-react';
import { format, isAfter, parseISO, subDays } from 'date-fns';

const Dashboard = () => {
  const { crops, animals, tasks, settings, weather } = useAppStore();

  // Calculate overview stats
  const activeCrops = crops.filter(crop => crop.status !== 'harvested').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const urgentTasks = tasks.filter(
    task => 
      task.status === 'pending' && 
      task.priority === 'high' && 
      isAfter(parseISO(task.dueDate), subDays(new Date(), 3))
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          {settings.name} Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Sprout className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Crops</p>
            <p className="text-2xl font-semibold">{activeCrops}</p>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Cat className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Animals</p>
            <p className="text-2xl font-semibold">{animals.length}</p>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Squircle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Tasks</p>
            <p className="text-2xl font-semibold">{pendingTasks}</p>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <ChartBar className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Urgent Tasks</p>
            <p className="text-2xl font-semibold">{urgentTasks}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Recent Activities</h2>
            <button className="text-sm text-green-600 flex items-center">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-start p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                <div className={`rounded-full p-2 mr-3 ${
                  task.category === 'crops' 
                    ? 'bg-green-100 text-green-600' 
                    : task.category === 'animals' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  {task.category === 'crops' ? <Sprout className="w-5 h-5" /> : 
                   task.category === 'animals' ? <Cat className="w-5 h-5" /> : 
                   <CheckSquare className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-600' 
                        : task.priority === 'medium' 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-green-100 text-green-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                    <span className={`text-xs ${
                      task.status === 'completed' 
                        ? 'text-green-600' 
                        : task.status === 'in-progress' 
                          ? 'text-blue-600' 
                          : 'text-gray-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Weather</h2>
            <span className="text-sm text-gray-500">{settings.location}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Cloud className="w-16 h-16 text-blue-500 mr-2" />
              <div>
                <span className="text-3xl font-semibold">{weather.temperature}°C</span>
                <p className="text-gray-500">{weather.condition}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                <span>{weather.humidity}% Humidity</span>
              </div>
              <div className="flex items-center text-sm">
                <Wind className="w-4 h-4 text-blue-500 mr-2" />
                <span>{weather.windSpeed} km/h Wind</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium mb-3">5-Day Forecast</h3>
            <div className="flex justify-between">
              {weather.forecast.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs font-medium">{day.day}</p>
                  <Cloud className="w-6 h-6 mx-auto my-1 text-blue-500" />
                  <p className="text-sm font-medium">{day.temperature}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

function CheckSquare(props: { className: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
}

function Sprout(props: { className: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>;
}

function Cat(props: { className: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg>;
}
