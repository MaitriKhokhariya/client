 "use client";

import { useEffect, useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Clock, Link2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Admin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/import-history');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleDetails = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading import history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Import History
              </h1>
              <p className="text-gray-600 text-sm md:text-base">Monitor and track all RSS feed imports</p>
            </div>
            <button
              onClick={fetchLogs}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Imports</p>
                <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total New Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{logs.reduce((sum, log) => sum + log.newJobs, 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Updated</p>
                <p className="text-2xl font-bold text-gray-900">{logs.reduce((sum, log) => sum + log.updatedJobs, 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Failed</p>
                <p className="text-2xl font-bold text-gray-900">{logs.reduce((sum, log) => sum + log.failedJobs.length, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Feed URL</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Fetched</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">New</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Updated</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Failed</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <>
                    <tr 
                      key={log._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <a 
                          href={log.feedUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Link2 className="w-4 h-4" />
                          <span className="truncate max-w-xs">{log.feedUrl.substring(0, 40)}...</span>
                        </a>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                          {log.totalFetched}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                          {log.newJobs}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium">
                          {log.updatedJobs}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
                          log.failedJobs.length > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'
                        }`}>
                          {log.failedJobs.length}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleDetails(log._id)}
                          disabled={log.failedJobs.length === 0}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                        >
                          {expanded[log._id] ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expanded[log._id] && log.failedJobs.length > 0 && (
                      <tr key={`${log._id}-details`}>
                        <td colSpan="7" className="px-4 py-4 bg-red-50">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-red-900 mb-3">Failed Jobs Details:</h4>
                            {log.failedJobs.map((f, i) => (
                              <div 
                                key={i}
                                className="p-3 bg-white rounded-lg border border-red-200"
                              >
                                <p className="text-sm text-red-900 font-medium mb-1">
                                  <AlertCircle className="w-4 h-4 inline mr-2" />
                                  {f.reason}
                                </p>
                                <p className="text-xs text-gray-600 font-mono pl-6">
                                  {JSON.stringify(f.jobData).substring(0, 150)}...
                                </p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          
          {logs.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No import history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}