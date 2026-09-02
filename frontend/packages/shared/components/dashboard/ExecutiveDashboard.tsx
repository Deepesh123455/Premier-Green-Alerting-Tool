'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShieldCheck,
  Truck,
  PackagePlus,
  Clock,
  ChevronRight,
  Bell,
  Menu,
  X,
  Scale,
  Users,
  Activity,
  Layers,
  Database,
  Wifi,
} from 'lucide-react';
import clsx from 'clsx';
import { useLiveEvents } from '../../hooks/useLiveEvents';

export const ExecutiveDashboard: React.FC = () => {
  const { data: events, isLoading } = useLiveEvents();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'visitors' | 'trucks' | 'incoming'>('dashboard');
  const [filterType, setFilterType] = useState<'all' | 'entry_exit' | 'truck_log' | 'incoming_report'>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derived metrics
  const totalCount = events?.length || 0;
  const entryExitLogs = events?.filter((e) => e.type === 'entry_exit') || [];
  const truckLogs = events?.filter((e) => e.type === 'truck_log') || [];
  const incomingReports = events?.filter((e) => e.type === 'incoming_report') || [];

  // Computed total quantities & weights
  const totalTruckTonnage = truckLogs.reduce((acc, curr) => acc + (Number(curr.details.quantity) || 0), 0);
  const totalIncomingTonnage = incomingReports.reduce((acc, curr) => acc + (Number(curr.details.quantity) || 0), 0);

  // Filtered live feed items
  const filteredEvents = events?.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handleKpiFilter = (type: 'all' | 'entry_exit' | 'truck_log' | 'incoming_report') => {
    setFilterType(type);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex font-sans text-[#1a2522]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sleek Sidebar - Clean White Theme */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-60 bg-white border-r border-[#e8eeeb] flex flex-col justify-between transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Clean White Logo Header */}
          <div className="p-4 border-b border-[#f0f4f2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Premier Green Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm tracking-tight text-[#1a2522] leading-tight">
                    Premier Green
                  </span>
                  <span className="text-[10px] text-[#71817E] font-normal leading-none mt-0.5">
                    Operations Hub
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-[#71817E] hover:text-[#1a2522]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-6 flex-1">
            {/* Primary Section */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dashboard');
                  setFilterType('all');
                  setSidebarOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer',
                  activeTab === 'dashboard' && filterType === 'all'
                    ? 'bg-[#e9f2ef] text-[#234D42] font-semibold shadow-2xs'
                    : 'text-[#60736f] hover:bg-[#f1f5f3] hover:text-[#1a2522]'
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#234D42]" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('visitors');
                  setFilterType('entry_exit');
                  setSidebarOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer',
                  filterType === 'entry_exit'
                    ? 'bg-[#e9f2ef] text-[#234D42] font-semibold'
                    : 'text-[#60736f] hover:bg-[#f1f5f3] hover:text-[#1a2522]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Gate Visitors</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#f8faf9] border border-[#e2e8e5] text-[#71817E]">
                  {entryExitLogs.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('trucks');
                  setFilterType('truck_log');
                  setSidebarOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer',
                  filterType === 'truck_log'
                    ? 'bg-[#e9f2ef] text-[#234D42] font-semibold'
                    : 'text-[#60736f] hover:bg-[#f1f5f3] hover:text-[#1a2522]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Truck Weighbridge</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#f8faf9] border border-[#e2e8e5] text-[#71817E]">
                  {truckLogs.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('incoming');
                  setFilterType('incoming_report');
                  setSidebarOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer',
                  filterType === 'incoming_report'
                    ? 'bg-[#e9f2ef] text-[#234D42] font-semibold'
                    : 'text-[#60736f] hover:bg-[#f1f5f3] hover:text-[#1a2522]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>Warehouse Inward</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#f8faf9] border border-[#e2e8e5] text-[#71817E]">
                  {incomingReports.length}
                </span>
              </button>
            </div>

            {/* System Status Group */}
            <div className="space-y-1.5">
              <span className="px-3 text-[10px] font-medium uppercase tracking-wider text-[#AAB6AE]">
                System Health
              </span>
              <div className="space-y-1 px-3 text-xs text-[#71817E]">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-3 h-3 text-[#234D42]" />
                    <span className="text-[11px]">Live WebSocket</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-3 h-3 text-[#234D42]" />
                    <span className="text-[11px]">PostgreSQL DB</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Profile Bar */}
          <div className="p-3 border-t border-[#f0f4f2]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#f8faf9] border border-[#eef2f0]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#234D42] text-white flex items-center justify-center font-medium text-xs shrink-0">
                  PG
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-xs text-[#1a2522] truncate">Operations Admin</span>
                  <span className="text-[10px] text-[#71817E] truncate">Premier Green Lead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e8eeeb] px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg bg-[#f8faf9] border border-[#d2ded8] text-[#234D42]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#71817E]">
              <span className="font-medium text-[#234D42]">Premier Green</span>
              <span>/</span>
              <span className="text-[#1a2522]">Operations Control</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#71817E]">
              <span className="hidden md:inline text-[11px] text-[#71817E]">Powered by</span>
              <span className="font-semibold text-[#234D42] text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                Premier Green Alerting
              </span>
            </div>
            <div className="w-px h-4 bg-[#e2e8e5] hidden sm:block" />
            <button
              type="button"
              className="p-1.5 rounded-lg bg-[#f8faf9] hover:bg-[#e9f2ef] border border-[#e2e8e5] text-[#50635e] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#234D42]" />
            </button>
          </div>
        </header>

        {/* Dashboard Main View Container */}
        <main className="flex-1 p-4 sm:p-7 space-y-5 max-w-7xl w-full mx-auto">
          {/* Header Title Section */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#1a2522] tracking-tight">
                Dashboard
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#234D42] animate-pulse" />
                Live Sync Active
              </span>
            </div>
            <p className="text-xs text-[#71817E] font-normal">
              Click any KPI card below to filter the live operations stream by category.
            </p>
          </div>

          {/* 4 Clean Interactive Clickable KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Total Alerts */}
            <button
              type="button"
              onClick={() => handleKpiFilter('all')}
              className={clsx(
                'border p-4 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-xs active:scale-[0.98]',
                filterType === 'all'
                  ? 'bg-[#e9f2ef]/40 border-[#234D42] ring-2 ring-[#234D42]/20 shadow-2xs'
                  : 'bg-white border-[#e8eeeb] hover:border-[#234D42]/40 hover:bg-[#f8faf9]'
              )}
              title="Click to show All Alerts"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={clsx(
                    'text-[10px] sm:text-[11px] font-medium uppercase tracking-wider',
                    filterType === 'all' ? 'text-[#234D42] font-semibold' : 'text-[#71817E]'
                  )}
                >
                  TOTAL ALERTS
                </span>
                <span className="p-1.5 rounded-lg bg-[#f8faf9] text-[#234D42] border border-[#eef2f0]">
                  <Layers className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#1a2522] tracking-tight">
                {totalCount}
              </div>
            </button>

            {/* Card 2: Gate Visitors */}
            <button
              type="button"
              onClick={() => handleKpiFilter('entry_exit')}
              className={clsx(
                'border p-4 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-xs active:scale-[0.98]',
                filterType === 'entry_exit'
                  ? 'bg-[#e9f2ef]/40 border-[#234D42] ring-2 ring-[#234D42]/20 shadow-2xs'
                  : 'bg-white border-[#e8eeeb] hover:border-[#234D42]/40 hover:bg-[#f8faf9]'
              )}
              title="Click to filter by Gate Visitors"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={clsx(
                    'text-[10px] sm:text-[11px] font-medium uppercase tracking-wider',
                    filterType === 'entry_exit' ? 'text-[#234D42] font-semibold' : 'text-[#71817E]'
                  )}
                >
                  GATE VISITORS
                </span>
                <span className="p-1.5 rounded-lg bg-[#e9f2ef] text-[#234D42]">
                  <Users className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#1a2522] tracking-tight">
                {entryExitLogs.length}
              </div>
            </button>

            {/* Card 3: Truck Logs */}
            <button
              type="button"
              onClick={() => handleKpiFilter('truck_log')}
              className={clsx(
                'border p-4 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-xs active:scale-[0.98]',
                filterType === 'truck_log'
                  ? 'bg-[#e9f2ef]/40 border-[#234D42] ring-2 ring-[#234D42]/20 shadow-2xs'
                  : 'bg-white border-[#e8eeeb] hover:border-[#234D42]/40 hover:bg-[#f8faf9]'
              )}
              title="Click to filter by Truck Logs"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={clsx(
                    'text-[10px] sm:text-[11px] font-medium uppercase tracking-wider',
                    filterType === 'truck_log' ? 'text-[#234D42] font-semibold' : 'text-[#71817E]'
                  )}
                >
                  TRUCK LOGS
                </span>
                <span className="p-1.5 rounded-lg bg-[#f8faf9] text-[#234D42] border border-[#eef2f0]">
                  <Truck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#1a2522] tracking-tight">
                {truckLogs.length}
              </div>
            </button>

            {/* Card 4: Incoming Stock */}
            <button
              type="button"
              onClick={() => handleKpiFilter('incoming_report')}
              className={clsx(
                'border p-4 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-xs active:scale-[0.98]',
                filterType === 'incoming_report'
                  ? 'bg-[#e9f2ef]/40 border-[#234D42] ring-2 ring-[#234D42]/20 shadow-2xs'
                  : 'bg-white border-[#e8eeeb] hover:border-[#234D42]/40 hover:bg-[#f8faf9]'
              )}
              title="Click to filter by Inward Stock"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={clsx(
                    'text-[10px] sm:text-[11px] font-medium uppercase tracking-wider',
                    filterType === 'incoming_report' ? 'text-[#234D42] font-semibold' : 'text-[#71817E]'
                  )}
                >
                  INWARD STOCK
                </span>
                <span className="p-1.5 rounded-lg bg-[#f8faf9] text-[#234D42] border border-[#eef2f0]">
                  <PackagePlus className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#1a2522] tracking-tight">
                {incomingReports.length}
              </div>
            </button>
          </div>

          {/* Middle Row: 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Box: Recent Visitor & Gate Logs */}
            <div className="bg-white border border-[#e8eeeb] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#f0f4f2]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#e9f2ef] text-[#234D42]">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="font-semibold text-sm text-[#1a2522]">
                      Recent Visitor & Gate Logs
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleKpiFilter('entry_exit')}
                    className="text-xs font-medium text-[#234D42] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* List items */}
                <div className="space-y-2.5">
                  {entryExitLogs.length === 0 ? (
                    <div className="py-10 text-center text-xs text-[#71817E]">
                      No visitor check-ins recorded yet.
                    </div>
                  ) : (
                    entryExitLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#f8faf9] hover:bg-[#f1f5f3] border border-[#eef2f0] transition-colors"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-xs sm:text-sm text-[#1a2522] truncate">
                            {log.details.visitorName}
                          </span>
                          <span className="text-[11px] text-[#71817E] truncate">
                            Meeting: {log.details.personToMeet || 'Operations'} • {log.details.purpose || 'General Visit'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#e9f2ef] text-[#234D42]">
                            New
                          </span>
                          <span className="text-[10px] text-[#71817E]">
                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Box: Recent Material Dispatches & Stock */}
            <div className="bg-white border border-[#e8eeeb] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#f0f4f2]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#e9f2ef] text-[#234D42]">
                      <Scale className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="font-semibold text-sm text-[#1a2522]">
                      Recent Material Dispatches & Stock
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleKpiFilter('truck_log')}
                    className="text-xs font-medium text-[#234D42] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* List items */}
                <div className="space-y-2.5">
                  {truckLogs.length === 0 && incomingReports.length === 0 ? (
                    <div className="py-10 text-center text-xs text-[#71817E]">
                      No material logs recorded yet.
                    </div>
                  ) : (
                    [...truckLogs, ...incomingReports]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 5)
                      .map((item) => {
                        const isTruck = item.type === 'truck_log';
                        const qty = Number(item.details.quantity) || 0;
                        const rate = Number(isTruck ? item.details.rate : item.details.price) || 0;
                        const total = (qty * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-[#f8faf9] hover:bg-[#f1f5f3] border border-[#eef2f0] transition-colors"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-xs sm:text-sm text-[#1a2522] truncate">
                                {item.details.material} — {isTruck ? item.details.vehicleNumber : item.details.vendorName} ({item.details.quantity} {item.details.quantityUnit || 'MT'})
                              </span>
                              <span className="text-[11px] text-[#71817E] truncate">
                                {isTruck ? `Driver: ${item.details.driverName}` : `Trader: ${item.details.tradersCompany}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span className="font-semibold text-xs text-[#234D42]">
                                ₹ / $ {total}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#e9f2ef] text-[#234D42]">
                                {isTruck ? 'Dispatched' : 'Received'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Operations Activity & Master Stream */}
          <div className="bg-white border border-[#e8eeeb] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#f0f4f2]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#e9f2ef] text-[#234D42]">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-semibold text-sm text-[#1a2522]">
                  Operations Activity Stream
                </h2>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1 bg-[#f8faf9] p-0.5 rounded-lg border border-[#e8eeeb] text-xs">
                <button
                  type="button"
                  onClick={() => setTimeRange('7d')}
                  className={clsx(
                    'px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                    timeRange === '7d' ? 'bg-[#234D42] text-white shadow-2xs' : 'text-[#71817E] hover:text-[#1a2522]'
                  )}
                >
                  7 days
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('30d')}
                  className={clsx(
                    'px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                    timeRange === '30d' ? 'bg-[#234D42] text-white shadow-2xs' : 'text-[#71817E] hover:text-[#1a2522]'
                  )}
                >
                  30 days
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('all')}
                  className={clsx(
                    'px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                    timeRange === 'all' ? 'bg-[#234D42] text-white shadow-2xs' : 'text-[#71817E] hover:text-[#1a2522]'
                  )}
                >
                  All time
                </button>
              </div>
            </div>

            {/* 4 Interactive Clickable Activity Summary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleKpiFilter('truck_log')}
                className={clsx(
                  'p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer active:scale-98',
                  filterType === 'truck_log'
                    ? 'bg-[#e9f2ef]/50 border-[#234D42] ring-1 ring-[#234D42]/20'
                    : 'bg-[#f8faf9] border-[#e8eeeb] hover:border-[#234D42]/30 hover:bg-[#f1f5f3]'
                )}
                title="Click to filter by Truck Dispatches"
              >
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#71817E] block mb-0.5">
                  TOTAL DISPATCHED
                </span>
                <span className="text-xl font-semibold text-[#1a2522]">
                  {totalTruckTonnage.toLocaleString()} MT
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleKpiFilter('incoming_report')}
                className={clsx(
                  'p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer active:scale-98',
                  filterType === 'incoming_report'
                    ? 'bg-[#e9f2ef]/50 border-[#234D42] ring-1 ring-[#234D42]/20'
                    : 'bg-[#f8faf9] border-[#e8eeeb] hover:border-[#234D42]/30 hover:bg-[#f1f5f3]'
                )}
                title="Click to filter by Inward Stock"
              >
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#71817E] block mb-0.5">
                  INWARD STOCK
                </span>
                <span className="text-xl font-semibold text-[#234D42]">
                  {totalIncomingTonnage.toLocaleString()} MT
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleKpiFilter('entry_exit')}
                className={clsx(
                  'p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer active:scale-98',
                  filterType === 'entry_exit'
                    ? 'bg-[#e9f2ef]/50 border-[#234D42] ring-1 ring-[#234D42]/20'
                    : 'bg-[#f8faf9] border-[#e8eeeb] hover:border-[#234D42]/30 hover:bg-[#f1f5f3]'
                )}
                title="Click to filter by Visitor Check-Ins"
              >
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#71817E] block mb-0.5">
                  GATE CHECK-INS
                </span>
                <span className="text-xl font-semibold text-[#354541]">
                  {entryExitLogs.length} Visitors
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleKpiFilter('all')}
                className={clsx(
                  'p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer active:scale-98',
                  filterType === 'all'
                    ? 'bg-[#e9f2ef]/50 border-[#234D42] ring-1 ring-[#234D42]/20'
                    : 'bg-[#f8faf9] border-[#e8eeeb] hover:border-[#234D42]/30 hover:bg-[#f1f5f3]'
                )}
                title="Click to show All Real-Time Broadcasts"
              >
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#71817E] block mb-0.5">
                  LIVE BROADCASTS
                </span>
                <span className="text-xl font-semibold text-[#234D42]">
                  100% Real-Time
                </span>
              </button>
            </div>

            {/* Live Event Cards Feed */}
            <div className="pt-1 space-y-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#71817E]">
                  Live Stream Event Feed ({filteredEvents?.length || 0} Records)
                </span>
                {filterType !== 'all' && (
                  <button
                    type="button"
                    onClick={() => handleKpiFilter('all')}
                    className="text-xs font-medium text-[#234D42] hover:underline cursor-pointer"
                  >
                    Reset Filter (Show All)
                  </button>
                )}
              </div>

              {isLoading && (
                <div className="py-10 text-center text-xs text-[#71817E]">
                  Loading real-time records...
                </div>
              )}

              {!isLoading && filteredEvents?.length === 0 && (
                <div className="py-10 text-center text-xs text-[#71817E]">
                  No operational records found for the selected view.
                </div>
              )}

              {filteredEvents?.map((item) => {
                const isEntry = item.type === 'entry_exit';
                const isTruck = item.type === 'truck_log';
                const qty = Number(item.details.quantity) || 0;
                const rate = Number(isTruck ? item.details.rate : item.details.price) || 0;
                const total = (qty * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const timeFormatted = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="animate-slide-down p-3.5 rounded-xl bg-white border border-[#e8eeeb] hover:border-[#234D42]/30 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-[#e9f2ef] text-[#234D42] shrink-0">
                        {isEntry ? <Users className="w-3.5 h-3.5" /> : isTruck ? <Truck className="w-3.5 h-3.5" /> : <PackagePlus className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-xs sm:text-sm text-[#1a2522]">
                            {isEntry ? item.details.visitorName : isTruck ? `${item.details.vehicleNumber} (${item.details.material})` : `${item.details.material} (${item.details.vendorName})`}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#f8faf9] border border-[#e2e8e5] text-[#71817E]">
                            {isEntry ? 'Gate Visitor' : isTruck ? 'Truck Dispatch' : 'Warehouse Inward'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#71817E] mt-0.5 truncate font-normal">
                          {isEntry
                            ? `Meeting: ${item.details.personToMeet || '—'} • Purpose: ${item.details.purpose || '—'}`
                            : isTruck
                            ? `Driver: ${item.details.driverName} • ${item.details.quantity} ${item.details.quantityUnit || 'MT'} @ $${item.details.rate}`
                            : `Vendor: ${item.details.vendorName} • Trader: ${item.details.tradersCompany} • ${item.details.quantity} ${item.details.quantityUnit || 'MT'}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f4f2]">
                      {!isEntry && (
                        <div className="text-right">
                          <span className="text-[9px] text-[#71817E] block uppercase font-medium">Total Amount</span>
                          <span className="text-xs sm:text-sm font-semibold text-[#234D42]">₹ / $ {total}</span>
                        </div>
                      )}
                      <div className="text-right flex items-center gap-1 text-[11px] text-[#71817E] bg-[#f8faf9] px-2 py-0.5 rounded-lg border border-[#e8eeeb]">
                        <Clock className="w-3 h-3 text-[#71817E]" />
                        <span>{timeFormatted}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
