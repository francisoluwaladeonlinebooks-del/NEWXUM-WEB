'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, MapPin, Users, Clock, Zap } from 'lucide-react';

export default function SecurityDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-yellow-400" />
                Security Response
              </h1>
              <p className="text-slate-400 text-sm mt-1">Security Officer Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg">
                <span className="text-green-400 font-medium text-sm">AVAILABLE</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Active Incidents', value: '5', icon: AlertTriangle, color: 'from-yellow-600 to-yellow-700' },
            { label: 'Pending Response', value: '2', icon: Clock, color: 'from-orange-600 to-orange-700' },
            { label: 'Officers Available', value: '12', icon: Users, color: 'from-blue-600 to-blue-700' },
            { label: 'Response Status', value: '100%', icon: Zap, color: 'from-green-600 to-green-700' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="backdrop-blur-xl bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                  <Icon className="w-5 h-5 text-yellow-400" />
                </div>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Deployment Status */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Dispatch Readiness</h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'GPS Status', value: 'Active', status: 'good' },
              { label: 'Radio Connection', value: 'Strong', status: 'good' },
              { label: 'Battery Level', value: '88%', status: 'good' },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className={`backdrop-blur-xl bg-slate-800/50 rounded-2xl p-6 border-2 ${
                  item.status === 'good' ? 'border-green-500' : 'border-yellow-500'
                } shadow-lg`}
              >
                <p className="text-slate-400 text-sm font-medium mb-2">{item.label}</p>
                <p className={`text-2xl font-bold ${item.status === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Incident Queue */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Incident Queue</h2>
          <motion.div className="backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
            <div className="divide-y divide-slate-700">
              {[
                { id: '1', priority: '1', type: 'Unauthorized Access', location: 'North Perimeter', time: '2m ago' },
                { id: '2', priority: '2', type: 'Crowd Disturbance', location: 'Main Stage Area', time: '5m ago' },
                { id: '3', priority: '3', type: 'Vehicle Incident', location: 'Parking Zone B', time: '8m ago' },
              ].map((incident) => (
                <motion.div
                  key={incident.id}
                  variants={itemVariants}
                  className="p-6 hover:bg-slate-700/50 transition-colors flex items-start justify-between border-l-4 border-yellow-500"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="inline-block w-8 h-8 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm">
                        {incident.priority}
                      </span>
                      <p className="font-semibold text-white">{incident.type}</p>
                    </div>
                    <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {incident.location}
                    </p>
                    <p className="text-xs text-slate-500">{incident.time}</p>
                  </div>
                  <button className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm">
                    Respond
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Missing Persons & Unit Status */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Missing Persons Search</h3>
            <p className="text-slate-400 text-sm">No active missing person alerts</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Today's Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Incidents</span>
                <span className="text-white font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resolved</span>
                <span className="text-green-400 font-semibold">16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pending</span>
                <span className="text-yellow-400 font-semibold">2</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
