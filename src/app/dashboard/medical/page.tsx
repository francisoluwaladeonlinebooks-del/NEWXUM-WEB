'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Heart, Stethoscope, MapPin, Clock, Users } from 'lucide-react';

export default function MedicalDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <motion.div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-600" />
                Emergency Medical
              </h1>
              <p className="text-slate-600 text-sm mt-1">Medical Officer Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                <span className="text-green-700 font-medium text-sm">AVAILABLE</span>
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
            { label: 'Active Incidents', value: '8', icon: AlertCircle },
            { label: 'Pending Dispatch', value: '3', icon: Clock },
            { label: 'Patients Today', value: '24', icon: Stethoscope },
            { label: 'Response Ready', value: '100%', icon: Heart },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="backdrop-blur-xl bg-white/80 rounded-2xl p-6 border border-white/30 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <Icon className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-3xl font-bold text-red-600">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dispatch Readiness */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Dispatch Readiness</h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'GPS Status', value: 'Active', status: 'good' },
              { label: 'Connection', value: '5G Strong', status: 'good' },
              { label: 'Battery Level', value: '92%', status: 'good' },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className={`backdrop-blur-xl bg-white/80 rounded-2xl p-6 border-2 ${
                  item.status === 'good' ? 'border-green-200' : 'border-yellow-200'
                } shadow-lg`}
              >
                <p className="text-slate-600 text-sm font-medium mb-2">{item.label}</p>
                <p className={`text-2xl font-bold ${item.status === 'good' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Active Incident Queue */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Incident Queue</h2>
          <motion.div className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/30 shadow-lg overflow-hidden">
            <div className="divide-y divide-slate-200">
              {[
                { id: '1', priority: '1', type: 'Chest Pain', location: 'Zone A-12', vitals: '120/80, HR:98' },
                { id: '2', priority: '2', type: 'Minor Injury', location: 'Zone B-5', vitals: 'Stable' },
                { id: '3', priority: '3', type: 'Fainting', location: 'Main Gate', vitals: '110/70, HR:85' },
              ].map((incident) => (
                <motion.div
                  key={incident.id}
                  variants={itemVariants}
                  className="p-6 hover:bg-red-50 transition-colors flex items-start justify-between border-l-4 border-red-500"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="inline-block w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {incident.priority}
                      </span>
                      <p className="font-semibold text-slate-900">{incident.type}</p>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {incident.location}
                    </p>
                    <p className="text-xs text-slate-500">{incident.vitals}</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
                    Respond
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Missing Person Alerts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Missing Person Alerts</h2>
          <motion.div className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/30 shadow-lg p-8 text-center">
            <p className="text-slate-600">No active missing person alerts for your medical unit</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
