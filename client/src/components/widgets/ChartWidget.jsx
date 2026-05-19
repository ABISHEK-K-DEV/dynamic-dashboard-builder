import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { Move, Settings } from 'lucide-react';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ChartWidget = ({ widget }) => {
  const { updateWidget, selectedWidgetId } = useDashboard();
  const isSelected = selectedWidgetId === widget.id;

  // Let's use content to store chart type (bar, line, pie)
  const chartType = widget.content || 'bar';

  const setChartType = (type) => {
    updateWidget(widget.id, { content: type });
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#252526', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="value" stroke="#007fd4" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#252526', border: '1px solid #333' }} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#252526', border: '1px solid #333' }} />
              <Bar dataKey="value" fill="#007fd4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col group relative">
      <div className={`drag-handle absolute top-0 left-0 right-0 h-6 bg-black/50 z-10 flex items-center justify-between px-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
        <Move size={14} className="text-white" />
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); setChartType('bar'); }} className={`text-[10px] px-1 rounded ${chartType === 'bar' ? 'bg-editor-accent text-white' : 'bg-gray-700 text-gray-300'}`}>Bar</button>
          <button onClick={(e) => { e.stopPropagation(); setChartType('line'); }} className={`text-[10px] px-1 rounded ${chartType === 'line' ? 'bg-editor-accent text-white' : 'bg-gray-700 text-gray-300'}`}>Line</button>
          <button onClick={(e) => { e.stopPropagation(); setChartType('pie'); }} className={`text-[10px] px-1 rounded ${chartType === 'pie' ? 'bg-editor-accent text-white' : 'bg-gray-700 text-gray-300'}`}>Pie</button>
        </div>
      </div>
      
      <div className="flex-1 w-full h-full pt-6 pb-2 px-2">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartWidget;
