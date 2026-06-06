'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginContent() {
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
      href: '/login/worshipper',
      title: 'Pilgrim Hub',
      description: 'Book accommodation & stay connected',
      color: 'from-blue-600 to-blue-700',
      features: ['Browse properties', 'Book accommodation', 'Report incidents', 'Safety alerts'],
    },
    {
      name: 'Responder',
      href: '/login/responder',
      title: 'Operations Hub',
      description: 'Real-time emergency response coordination',
      color: 'from-amber-600 to-orange-700',
      features: ['Dispatch alerts', 'Manage response', 'Coordinate teams', 'Secure comms'],
    },
    {
      name: 'HQ Admin',
      href: '/login/admin',
      title: 'Command Center',
      description: 'Camp operations & system control',
      color: 'from-purple-600 to-purple-700',
      features: ['Full management', 'Monitor alerts', 'Control bookings', 'Geofencing admin'],
    },
  ];

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

        {/* Role Selection Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={itemVariants}
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link href={role.href}>
                <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all cursor-pointer h-full flex flex-col">
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
                    Access Portal
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-xl bg-white/40 rounded-2xl p-6 border border-white/30 shadow-xl text-center"
        >
          <p className="text-sm text-slate-700 mb-4">
            Each portal includes both <span className="font-semibold">Sign In</span> and <span className="font-semibold">Sign Up</span> options. Demo bypass presets available for testing.
          </p>
          <p className="text-xs text-slate-500">
            Secure login powered by Nexum Gateway Session Protocol
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
