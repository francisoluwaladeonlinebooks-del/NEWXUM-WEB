'use client';

import { motion } from 'framer-motion';
import { AlertCircle, MapPin, Users, Zap, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
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
              <h1 className="text-3xl font-bold text-white">Command Center</h1>
              <p className="text-slate-400 text-sm mt-1">Camp Operations Control Hub</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* KPI Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Active Incidents', value: '24', delta: '+3', color: 'from-red-600 to-red-700', icon: AlertCircle },
            { label: 'Responders Active', value: '156', delta: '+12', color: 'from-blue-600 to-blue-700', icon: Users },
            { label: 'Medical Calls', value: '18', delta: '+2', color: 'from-emerald-600 to-emerald-700', icon: Zap },
            { label: 'Response Time', value: '3.2m', delta: '-0.4m', color: 'from-purple-600 to-purple-700', icon: Clock },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                variants={itemVariants}
                className="backdrop-blur-xl bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{kpi.label}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent mt-2`}>
                      {kpi.value}
                    </p>
                  </div>
                  <Icon className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-green-400 text-xs font-medium">{kpi.delta} last hour</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Three-Pane Layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Pane: Incident Feed */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                Incident Feed
              </h2>
            </div>
            <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
              {[
                { id: '1', type: 'Medical', status: 'Active', severity: 'high', location: 'Zone A-12' },
                { id: '2', type: 'Security', status: 'Active', severity: 'medium', location: 'Main Gate' },
                { id: '3', type: 'Medical', status: 'Pending', severity: 'low', location: 'Zone C-5' },
              ].map((incident) => (
                <motion.div
                  key={incident.id}
                  variants={itemVariants}
                  className="p-4 hover:bg-slate-700/50 transition-colors cursor-pointer border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{incident.type} Incident</p>
                      <p className="text-xs text-slate-400 mt-1">{incident.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      incident.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                      incident.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className={`text-xs font-medium ${
                    incident.status === 'Active' ? 'text-red-400' : 'text-yellow-400'
                  }`}>{incident.status}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Center Pane: Tactical Map & Status */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Tactical Map
              </h2>
            </div>
            <div className="p-6 h-96 bg-slate-900/50 flex flex-col items-center justify-center">
              <MapPin className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-slate-500 text-center">
                Live geofence visualization and responder positions
              </p>
            </div>
            <div className="p-6 border-t border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">System Health</span>
                <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Network Status</span>
                <span className="text-green-400 font-medium">Connected</span>
              </div>
            </div>
          </motion.div>

          {/* Right Pane: Responder Matrix */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Responder Roster
              </h2>
            </div>
            <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
              {[
                { id: '1', name: 'Dr. Stella O.', type: 'Medical', zone: 'A-12', status: 'active' },
                { id: '2', name: 'Officer Obenga', type: 'Security', zone: 'Main', status: 'active' },
                { id: '3', name: 'Driver Chidi', type: 'Driver', zone: 'Transit', status: 'standby' },
              ].map((responder) => (
                <motion.div
                  key={responder.id}
                  variants={itemVariants}
                  className="p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{responder.name}</p>
                      <p className="text-xs text-slate-400">{responder.type}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${responder.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                  <p className="text-xs text-slate-400">Zone {responder.zone}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Event Log */}
        <motion.div
          variants={itemVariants}
          className="mt-12 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Recent Events</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {[
              { time: '14:32', event: 'Medical incident dispatched to Zone A-12', status: 'dispatched' },
              { time: '14:18', event: 'Security alert resolved at Main Gate', status: 'resolved' },
              { time: '14:05', event: 'Missing person reported in Zone C-5', status: 'pending' },
            ].map((log, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-mono text-sm">{log.time}</span>
                  <p className="text-slate-300 text-sm">{log.event}</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-medium ${
                  log.status === 'dispatched' ? 'bg-blue-500/20 text-blue-300' :
                  log.status === 'resolved' ? 'bg-green-500/20 text-green-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {log.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
