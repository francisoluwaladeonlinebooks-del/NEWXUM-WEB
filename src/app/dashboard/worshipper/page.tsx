'use client';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, MapPin, Heart, Users, Phone, HelpCircle } from 'lucide-react';

export default function WorshipperDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const quickActions = [
    { icon: AlertCircle, label: 'Medical Emergency', color: 'bg-red-50 border-red-200', textColor: 'text-red-600', href: '#' },
    { icon: AlertCircle, label: 'Security Issue', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-600', href: '#' },
    { icon: Users, label: 'Missing Child', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-600', href: '#' },
    { icon: MapPin, label: 'My Vehicle', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-600', href: '#' },
    { icon: Heart, label: 'Parking Report', color: 'bg-green-50 border-green-200', textColor: 'text-green-600', href: '#' },
    { icon: Phone, label: 'Guidance Hotline', color: 'bg-indigo-50 border-indigo-200', textColor: 'text-indigo-600', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <motion.div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Pilgrim Hub</h1>
              <p className="text-slate-600 text-sm mt-1">Welcome to your camp experience dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">C</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Active Incidents', value: '2', color: 'from-red-600 to-red-700' },
            { label: 'Missing Alerts', value: '0', color: 'from-purple-600 to-purple-700' },
            { label: 'Location Access', value: 'Active', color: 'from-green-600 to-green-700' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`backdrop-blur-xl bg-white/80 rounded-2xl p-6 border border-white/30 shadow-lg`}
            >
              <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mt-2`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className={`${action.color} border-2 rounded-xl p-6 text-left transition-all hover:shadow-lg`}
                >
                  <Icon className={`w-8 h-8 ${action.textColor} mb-3`} />
                  <p className={`${action.textColor} font-semibold`}>{action.label}</p>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Active Incidents */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Active Incidents</h2>
          <motion.div className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/30 shadow-lg overflow-hidden">
            <div className="divide-y divide-slate-200">
              {[
                { id: '1', type: 'Medical Report', status: 'Pending', time: '2 hours ago' },
                { id: '2', type: 'Vehicle Parking', status: 'Confirmed', time: '4 hours ago' },
              ].map((incident) => (
                <motion.div
                  key={incident.id}
                  variants={itemVariants}
                  className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{incident.type}</p>
                    <p className="text-sm text-slate-600">{incident.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    incident.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {incident.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Missing Persons Alerts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Missing Person Alerts in Your Area</h2>
          <motion.div className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/30 shadow-lg p-8 text-center">
            <p className="text-slate-600">No active missing person alerts in your area</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
