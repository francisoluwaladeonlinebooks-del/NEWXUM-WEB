'use client';

import { motion } from 'framer-motion';
import { Zap, MapPin, Users, Clock, TrendingUp, Navigation } from 'lucide-react';

export default function DriverDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <motion.div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Navigation className="w-8 h-8 text-green-600" />
                Shuttle Operations
              </h1>
              <p className="text-slate-600 text-sm mt-1">Driver Dashboard</p>
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
            { label: 'Active Routes', value: '3', icon: Navigation },
            { label: 'Pending Pickups', value: '5', icon: Clock },
            { label: 'Passengers Today', value: '47', icon: Users },
            { label: 'On-Time Rate', value: '96%', icon: TrendingUp },
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
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Vehicle Status */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Vehicle Status</h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Vehicle ID', value: 'SH-042', status: 'good' },
              { label: 'Fuel Level', value: '85%', status: 'good' },
              { label: 'Last Service', value: '2 days ago', status: 'good' },
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

        {/* Pickup Requests */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Pending Pickup Requests</h2>
          <motion.div className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/30 shadow-lg overflow-hidden">
            <div className="divide-y divide-slate-200">
              {[
                { id: '1', passengers: '4', pickup: 'Zone A-12', destination: 'Main Gate', time: 'Now' },
                { id: '2', passengers: '2', pickup: 'Hotel Plaza', destination: 'Camp Center', time: '5m' },
                { id: '3', passengers: '6', pickup: 'Zone C-5', destination: 'North Transit', time: '12m' },
              ].map((request) => (
                <motion.div
                  key={request.id}
                  variants={itemVariants}
                  className="p-6 hover:bg-green-50 transition-colors flex items-start justify-between border-l-4 border-green-500"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="inline-block w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {request.passengers}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{request.passengers} Passengers</p>
                        <p className="text-xs text-green-600 font-medium">Request in {request.time}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Pickup: {request.pickup}
                      </p>
                      <p className="flex items-center gap-2">
                        <Navigation className="w-4 h-4" /> Destination: {request.destination}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                    Accept
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Active Routes & Daily Summary */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/30 shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Current Route</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Zone A-12</p>
                  <p className="text-xs text-slate-600">Current Location</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Main Gate</p>
                  <p className="text-xs text-slate-600">Next Stop - 3.2km</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Camp Center</p>
                  <p className="text-xs text-slate-600">Final Destination - 5.8km</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Estimated Time</p>
              <p className="text-2xl font-bold text-green-600">18 min</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/30 shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Today's Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Routes</span>
                <span className="text-slate-900 font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Passengers</span>
                <span className="text-slate-900 font-semibold">126</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Distance Covered</span>
                <span className="text-slate-900 font-semibold">94.3 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Avg. Rating</span>
                <span className="text-yellow-600 font-semibold">4.8 ⭐</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
