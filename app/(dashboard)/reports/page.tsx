"use client";

import { useEffect, useState } from "react";
import { getReportSummary } from "@/services/iocs";
import { IngestReport } from "@/types";
import { SeverityDistributionChart } from "@/components/charts/SeverityDistributionChart";
import { TypeBreakdownChart } from "@/components/charts/TypeBreakdownChart";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { SkeletonChart } from "@/components/ui/Skeleton";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Shield,
  Activity,
  Database,
  AlertTriangle,
} from "lucide-react";
import {
  formatNumber,
  formatDate,
  getIOCTypeLabel,
  exportToCSV,
  exportToJSON,
} from "@/utils/helpers";

export default function ReportsPage() {
  const [report, setReport] = useState<IngestReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await getReportSummary();
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (report) {
      exportToJSON(report.report, `threat-report-${Date.now()}`);
    }
  };

  const handleExportTopThreats = () => {
    if (!report) return;
    exportToCSV(
      report.report.topThreats.map((t) => ({
        id: t.id,
        type: t.type,
        value: t.value,
        severity: t.severity,
        confidence: t.confidence,
        source: t.source,
        description: t.description,
      })),
      `top-threats-${Date.now()}`
    );
  };

  /* =========================
     LOADING
     ========================= */
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Reports</h1>
          <p className="text-gray-400">Comprehensive threat analysis and statistics</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
     ========================= */
  if (!report || error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-severity-high mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Report</h2>
          <p className="text-gray-400 mb-4">{error || "Unable to fetch report data"}</p>
          <button onClick={loadReport} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { metadata, summary, severity, types, sources, topThreats, dataQuality, feedStatus } =
    report.report;

  const severityData = [
    { name: "Critical", value: severity.critical, severity: "critical" as const },
    { name: "High", value: severity.high, severity: "high" as const },
    { name: "Medium", value: severity.medium, severity: "medium" as const },
    { name: "Low", value: severity.low, severity: "low" as const },
    { name: "Info", value: severity.info, severity: "info" as const },
  ].filter((s) => s.value > 0);

  const typeData = Object.entries(types)
    .map(([k, v]) => ({ name: getIOCTypeLabel(k as any), value: v }))
    .filter((i) => i.value > 0);

  const sourceData = Object.entries(sources)
    .map(([k, v]) => ({ name: k, value: v }))
    .sort((a, b) => b.value - a.value);

  const timeSeriesData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
    count: Math.floor(Math.random() * 500) + 100,
    critical: Math.floor(Math.random() * 50),
    high: Math.floor(Math.random() * 100),
    medium: Math.floor(Math.random() * 200),
    low: Math.floor(Math.random() * 150),
  }));

  /* =========================
     PAGE
     ========================= */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Reports</h1>
          <p className="text-gray-400">Comprehensive threat analysis and statistics</p>
        </div>
        <button onClick={handleExportReport} className="btn btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Full Report
        </button>
      </div>

      {/* METADATA */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-blue/20 rounded-lg">
              <FileText className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Weekly Threat Report</h2>
              <p className="text-sm text-gray-400">
                Generated: {formatDate(metadata.generatedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {formatDate(metadata.startDate)} - {formatDate(metadata.endDate)}
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total IOCs", value: summary.totalIOCs, icon: Database, extra: `+${formatNumber(summary.newInPeriod)} new` },
          { label: "High Risk", value: `${summary.highRiskPercentage}%`, icon: AlertTriangle, extra: "Critical + High" },
          { label: "Active Sources", value: summary.activeSources, icon: Activity, extra: "Threat feeds" },
          { label: "Avg Confidence", value: `${dataQuality.averageConfidence}%`, icon: Shield, extra: "Data quality" },
        ].map((item) => (
          <div key={item.label} className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <item.icon className="w-4 h-4" />
              <p className="text-sm">{item.label}</p>
            </div>
            <p className="text-3xl font-bold text-white">{typeof item.value === 'number' ? formatNumber(item.value) : item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.extra}</p>
          </div>
        ))}
        </div>
      </div>

      {/* TIME SERIES */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Threat Trends</h3>
          <TrendingUp className="w-5 h-5 text-accent-blue" />
        </div>
        <div className="h-80">
          <TimeSeriesChart data={timeSeriesData} />
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
          <div className="h-80">
            <SeverityDistributionChart data={severityData} />
          </div>
          <div 
            className={`mt-4 grid gap-2 text-center ${
              severityData.length === 1 
                ? "grid-cols-1" 
                : severityData.length === 2 
                ? "grid-cols-2" 
                : severityData.length === 3 
                ? "grid-cols-3" 
                : severityData.length === 4 
                ? "grid-cols-2 sm:grid-cols-4" 
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            }`}
          >
            {severityData.map((item) => (
              <div key={item.name} className="p-3 bg-background-secondary rounded">
                <p className="text-xs text-gray-400">{item.name}</p>
                <p className="text-lg font-bold text-white">{formatNumber(item.value)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">IOC Type Distribution</h3>
          <div className="h-80">
            <TypeBreakdownChart data={typeData} />
          </div>
        </div>
      </div>

      {/* SOURCES */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Threat Feed Contributions</h3>
          <TrendingUp className="w-5 h-5 text-accent-blue" />
        </div>
        <div className="space-y-3">
          {sourceData.map((s, i) => {
            const pct = Math.min((s.value / summary.totalIOCs) * 100, 100);
            return (
              <div key={s.name} className="p-4 bg-background-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent-blue">#{i + 1}</span>
                    <span className="text-white font-medium">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatNumber(s.value)}</p>
                    <p className="text-xs text-gray-500">{pct.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full bg-card-hover rounded-full h-2">
                  <div
                    className="bg-accent-blue h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TOP THREATS */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Top Critical Threats</h3>
          <button onClick={handleExportTopThreats} className="btn btn-secondary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Value</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Severity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Confidence</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Source</th>
              </tr>
            </thead>
            <tbody>
              {topThreats.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-b border-border hover:bg-card-hover transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-xs text-gray-500">{getIOCTypeLabel(t.type)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-mono text-white truncate max-w-xs">{t.value}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.severity === "critical"
                        ? "bg-severity-critical/20 text-severity-critical border border-severity-critical/50"
                        : t.severity === "high"
                        ? "bg-severity-high/20 text-severity-high border border-severity-high/50"
                        : t.severity === "medium"
                        ? "bg-severity-medium/20 text-severity-medium border border-severity-medium/50"
                        : "bg-severity-low/20 text-severity-low border border-severity-low/50"
                    }`}>
                      {t.severity.charAt(0).toUpperCase() + t.severity.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-400">{t.confidence}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-400">{t.source}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
