"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HabitTracker = () => {
  // User data state
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    streak: 12,
    overallCompletion: 78,
  });

  // Habits data
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', target: 10, unit: 'mins', current: 7, history: [5, 6, 7, 6, 8, 7, 7] },
    { id: 2, name: 'Water Intake', target: 8, unit: 'glasses', current: 6, history: [4, 5, 6, 7, 5, 6, 6] },
    { id: 3, name: 'Exercise', target: 30, unit: 'mins', current: 25, history: [20, 25, 30, 25, 20, 25, 25] },
    { id: 4, name: 'Reading', target: 20, unit: 'pages', current: 15, history: [10, 12, 15, 18, 15, 15, 15] },
    { id: 5, name: 'Screen Time', target: 120, unit: 'mins', current: 145, history: [180, 160, 150, 140, 150, 145, 145] },
    { id: 6, name: 'Sleep', target: 8, unit: 'hours', current: 7, history: [6, 6.5, 7, 7.5, 7, 7, 7] },
  ]);

  // UI states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState('');
  const [newHabitUnit, setNewHabitUnit] = useState('mins');

  // Days of week for charts
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Chart data preparation
  const chartData = days.map((day, index) => {
    const dayData: any = { day };
    habits.forEach(habit => {
      dayData[habit.name] = habit.history[index];
    });
    return dayData;
  });

  // Handle habit progress change
  const handleProgressChange = (id: number, value: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, current: Math.max(0, value) } : habit
    ));
    showTempNotification('Progress updated!');
  };

  // Complete a habit for today
  const completeHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, current: habit.target } : habit
    ));
    showTempNotification('Habit completed!');
  };

  // Add new habit
  const addNewHabit = () => {
    if (newHabitName && newHabitTarget) {
      const newHabit = {
        id: habits.length + 1,
        name: newHabitName,
        target: parseInt(newHabitTarget),
        unit: newHabitUnit,
        current: 0,
        history: Array(7).fill(0),
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setNewHabitTarget('');
      showTempNotification('New habit added!');
    }
  };

  // Show temporary notification
  const showTempNotification = (message: string) => {
    setNotification(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Calculate weekly progress
  const calculateWeeklyProgress = () => {
    return habits.reduce((acc, habit) => {
      const weeklyAvg = habit.history.reduce((sum, val) => sum + val, 0) / 7;
      return acc + (weeklyAvg / habit.target) * 100;
    }, 0) / habits.length;
  };

  // Calculate today's completion percentage
  const todaysCompletion = habits.reduce((acc, habit) => {
    return acc + (habit.current / habit.target) * 100;
  }, 0) / habits.length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center"
              >
                <div className="text-xl font-bold text-indigo-600">HabitTrack</div>
              </motion.div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`${activeTab === 'dashboard' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('habits')}
                  className={`${activeTab === 'habits' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  My Habits
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`${activeTab === 'analytics' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Analytics
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowSettings(true)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Settings</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div className="ml-3 flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-8 w-8 rounded-full" src={user.avatar} alt="User avatar" />
                </div>
                <div className="ml-2 hidden md:block">
                  <div className="text-sm font-medium text-gray-800">{user.name}</div>
                  <div className="text-xs text-gray-500">Streak: {user.streak} days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}!</h1>
              <p className="mt-2 text-gray-600">Track and improve your daily habits</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{user.streak}</h3>
                    <p className="text-sm text-gray-500">Current streak</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-50 text-green-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{Math.round(todaysCompletion)}%</h3>
                    <p className="text-sm text-gray-500">Today's completion</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{Math.round(calculateWeeklyProgress())}%</h3>
                    <p className="text-sm text-gray-500">Weekly average</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Today's Progress */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Today's Progress</h2>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>

              <div className="space-y-6">
                {habits.map(habit => (
                  <div key={habit.id} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-medium text-gray-800">{habit.name}</h3>
                      <span className="text-sm text-gray-500">
                        {habit.current} {habit.unit} of {habit.target} {habit.unit}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${habit.current >= habit.target ? 'bg-green-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(100, (habit.current / habit.target) * 100)}%` }}
                        ></div>
                      </div>
                      <button
                        onClick={() => completeHabit(habit.id)}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Overview Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Weekly Overview</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {habits.map(habit => (
                      <Line 
                        key={habit.id}
                        type="monotone" 
                        dataKey={habit.name} 
                        stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Habits Tab */}
        {activeTab === 'habits' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
                <p className="mt-2 text-gray-600">Manage your daily habits and goals</p>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New Habit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map(habit => (
                <motion.div
                  key={habit.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{habit.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Target: {habit.target} {habit.unit}/day
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {Math.round((habit.current / habit.target) * 100)}%
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{habit.current} / {habit.target} {habit.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${habit.current >= habit.target ? 'bg-green-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, (habit.current / habit.target) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor={`habit-${habit.id}-progress`} className="block text-sm font-medium text-gray-700 mb-1">
                      Update Progress
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        id={`habit-${habit.id}-progress`}
                        min="0"
                        max={habit.target * 1.5}
                        value={habit.current}
                        onChange={(e) => handleProgressChange(habit.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-500 w-16 text-center">
                        {habit.current} {habit.unit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => completeHabit(habit.id)}
                      className="px-3 py-1 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      Complete Today
                    </button>
                    <button className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                      View History
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="mt-2 text-gray-600">Track your progress and trends</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Weekly Comparison</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {habits.slice(0, 3).map(habit => (
                        <Bar 
                          key={habit.id}
                          dataKey={habit.name}
                          fill={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Habit Completion Rates</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={habits.map(habit => ({
                        name: habit.name,
                        completion: Math.round((habit.current / habit.target) * 100),
                        target: 100
                      }))}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completion" name="Completion %" fill="#8884d8" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="target" name="Target" fill="#82ca9d" radius={[0, 4, 4, 0]} opacity={0.3} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Trend Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {habits.slice(3).map(habit => (
                      <Line 
                        key={habit.id}
                        type="monotone" 
                        dataKey={habit.name} 
                        stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} HabitTrack. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowSettings(false)}></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              >
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Habit</h3>
                    <div className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700">
                          Habit Name
                        </label>
                        <input
                          type="text"
                          id="habit-name"
                          value={newHabitName}
                          onChange={(e) => setNewHabitName(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="habit-target" className="block text-sm font-medium text-gray-700">
                          Daily Target
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="number"
                            id="habit-target"
                            value={newHabitTarget}
                            onChange={(e) => setNewHabitTarget(e.target.value)}
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          />
                          <select
                            value={newHabitUnit}
                            onChange={(e) => setNewHabitUnit(e.target.value)}
                            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                          >
                            <option value="mins">mins</option>
                            <option value="hours">hours</option>
                            <option value="glasses">glasses</option>
                            <option value="pages">pages</option>
                            <option value="times">times</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={addNewHabit}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Add Habit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
              {notification}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitTracker;