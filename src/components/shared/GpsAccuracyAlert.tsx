'use client';

import { MapPin } from 'lucide-react';

interface GpsAccuracyAlertProps {
  accuracyM: number | null;
}

export function GpsAccuracyAlert({ accuracyM }: GpsAccuracyAlertProps) {
  const getStyles = () => {
    if (accuracyM === null) {
      return {
        bgColor: 'bg-nexum-red',
        textColor: 'text-nexum-red',
        label: 'No GPS',
      };
    }

    if (accuracyM <= 5) {
      return {
        bgColor: 'bg-nexum-green',
        textColor: 'text-nexum-green',
        label: `±${accuracyM.toFixed(1)}m`,
      };
    }

    if (accuracyM <= 15) {
      return {
        bgColor: 'bg-nexum-amber-500',
        textColor: 'text-nexum-amber-500',
        label: `±${accuracyM.toFixed(1)}m`,
      };
    }

    return {
      bgColor: 'bg-nexum-red',
      textColor: 'text-nexum-red',
      label: `±${accuracyM.toFixed(1)}m (Low)`,
    };
  };

  const styles = getStyles();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${styles.bgColor} bg-opacity-10`}>
      <MapPin className={`w-4 h-4 ${styles.textColor}`} />
      <span className={`text-sm font-medium ${styles.textColor}`}>
        {styles.label}
      </span>
    </div>
  );
}
