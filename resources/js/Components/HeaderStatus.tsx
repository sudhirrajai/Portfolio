import React, { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';

export const HeaderStatus: React.FC = () => {
  const { profile } = usePage().props as any;
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata' // Matches IST/Sudhir timezone default
      };
      setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const checkIsActiveNow = () => {
    if (!profile || profile.is_available === false) return false;

    try {
      // Get current date in user's timeZone
      const nowStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      const nowDate = new Date(nowStr);
      const currentTotalMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();

      const [startH, startM] = (profile.working_hours_start || '09:00').split(':').map(Number);
      const [endH, endM] = (profile.working_hours_end || '18:00').split(':').map(Number);

      const startTotalMinutes = startH * 60 + startM;
      const endTotalMinutes = endH * 60 + endM;

      return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
    } catch (e) {
      return true; // Fallback safe default
    }
  };

  const isCurrentlyAvailable = checkIsActiveNow();
  const statusColorClass = isCurrentlyAvailable ? 'bg-[#00FF66]' : 'bg-red-500';
  const statusLabel = isCurrentlyAvailable ? 'AVAILABLE' : 'UNAVAILABLE';

  return (
    <Link
      href="/contact"
      id="header-status-widget"
      className="fixed top-8 right-4 md:right-8 z-[2000] flex items-center h-[34px] px-3 md:px-4 bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white text-[10px] md:text-[11px] font-medium uppercase leading-none tracking-wider group hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
    >
      {/* Pulsing status beacon */}
      <div className="relative flex items-center mr-2">
        <span className={`absolute inline-flex h-2 w-2 rounded-full ${statusColorClass} opacity-75 animate-ping`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${statusColorClass}`}></span>
      </div>
      
      <span className="mr-2 md:mr-3 select-none">{statusLabel}</span>

      {/* Divider */}
      <div className="w-[1px] h-3 bg-black/20 dark:bg-white/20 mr-2 md:mr-3 hidden sm:block"></div>

      {/* Live Location & Time */}
      <div className="hidden sm:flex items-center font-normal select-none group-hover:font-medium transition-all">
        <span>{profile?.location || 'MUMBAI, IND'}</span>
        <span className="mx-1 opacity-40">•</span>
        <span className="tabular-nums tracking-[0.5px]">{time}</span>
      </div>
    </Link>
  );
};
