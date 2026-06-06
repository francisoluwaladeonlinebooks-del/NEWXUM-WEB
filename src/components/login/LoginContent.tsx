'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type RoleType = 'worshipper' | 'responder' | 'admin' | null;

export default function LoginContent() {
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [selectedResponderType, setSelectedResponderType] = useState<'medical' | 'security' | 'driver' | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const roles = [
    {
      name: 'Worshipper',
      value: 'worshipper',
      title: 'Pilgrim Hub',
      description: 'Book accommodation & stay connected',
      color: 'from-blue-600 to-blue-700',
      features: ['Browse properties', 'Book accommodation', 'Report incidents', 'Safety alerts'],
    },
    {
      name: 'Responder',
      value: 'responder',
      title: 'Operations Hub',
      description: 'Real-time emergency response coordination',
      color: 'from-amber-600 to-orange-700',
      features: ['Dispatch alerts', 'Manage response', 'Coordinate teams', 'Secure comms'],
    },
    {
      name: 'HQ Admin',
      value: 'admin',
      title: 'Command Center',
      description: 'Camp operations & system control',
      color: 'from-purple-600 to-purple-700',
      features: ['Full management', 'Monitor alerts', 'Control bookings', 'Geofencing admin'],
    },
  ];

  const responderTypes = [
    {
      name: 'Medical Officer',
      value: 'medical',
      title: 'Emergency Medical',
      description: 'Respond to medical emergencies and coordinate patient care',
      color: 'from-red-600 to-red-700',
      features: ['Medical assessments', 'Patient coordination', 'Vital tracking', 'Incident reports'],
      icon: '🚑',
    },
    {
      name: 'Security Officer',
      value: 'security',
      title: 'Security Response',
      description: 'Handle security issues and crowd management',
      color: 'from-slate-700 to-slate-800',
      features: ['Crowd control', 'Incident response', 'Perimeter security', 'Officer coordination'],
      icon: '🛡️',
    },
    {
      name: 'Driver',
      value: 'driver',
      title: 'Shuttle Operations',
      description: 'Manage shuttle routes and transport services',
      color: 'from-green-600 to-green-700',
      features: ['Route management', 'Passenger pickup', 'Vehicle tracking', 'Trip scheduling'],
      icon: '🚐',
    },
  ];

  const getResponderTypeRoute = () => {
    if (selectedRole !== 'responder' || !selectedResponderType) return null;
    return `/login/responder?type=${selectedResponderType}`;
  };

  const getRoleRoute = () => {
    if (selectedRole === 'worshipper') return '/login/worshipper';
    if (selectedRole === 'admin') return '/login/admin';
    if (selectedRole === 'responder' && selectedResponderType) return getResponderTypeRoute();
    return null;
  };

  const handleRoleSelect = (role: RoleType) => {
    if (role === 'responder') {
      setSelectedRole(role);
      setSelectedResponderType(null);
    } else {
      setSelectedRole(role);
    }
  };

  const handleResponderTypeSelect = (type: 'medical' | 'security' | 'driver') => {
    setSelectedResponderType(type);
  };

  const handleBack = () => {
    if (selectedResponderType) {
      setSelectedResponderType(null);
    } else {
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl relative z-10"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <div className="inline-block backdrop-blur-xl bg-gradient-to-br from-[#0047AB]/80 to-[#003580]/80 rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
            <div className="text-sm font-semibold text-blue-100/70 mb-2">NEXUM CAMP SYSTEM V2.5</div>
            <h1 className="text-5xl font-bold text-white mb-3">Nexum</h1>
            <p className="text-blue-100/80 text-base">Safety Intelligence for Redemption City</p>
            <div className="border-t border-blue-400/30 mt-6 pt-6 max-w-2xl">
              <p className="text-sm text-blue-100/70">Real-time emergency dispatch, automated escalation, and crowd coordination for the world's largest regular gathering</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedRole ? (
            /* Role Selection Screen */
            <motion.div
              key="roles"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {roles.map((role, index) => (
                <motion.div
                  key={role.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <button
                    onClick={() => handleRoleSelect(role.value as RoleType)}
                    className="w-full text-left backdrop-blur-xl bg-white/80 rounded-2xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all cursor-pointer h-full flex flex-col"
                  >
                    {/* Color accent */}
                    <div className={`h-1 w-16 bg-gradient-to-r ${role.color} rounded-full mb-4`} />

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{role.title}</h3>
                    <p className="text-slate-600 text-sm mb-6">{role.description}</p>

                    {/* Features */}
                    <div className="space-y-2 flex-grow mb-6">
                      {role.features.map((feature) => (
                        <motion.div
                          key={feature}
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                        >
                          <div className={`w-2 h-2 bg-gradient-to-r ${role.color} rounded-full mt-1.5 flex-shrink-0`} />
                          <p className="text-xs text-slate-600">{feature}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                      className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${role.color} text-white font-semibold text-center text-sm`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue
                    </motion.div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : selectedRole === 'responder' && !selectedResponderType ? (
            /* Responder Type Selection Screen */
            <motion.div
              key="responder-types"
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Back Button */}
              <motion.button
                onClick={handleBack}
                className="flex items-center gap-2 mb-8 text-[#0047AB] font-semibold hover:opacity-75 transition-opacity"
                whileHover={{ x: -4 }}
              >
                <ChevronLeft className="w-5 h-5" />
                Back to roles
              </motion.button>

              {/* Selection Title */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold text-slate-900 mb-2">Select Your Responder Type</h2>
                <p className="text-slate-600">Choose your specialization to access your operations dashboard</p>
              </motion.div>

              {/* Responder Type Cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, staggerChildren: 0.1 }}
              >
                {responderTypes.map((type, index) => (
                  <motion.div
                    key={type.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Link href={`/login/responder?type=${type.value}`}>
                      <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all cursor-pointer h-full flex flex-col">
                        {/* Icon */}
                        <div className="text-5xl mb-4">{type.icon}</div>

                        {/* Color accent */}
                        <div className={`h-1 w-16 bg-gradient-to-r ${type.color} rounded-full mb-4`} />

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{type.title}</h3>
                        <p className="text-slate-600 text-sm mb-6">{type.description}</p>

                        {/* Features */}
                        <div className="space-y-2 flex-grow mb-6">
                          {type.features.map((feature) => (
                            <motion.div
                              key={feature}
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              whileHover={{ opacity: 1, x: 0 }}
                            >
                              <div className={`w-2 h-2 bg-gradient-to-r ${type.color} rounded-full mt-1.5 flex-shrink-0`} />
                              <p className="text-xs text-slate-600">{feature}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* CTA */}
                        <motion.div
                          className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${type.color} text-white font-semibold text-center text-sm`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Select {type.name}
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* Role Login Page */
            <motion.div
              key="login-page"
              className="backdrop-blur-xl bg-white/40 rounded-2xl p-6 border border-white/30 shadow-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Back Button */}
              <motion.button
                onClick={handleBack}
                className="flex items-center gap-2 mb-6 text-[#0047AB] font-semibold hover:opacity-75 transition-opacity"
                whileHover={{ x: -4 }}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </motion.button>

              <p className="text-sm text-slate-700 mb-4">
                Redirecting to {selectedRole === 'worshipper' ? 'Worshipper' : selectedRole === 'admin' ? 'Admin' : 'Responder'} login...
              </p>
              
              {getRoleRoute() ? (
                <Link href={getRoleRoute()!} className="text-[#0047AB] font-semibold hover:underline">
                  Continue to login
                </Link>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        {!selectedRole && (
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/40 rounded-2xl p-6 border border-white/30 shadow-xl text-center"
          >
            <p className="text-sm text-slate-700 mb-4">
              Each portal includes both <span className="font-semibold">Sign In</span> and <span className="font-semibold">Sign Up</span> options.
            </p>
            <p className="text-xs text-slate-500">
              Secure login powered by Nexum Gateway Session Protocol
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
