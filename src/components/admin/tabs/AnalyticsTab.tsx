/**
 * ==============================================================================
 * ADMIN TAB: AnalyticsTab
 * ==============================================================================
 * Purpose:
 *   Real-time visitor analytics dashboard displaying:
 *   - Metric summary cards (Today, This Week, This Month, All Time)
 *   - 30-Day daily interactive bar chart with hover tooltips
 *   - Top locations & Device breakdown distribution bars
 *   - Detailed paginated visitor logs table with single & bulk delete actions
 * ==============================================================================
 */

import React from "react";
import {
  BarChart3,
  RefreshCw,
  AlertCircle,
  Clock,
  CalendarDays,
  CalendarRange,
  Users,
  Activity,
  MapPin,
  Globe,
  Monitor,
  Smartphone,
  Eye,
  Trash2
} from "lucide-react";
import { AnalyticsData } from "../types";

interface AnalyticsTabProps {
  analyticsData: AnalyticsData | null;
  analyticsLoading: boolean;
  analyticsError: string;
  visitorPage: number;
  fetchAnalytics: (page?: number) => Promise<void>;
  deleteVisitor: (id: string) => Promise<void>;
  clearAllVisitors: () => Promise<void>;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  analyticsData,
  analyticsLoading,
  analyticsError,
  visitorPage,
  fetchAnalytics,
  deleteVisitor,
  clearAllVisitors,
}) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] w-full sm:w-auto">
          <h2 className="font-black text-base sm:text-lg uppercase tracking-widest flex items-center gap-2 text-black">
            <BarChart3 className="h-5 w-5" strokeWidth={3} />
            Visitor Analytics Dashboard
          </h2>
        </div>
        <button
          onClick={() => fetchAnalytics(visitorPage)}
          disabled={analyticsLoading}
          className="border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-4 py-2 sm:px-5 sm:py-2.5 font-black text-xs uppercase tracking-wider neo-btn-press shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2 text-black disabled:opacity-50 self-stretch sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${analyticsLoading ? "animate-spin" : ""}`} strokeWidth={3} />
          {analyticsLoading ? "Loading..." : "Refresh Data"}
        </button>
      </div>

      {/* Error State */}
      {analyticsError && (
        <div className="border-2 border-black bg-red-100 p-4 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 text-sm font-bold text-red-900">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {analyticsError}
        </div>
      )}

      {/* Loading State */}
      {analyticsLoading && !analyticsData && (
        <div className="border-4 border-black bg-white p-12 shadow-[6px_6px_0px_0px_#000] text-center">
          <div className="h-8 w-8 rounded-full border-4 border-black border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-black text-sm uppercase tracking-widest text-black/60">
            Loading visitor analytics...
          </p>
        </div>
      )}

      {/* Analytics Content */}
      {analyticsData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Today", value: analyticsData.summary.today, icon: Clock, color: "bg-[#FF6B6B]" },
              { label: "This Week", value: analyticsData.summary.thisWeek, icon: CalendarDays, color: "bg-[#FFD93D]" },
              { label: "This Month", value: analyticsData.summary.thisMonth, icon: CalendarRange, color: "bg-[#6BCB77]" },
              { label: "All Time", value: analyticsData.summary.total, icon: Users, color: "bg-[#4D96FF]" },
            ].map((card) => (
              <div
                key={card.label}
                className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`${card.color} border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_#000]`}>
                    <card.icon className="h-4 w-4 text-black" strokeWidth={3} />
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-widest text-black/60">
                    {card.label}
                  </span>
                </div>
                <div className="font-black text-3xl sm:text-4xl text-black tracking-tight">
                  {card.value.toLocaleString()}
                </div>
                <div className="font-bold text-[10px] uppercase tracking-wider text-black/40 mt-1">
                  Visitors
                </div>
              </div>
            ))}
          </div>

          {/* 30-Day Bar Chart */}
          <div className="border-4 border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
            <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2 mb-5 flex items-center gap-2">
              <Activity className="h-4 w-4" strokeWidth={3} />
              Last 30 Days — Daily Visitors
            </h3>
            <div className="flex items-end gap-[3px] sm:gap-1 h-40 sm:h-52">
              {analyticsData.dailyCounts.map((day) => {
                const maxCount = Math.max(...analyticsData.dailyCounts.map((d) => d.count), 1);
                const heightPct = (day.count / maxCount) * 100;
                const isToday = day.date === new Date().toISOString().split("T")[0];
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 border-2 border-black bg-black text-white px-2 py-1 text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-[2px_2px_0px_0px_#FFD93D] pointer-events-none">
                      {day.label}: {day.count}
                    </div>
                    <div
                      className={`w-full border border-black/30 transition-all duration-300 ${
                        isToday ? "bg-[#FF6B6B]" : "bg-[#FFD93D] group-hover:bg-[#FF6B6B]"
                      }`}
                      style={{ height: `${Math.max(heightPct, 2)}%`, minHeight: "2px" }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-bold text-black/40 uppercase">
              <span>{analyticsData.dailyCounts[0]?.label}</span>
              <span>Today</span>
            </div>
          </div>

          {/* Bottom Grid: Top Locations + Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Locations */}
            <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" strokeWidth={3} />
                Top Locations
              </h3>
              {analyticsData.topLocations.length === 0 ? (
                <p className="font-bold text-xs text-black/40 uppercase">No location data yet</p>
              ) : (
                <div className="space-y-3">
                  {analyticsData.topLocations.map((loc, i) => {
                    const maxLocCount = analyticsData.topLocations[0]?.count || 1;
                    const barWidth = (loc.count / maxLocCount) * 100;
                    return (
                      <div key={`${loc.city}-${loc.country}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs uppercase tracking-wider text-black flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            <span className="text-black/40">#{i + 1}</span>
                            {loc.city}, {loc.country}
                          </span>
                          <span className="font-black text-xs text-black border border-black px-2 py-0.5 bg-[#FAF8F5]">
                            {loc.count}
                          </span>
                        </div>
                        <div className="h-2.5 bg-[#FAF8F5] border border-black/20">
                          <div
                            className="h-full bg-[#FFD93D] border-r border-black/30 transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Device Breakdown */}
            <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2 mb-4 flex items-center gap-2">
                <Monitor className="h-4 w-4" strokeWidth={3} />
                Device Breakdown
              </h3>
              {analyticsData.deviceBreakdown.length === 0 ? (
                <p className="font-bold text-xs text-black/40 uppercase">No device data yet</p>
              ) : (
                <div className="space-y-4">
                  {analyticsData.deviceBreakdown.map((d) => {
                    const totalDevices =
                      analyticsData.deviceBreakdown.reduce((s, x) => s + x.count, 0) || 1;
                    const pct = Math.round((d.count / totalDevices) * 100);
                    const DeviceIcon = d.device === "Mobile" ? Smartphone : Monitor;
                    const barColor =
                      d.device === "Desktop"
                        ? "bg-[#4D96FF]"
                        : d.device === "Mobile"
                        ? "bg-[#FF6B6B]"
                        : "bg-[#6BCB77]";
                    return (
                      <div key={d.device}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs uppercase tracking-wider text-black flex items-center gap-2">
                            <DeviceIcon className="h-3.5 w-3.5" />
                            {d.device}
                          </span>
                          <span className="font-black text-xs text-black">
                            {d.count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-3 bg-[#FAF8F5] border border-black/20">
                          <div
                            className={`h-full ${barColor} border-r border-black/30 transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Visitor Logs Table */}
          <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/10 pb-3 mb-4">
              <h3 className="font-black text-sm uppercase tracking-widest text-black flex items-center gap-2">
                <Eye className="h-4 w-4" strokeWidth={3} />
                Visitor Logs
                {analyticsData.pagination && (
                  <span className="font-bold text-[10px] text-black/50 ml-1">
                    ({analyticsData.pagination.totalRecords} total)
                  </span>
                )}
              </h3>
              <button
                onClick={clearAllVisitors}
                className="border-2 border-black bg-red-100 hover:bg-red-200 px-3 py-1.5 font-black text-[10px] uppercase tracking-wider neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 text-red-900 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" strokeWidth={3} />
                Clear All Logs
              </button>
            </div>

            {analyticsData.visitors.length === 0 ? (
              <p className="font-bold text-xs text-black/40 uppercase text-center py-8">
                No visitors recorded yet. They'll appear here automatically!
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Time</th>
                        <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Location</th>
                        <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Device</th>
                        <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Browser</th>
                        <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Page</th>
                        <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.visitors.map((v, i) => (
                        <tr
                          key={v._id}
                          className={`border-b border-black/10 ${
                            i % 2 === 0 ? "bg-[#FAF8F5]" : "bg-white"
                          } hover:bg-yellow-50 transition-colors group`}
                        >
                          <td className="px-3 py-2.5 font-bold text-xs text-black whitespace-nowrap">
                            {new Date(v.visitedAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className="px-3 py-2.5 font-bold text-xs text-black">
                            {v.city !== "Unknown"
                              ? `${v.city}, ${v.country}`
                              : v.country !== "Unknown"
                              ? v.country
                              : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-xs">
                            <span
                              className={`border border-black px-2 py-0.5 font-black text-[10px] uppercase ${
                                v.device === "Mobile" ? "bg-[#FF6B6B]/20" : "bg-[#4D96FF]/20"
                              }`}
                            >
                              {v.device}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-bold text-xs text-black/70">{v.browser}</td>
                          <td className="px-3 py-2.5 font-mono text-xs text-black/50">{v.page || "/"}</td>
                          <td className="px-2 py-2.5">
                            <button
                              onClick={() => deleteVisitor(v._id)}
                              title="Delete this visitor record"
                              className="opacity-0 group-hover:opacity-100 transition-opacity border border-black bg-red-100 hover:bg-red-300 p-1 neo-btn-press shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3 text-red-900" strokeWidth={3} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {analyticsData.pagination && analyticsData.pagination.totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t-2 border-black/10">
                    <span className="font-black text-xs uppercase tracking-wider text-black/50">
                      Page {analyticsData.pagination.page} of {analyticsData.pagination.totalPages}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => fetchAnalytics(visitorPage - 1)}
                        disabled={visitorPage <= 1}
                        className="border-2 border-black bg-white hover:bg-neo-secondary disabled:opacity-30 disabled:pointer-events-none px-3 py-1.5 font-black text-xs uppercase neo-btn-press shadow-[2px_2px_0px_0px_#000] text-black cursor-pointer"
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: analyticsData.pagination.totalPages }, (_, idx) => idx + 1)
                        .filter((p) => {
                          return (
                            p === 1 ||
                            p === analyticsData.pagination.totalPages ||
                            Math.abs(p - visitorPage) <= 2
                          );
                        })
                        .reduce<(number | string)[]>((acc, p, i, arr) => {
                          if (
                            i > 0 &&
                            typeof arr[i - 1] === "number" &&
                            (p as number) - (arr[i - 1] as number) > 1
                          ) {
                            acc.push("...");
                          }
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, idx) =>
                          typeof p === "string" ? (
                            <span key={`ellipsis-${idx}`} className="font-black text-xs text-black/40 px-1">
                              ...
                            </span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => fetchAnalytics(p as number)}
                              className={`h-8 w-8 border-2 border-black font-black text-xs flex items-center justify-center neo-btn-press transition-all cursor-pointer ${
                                visitorPage === p
                                  ? "bg-black text-white shadow-[2px_2px_0px_0px_#FF6B6B] -translate-y-0.5"
                                  : "bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_#000]"
                              }`}
                            >
                              {p}
                            </button>
                          )
                        )}

                      <button
                        onClick={() => fetchAnalytics(visitorPage + 1)}
                        disabled={visitorPage >= analyticsData.pagination.totalPages}
                        className="border-2 border-black bg-white hover:bg-neo-secondary disabled:opacity-30 disabled:pointer-events-none px-3 py-1.5 font-black text-xs uppercase neo-btn-press shadow-[2px_2px_0px_0px_#000] text-black cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsTab;
