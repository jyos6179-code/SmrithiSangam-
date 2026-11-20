import React from 'react';
import { Smartphone, Sparkles, Volume2, Wifi } from 'lucide-react';
import { NetworkStatus } from '../../services/storageService';

interface DeviceFrameWrapperProps {
  isDeviceFrame: boolean;
  networkStatus: NetworkStatus;
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  isDeviceFrame,
  networkStatus,
  children,
}) => {
  if (!isDeviceFrame) {
    return <main className="min-h-[calc(100vh-60px)] pb-12">{children}</main>;
  }

  return (
    <div className="min-h-[calc(100vh-60px)] py-8 px-4 flex flex-col items-center justify-center bg-slate-900/10">
      {/* Device frame header info for hackathon judges */}
      <div className="mb-3 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide shadow-sm">
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Low-End Android Device Simulator (390×810dp) · NER Skew Optimized</span>
        </span>
      </div>

      {/* Simulated Android Phone Shell */}
      <div className="relative w-full max-w-[410px] h-[830px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 ring-12 ring-slate-900/30 flex flex-col overflow-hidden">
        {/* Top Speaker / Camera Notch */}
        <div className="w-32 h-4 bg-slate-900 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-950" />
          <div className="w-10 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Android Simulated Status Bar */}
        <div className="h-6 px-4 flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 shrink-0 bg-white/90 border-b border-amber-200">
          <span>09:41 AM</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-sans">
              {networkStatus === 'online' ? '4G VoLTE' : networkStatus === '2g_weak' ? '2G Edge' : 'No Service'}
            </span>
            <Wifi className="w-3 h-3" />
            <span>88%</span>
          </div>
        </div>

        {/* Inner Phone Viewport */}
        <div className="flex-1 bg-amber-50/40 overflow-y-auto rounded-b-[36px]">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto my-1 shrink-0" />
      </div>
    </div>
  );
};
