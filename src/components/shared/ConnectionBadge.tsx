'use client';

import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

type ConnectionStatus = 'live' | 'reconnecting' | 'offline' | 'sms';

interface ConnectionBadgeProps {
  status: ConnectionStatus;
}

export function ConnectionBadge({ status }: ConnectionBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'live':
        return {
          bgColor: 'bg-nexum-green',
          dotColor: 'bg-nexum-green',
          textColor: 'text-nexum-green',
          label: 'Live',
          icon: Wifi,
        };
      case 'reconnecting':
        return {
          bgColor: 'bg-nexum-amber-500',
          dotColor: 'bg-nexum-amber-500',
          textColor: 'text-nexum-amber-500',
          label: 'Reconnecting',
          icon: Wifi,
        };
      case 'offline':
        return {
          bgColor: 'bg-nexum-red',
          dotColor: 'bg-nexum-red',
          textColor: 'text-nexum-red',
          label: 'Offline',
          icon: WifiOff,
        };
      case 'sms':
        return {
          bgColor: 'bg-nexum-amber-500',
          dotColor: 'bg-nexum-amber-500',
          textColor: 'text-nexum-amber-500',
          label: 'SMS Mode',
          icon: Wifi,
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${styles.bgColor} bg-opacity-10`}>
      <div className="relative flex items-center">
        <Icon className={`w-4 h-4 ${styles.textColor}`} />
        {status === 'reconnecting' && (
          <motion.div
            className={`absolute inset-0 ${styles.dotColor} rounded-full`}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        {status === 'live' && (
          <motion.div
            className={`absolute w-2 h-2 ${styles.dotColor} rounded-full right-0 bottom-0`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <span className={`text-sm font-medium ${styles.textColor}`}>
        {styles.label}
      </span>
    </div>
  );
}
