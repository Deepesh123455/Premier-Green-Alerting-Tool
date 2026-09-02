'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShieldCheck,
  Truck,
  PackagePlus,
  Radio,
  Clock,
  Calendar,
  ChevronRight,
  Bell,
  Menu,
  X,
  Scale,
  Users,
  Building2,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Database,
  Wifi,
  Smartphone
} from 'lucide-react';
import clsx from 'clsx';
import { useLiveEvents } from '../../hooks/useLiveEvents';
import { LiveFeedItem } from '../../types/event';

export const ExecutiveDashboard: React.FC = () => {
  const { data: events, isLoading, error } = useLiveEvents();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'visitors' | 'trucks' | 'incoming' | 'stream'>('dashboard');
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#e2e8e5] flex flex-col justify-between transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Badge at Top of Sidebar (Like FOIP 2.0 in reference) */}
          <div className="p-4 border-b border-[#eef2f0]">
            <div className="bg-[#17332c] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Premier Green Logo"
                    width={32}
                    height={32}
                    className="object-contain drop-shadow-xs"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-tight text-white">PREMIER</span>
                    <span className="text-[10px] bg-[#234D42] text-[#AAB6AE] px-1.5 py-0.5 rounded font-mono font-bold">2.0</span>
                  </div>
                  <span className="text-[10px] text-[#AAB6AE] font-medium leading-none mt-0.5">
                    Operations Hub
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-[#AAB6AE] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-6 flex-1">
            {/* Primary Section */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dashboard');
                  setFilterType('all');
                  setSidebarOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer',
                  activeTab === 'dashboard' && filterType === 'all'
                    ? 'bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/20 shadow-xs'
                    : 'text-[#50635e] hover:bg-[#f1f5f3] hover:text-[#1a2522]'
                )}
              >
                <LayoutDashboard className="w-4 h-4 text-[#234D42]" />
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
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                  filterType === 'entry_exit'
                    ? 'bg-[#e9f2ef] text-[#234D42] font-bold border border-[#234D42]/20'
                    : 'text-[#50635e] hover:bg-[#f1f5f3] hover:text-[#1a2522]'
                )}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Gate Visitors</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#d2ded8] text-[#71817E] font-bold">
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
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                  filterType === 'truck_log'
                    ? 'bg-[#e9f2ef] text-[#234D42] font-bold border border-[#234D42]/20'
                    : 'text-[#50635e] hover:bg-[#f1f5f3] hover:text-[#1a2522]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4" />
                  <span>Truck Weighbridge</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#d2ded8] text-[#71817E] font-bold">
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
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                  filterType === 'incoming_report'
                    ? 'bg-[#e9f2ef] text-[#234D42] font-bold border border-[#234D42]/20'
                    : 'text-[#50635e] hover:bg-[#f1f5f3] hover:text-[#1a2522]'
                )}
              >
                <div className="flex items-center gap-3">
                  <PackagePlus className="w-4 h-4" />
                  <span>Warehouse Inward</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#d2ded8] text-[#71817E] font-bold">
                  {incomingReports.length}
                </span>
              </button>
            </div>

            {/* Department Terminals Group */}
            <div className="space-y-2">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#AAB6AE]">
                Mobile Terminal Links
              </span>
              <div className="space-y-1">
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#50635e] hover:bg-[#f1f5f3] hover:text-[#234D42] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#71817E]" />
                    <span>Gate Terminal (3001)</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#AAB6AE]" />
                </a>

                <a
                  href="http://localhost:3002"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#50635e] hover:bg-[#f1f5f3] hover:text-[#234D42] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#71817E]" />
                    <span>Truck Terminal (3002)</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#AAB6AE]" />
                </a>

                <a
                  href="http://localhost:3003"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#50635e] hover:bg-[#f1f5f3] hover:text-[#234D42] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#71817E]" />
                    <span>Inward Terminal (3003)</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#AAB6AE]" />
                </a>
              </div>
            </div>

            {/* System Status Group */}
            <div className="space-y-2">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#AAB6AE]">
                System Health
              </span>
              <div className="space-y-1 px-3 text-xs text-[#71817E]">
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5 text-[#234D42]" />
                    <span className="text-[11px] font-medium">Socket Live Stream</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-[#234D42]" />
                    <span className="text-[11px] font-medium">PostgreSQL Supabase</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Profile Bar (Like "Abhimanyu Singh - Owner" in reference) */}
          <div className="p-3 border-t border-[#eef2f0]">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-[#f8faf9] border border-[#e2e8e5]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#17332c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  PG
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-[#1a2522] truncate">Operations Admin</span>
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
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2e8e5] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#f8faf9] border border-[#d2ded8] text-[#234D42]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#71817E]">
              <span className="font-bold text-[#234D42]">Premier Green Innovations</span>
              <span>/</span>
              <span className="font-semibold text-[#1a2522]">Operations Control Center</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs text-[#71817E]">
              <span className="hidden md:inline text-[11px] font-medium text-[#71817E]">Powered by</span>
              <span className="font-extrabold text-[#234D42] text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
                Premier Green Alerting
              </span>
            </div>
            <div className="w-px h-5 bg-[#e2e8e5] hidden sm:block" />
            <button
              type="button"
              className="p-2 rounded-xl bg-[#f8faf9] hover:bg-[#e9f2ef] border border-[#d2ded8] text-[#50635e] transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#234D42]" />
            </button>
          </div>
        </header>

        {/* Dashboard Main View Container */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Title Section (Like "Dashboard — Agent not yet connected" in screenshot) */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a2522] tracking-tight">
                Dashboard
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/20">
                <span className="w-2 h-2 rounded-full bg-[#234D42] animate-pulse" />
                Live WebSocket Connected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#71817E]">
              PGI Operations — Live gate visitor logs, weighbridge dispatches, and warehouse inward stock monitoring.
            </p>
          </div>

          {/* 5 KPI Metric Cards Row (Exact layout from reference screenshot) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Card 1: Total Alerts */}
            <button
              type="button"
              onClick={() => handleKpiFilter('all')}
              className={clsx(
                'bg-white border p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-md active:scale-98',
                filterType === 'all'
                  ? 'border-[#234D42] ring-2 ring-[#234D42]/20 shadow-sm'
                  : 'border-[#e2e8e5] hover:border-[#234D42]/40'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#71817E]">
                  TOTAL ALERTS
                </span>
                <span className="p-2 rounded-xl bg-[#f8faf9] text-[#234D42] border border-[#e2e8e5]">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-[#1a2522] tracking-tight">
                {totalCount}
              </div>
            </button>

            {/* Card 2: Gate Visitors */}
            <button
              type="button"
              onClick={() => handleKpiFilter('entry_exit')}
              className={clsx(
                'bg-white border p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-md active:scale-98',
                filterType === 'entry_exit'
                  ? 'border-[#234D42] ring-2 ring-[#234D42]/20 shadow-sm'
                  : 'border-[#e2e8e5] hover:border-[#234D42]/40'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#71817E]">
                  GATE VISITORS
                </span>
                <span className="p-2 rounded-xl bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/20">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-[#1a2522] tracking-tight">
                {entryExitLogs.length}
              </div>
            </button>

            {/* Card 3: Truck Logs */}
            <button
              type="button"
              onClick={() => handleKpiFilter('truck_log')}
              className={clsx(
                'bg-white border p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-md active:scale-98',
                filterType === 'truck_log'
                  ? 'border-[#234D42] ring-2 ring-[#234D42]/20 shadow-sm'
                  : 'border-[#e2e8e5] hover:border-[#234D42]/40'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#71817E]">
                  TRUCK LOGS
                </span>
                <span className="p-2 rounded-xl bg-[#f8faf9] text-[#234D42] border border-[#d2ded8]">
                  <Truck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-[#1a2522] tracking-tight">
                {truckLogs.length}
              </div>
            </button>

            {/* Card 4: Incoming Stock */}
            <button
              type="button"
              onClick={() => handleKpiFilter('incoming_report')}
              className={clsx(
                'bg-white border p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-md active:scale-98',
                filterType === 'incoming_report'
                  ? 'border-[#234D42] ring-2 ring-[#234D42]/20 shadow-sm'
                  : 'border-[#e2e8e5] hover:border-[#234D42]/40'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#71817E]">
                  INWARD STOCK
                </span>
                <span className="p-2 rounded-xl bg-[#f8faf9] text-[#234D42] border border-[#d2ded8]">
                  <PackagePlus className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-[#1a2522] tracking-tight">
                {incomingReports.length}
              </div>
            </button>

            {/* Card 5: Active Terminals */}
            <div className="col-span-2 sm:col-span-1 bg-white border border-[#e2e8e5] p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#71817E]">
                  TERMINALS
                </span>
                <span className="p-2 rounded-xl bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/20">
                  <Radio className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-[#234D42] tracking-tight">
                3
              </div>
            </div>
          </div>

          {/* Middle Row: 2-Column Split (Like "Recent leads" and "Recently listed" in reference) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Box: Recent Visitor & Gate Logs (Like "Recent leads" in screenshot) */}
            <div className="bg-white border border-[#e2e8e5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#eef2f0]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#e9f2ef] text-[#234D42]">
                      <Users className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-base text-[#1a2522] tracking-tight">
                      Recent Visitor & Gate Logs
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleKpiFilter('entry_exit')}
                    className="text-xs font-bold text-[#234D42] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* List items */}
                <div className="space-y-3">
                  {entryExitLogs.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#71817E]">
                      No visitor check-ins recorded yet.
                    </div>
                  ) : (
                    entryExitLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8faf9] hover:bg-[#f1f5f3] border border-[#eef2f0] transition-colors"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-[#1a2522] truncate">
                            {log.details.visitorName}
                          </span>
                          <span className="text-[11px] text-[#71817E] truncate">
                            Meeting: {log.details.personToMeet || 'Operations'} • {log.details.purpose || 'General Visit'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
                            New
                          </span>
                          <span className="text-[10px] font-medium text-[#71817E]">
                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Box: Recent Dispatches & Inward Materials (Like "Recently listed" in screenshot) */}
            <div className="bg-white border border-[#e2e8e5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#eef2f0]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#e9f2ef] text-[#234D42]">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-base text-[#1a2522] tracking-tight">
                      Recent Material Dispatches & Stock
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleKpiFilter('truck_log')}
                    className="text-xs font-bold text-[#234D42] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* List items */}
                <div className="space-y-3">
                  {truckLogs.length === 0 && incomingReports.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#71817E]">
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
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8faf9] hover:bg-[#f1f5f3] border border-[#eef2f0] transition-colors"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-xs sm:text-sm text-[#1a2522] truncate">
                                {item.details.material} — {isTruck ? item.details.vehicleNumber : item.details.vendorName} ({item.details.quantity} {item.details.quantityUnit || 'MT'})
                              </span>
                              <span className="text-[11px] text-[#71817E] truncate">
                                {isTruck ? `Driver: ${item.details.driverName}` : `Trader: ${item.details.tradersCompany}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 shrink-0 ml-3">
                              <span className="font-extrabold text-xs text-[#234D42]">
                                ₹ / $ {total}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
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

          {/* Bottom Section: Operations Activity & Master Stream (Like "Message activity" in screenshot) */}
          <div className="bg-white border border-[#e2e8e5] rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eef2f0]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#e9f2ef] text-[#234D42]">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-base text-[#1a2522] tracking-tight">
                  Operations Activity Stream
                </h2>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <div className="bg-[#f8faf9] p-1 rounded-xl border border-[#d2ded8] flex items-center">
                  <button
                    type="button"
                    onClick={() => setTimeRange('7d')}
                    className={clsx(
                      'px-3 py-1 rounded-lg font-bold transition-all cursor-pointer',
                      timeRange === '7d' ? 'bg-[#234D42] text-white shadow-xs' : 'text-[#71817E] hover:text-[#1a2522]'
                    )}
                  >
                    7 days
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange('30d')}
                    className={clsx(
                      'px-3 py-1 rounded-lg font-bold transition-all cursor-pointer',
                      timeRange === '30d' ? 'bg-[#234D42] text-white shadow-xs' : 'text-[#71817E] hover:text-[#1a2522]'
                    )}
                  >
                    30 days
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange('all')}
                    className={clsx(
                      'px-3 py-1 rounded-lg font-bold transition-all cursor-pointer',
                      timeRange === 'all' ? 'bg-[#234D42] text-white shadow-xs' : 'text-[#71817E] hover:text-[#1a2522]'
                    )}
                  >
                    All time
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Activity Summary Metric Cards (Like Total Delivered, Inbound, Outbound in reference) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#f8faf9] border border-[#e2e8e5]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71817E] block mb-1">
                  TOTAL DISPATCHED
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#1a2522]">
                  {totalTruckTonnage.toLocaleString()} MT
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8faf9] border border-[#e2e8e5]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71817E] block mb-1">
                  INWARD STOCK
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#234D42]">
                  {totalIncomingTonnage.toLocaleString()} MT
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8faf9] border border-[#e2e8e5]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71817E] block mb-1">
                  GATE CHECK-INS
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#354541]">
                  {entryExitLogs.length} Visitors
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8faf9] border border-[#e2e8e5]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71817E] block mb-1">
                  LIVE BROADCASTS
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#234D42]">
                  100% Real-Time
                </span>
              </div>
            </div>

            {/* Live Event Cards Feed */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#71817E]">
                  Live Stream Event Feed ({filteredEvents?.length || 0} Records)
                </span>
                {filterType !== 'all' && (
                  <button
                    type="button"
                    onClick={() => handleKpiFilter('all')}
                    className="text-xs font-bold text-[#234D42] hover:underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {isLoading && (
                <div className="py-12 text-center text-xs text-[#71817E]">
                  Loading real-time records...
                </div>
              )}

              {!isLoading && filteredEvents?.length === 0 && (
                <div className="py-12 text-center text-xs text-[#71817E]">
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
                    className="animate-slide-down p-4 rounded-2xl bg-white border border-[#e2e8e5] hover:border-[#234D42]/40 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-[#e9f2ef] text-[#234D42] shrink-0">
                        {isEntry ? <Users className="w-4 h-4" /> : isTruck ? <Truck className="w-4 h-4" /> : <PackagePlus className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-[#1a2522]">
                            {isEntry ? item.details.visitorName : isTruck ? `${item.details.vehicleNumber} (${item.details.material})` : `${item.details.material} (${item.details.vendorName})`}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f8faf9] border border-[#d2ded8] text-[#71817E]">
                            {isEntry ? 'Gate Visitor' : isTruck ? 'Truck Dispatch' : 'Warehouse Inward'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#71817E] mt-0.5 truncate">
                          {isEntry
                            ? `Meeting: ${item.details.personToMeet || '—'} • Purpose: ${item.details.purpose || '—'}`
                            : isTruck
                            ? `Driver: ${item.details.driverName} • ${item.details.quantity} ${item.details.quantityUnit || 'MT'} @ $${item.details.rate}`
                            : `Vendor: ${item.details.vendorName} • Trader: ${item.details.tradersCompany} • ${item.details.quantity} ${item.details.quantityUnit || 'MT'}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#eef2f0]">
                      {!isEntry && (
                        <div className="text-right">
                          <span className="text-[10px] text-[#71817E] block uppercase font-bold">Total Amount</span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#234D42]">₹ / $ {total}</span>
                        </div>
                      )}
                      <div className="text-right flex items-center gap-1 text-[11px] text-[#71817E] bg-[#f8faf9] px-2.5 py-1 rounded-lg border border-[#e2e8e5]">
                        <Clock className="w-3.5 h-3.5 text-[#71817E]" />
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
