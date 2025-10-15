  import { useState, useEffect } from 'react';
  import axios from 'axios';

  export default function Admin() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
      fetchLogs();
    }, []);

    const fetchLogs = async () => {
      try {
        const { data } = await axios.get('/api/import-history');
        setLogs(data);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    const toggleDetails = (id) => {
      setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) return <p>Loading...</p>;

    return (
      <div style={{ padding: '20px' }}>
        <h1>Import History</h1>
        <button onClick={fetchLogs}>Refresh</button>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Timestamp</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Feed URL</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Fetched</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>New</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Updated</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Failed</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <a href={log.feedUrl} target="_blank" rel="noopener noreferrer">
                    {log.feedUrl.substring(0, 50)}...
                  </a>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.totalFetched}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.newJobs}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.updatedJobs}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.failedJobs.length}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button onClick={() => toggleDetails(log._id)}>
                    {expanded[log._id] ? 'Hide' : 'Show'}
                  </button>
                  {expanded[log._id] && (
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                      {log.failedJobs.map((f, i) => (
                        <li key={i}>{f.reason}: {JSON.stringify(f.jobData).substring(0, 100)}...</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }