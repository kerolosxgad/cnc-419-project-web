"use client";

import { useEffect, useState } from "react";
import { searchIOCs } from "@/services/iocs";
import { IOC, IOCType, SeverityLevel } from "@/types";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { SkeletonTable } from "@/components/ui/Skeleton";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { formatDate, formatRelativeTime, getIOCTypeLabel, exportToCSV, exportToJSON, parseTags } from "@/utils/helpers";
import Link from "next/link";

export default function IOCsPage() {
  const [iocs, setIOCs] = useState<IOC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<IOCType | "">("");
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | "">("");
  const [page, setPage] = useState(0);
  const [limit] = useState(50);

  useEffect(() => {
    loadIOCs();
  }, [page, selectedType, selectedSeverity]);

  const loadIOCs = async () => {
    try {
      setLoading(true);
      const response = await searchIOCs({
        query: searchQuery || undefined,
        type: selectedType || undefined,
        severity: selectedSeverity || undefined,
        limit,
        offset: page * limit,
      });
      setIOCs(response.results);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadIOCs();
  };

  const handleExportCSV = () => {
    const data = iocs.map((ioc) => ({
      id: ioc.id,
      type: ioc.type,
      value: ioc.value,
      severity: ioc.severity,
      confidence: ioc.confidence,
      source: ioc.source,
      observedCount: ioc.observedCount,
      firstSeen: ioc.firstSeen,
      lastSeen: ioc.lastSeen,
    }));
    exportToCSV(data, `iocs-${Date.now()}`);
  };

  const handleExportJSON = () => {
    exportToJSON(iocs, `iocs-${Date.now()}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">IOC Search & Analysis</h1>
          <p className="text-gray-400">
            {total.toLocaleString()} indicators of compromise detected
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={handleExportJSON} className="btn btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search IOC Value
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search by IP, domain, hash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">IOC Type</label>
              <select
                className="input"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as IOCType | "");
                  setPage(0);
                }}
              >
                <option value="">All Types</option>
                <option value="ipv4">IPv4</option>
                <option value="domain">Domain</option>
                <option value="url">URL</option>
                <option value="md5">MD5</option>
                <option value="sha256">SHA256</option>
                <option value="hostname">Hostname</option>
                <option value="yara">YARA</option>
                <option value="cve">CVE</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
              <select
                className="input"
                value={selectedSeverity}
                onChange={(e) => {
                  setSelectedSeverity(e.target.value as SeverityLevel | "");
                  setPage(0);
                }}
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="card">
          <SkeletonTable rows={10} />
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <AlertTriangle className="w-16 h-16 text-severity-high mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading IOCs</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button onClick={loadIOCs} className="btn btn-primary">
            Retry
          </button>
        </div>
      ) : iocs.length === 0 ? (
        <div className="card text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No IOCs Found</h2>
          <p className="text-gray-400">Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Severity</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Value</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Source</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Confidence</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Observed</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Last Seen</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {iocs.map((ioc) => (
                  <tr
                    key={ioc.id}
                    className="border-b border-border hover:bg-card-hover transition-colors"
                  >
                    <td className="p-4">
                      <SeverityBadge severity={ioc.severity} />
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 bg-accent-blue/20 text-accent-blue rounded">
                        {getIOCTypeLabel(ioc.type)}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-sm text-white truncate max-w-xs">
                        {ioc.value}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-gray-400">{ioc.source}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-card-hover rounded-full h-2">
                          <div
                            className="bg-accent-blue h-full rounded-full"
                            style={{ width: `${ioc.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{ioc.confidence}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">{ioc.observedCount}x</td>
                    <td className="p-4 text-sm text-gray-400">
                      {formatRelativeTime(ioc.lastSeen)}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/iocs/${ioc.id}`}
                        className="btn btn-secondary py-1 px-3 text-sm inline-flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="card flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="btn btn-secondary flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="btn btn-secondary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
