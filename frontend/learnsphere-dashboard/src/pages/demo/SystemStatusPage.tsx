/**
 * System Status Page
 * 
 * Monitoring view for backend connectivity and system health.
 * Serves as fallback demo screen.
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCard } from '@/components/insights/AlertCard';
import { api } from '@/lib/api';
import type { Alert as InsightAlert } from '@/lib/api';

export default function SystemStatusPage() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [sampleAlerts, setSampleAlerts] = useState<InsightAlert[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  async function checkHealth() {
    setIsChecking(true);
    try {
      const result = await api.health.check();
      setIsHealthy(result.ok);
      setLastChecked(new Date());
    } catch {
      setIsHealthy(false);
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  }

  async function loadSampleData() {
    setIsLoadingSamples(true);
    try {
      const result = await api.insights.mockBatch();
      setSampleAlerts(result.alerts);
    } catch (error) {
      console.error('Failed to load sample data:', error);
    } finally {
      setIsLoadingSamples(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            System Status
          </h1>
          <p className="text-slate-600">
            Backend connectivity and health monitoring
          </p>
        </div>

        {/* Backend Status Card */}
        <Card className="mb-6 border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Backend Connection</CardTitle>
            <CardDescription>LearnSphere API Server</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                {isHealthy === null ? (
                  <div className="w-4 h-4 rounded-full bg-slate-400 animate-pulse" />
                ) : isHealthy ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className="font-semibold text-slate-900">
                    {isHealthy === null ? 'Checking...' : isHealthy ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {import.meta.env.VITE_API_URL || 'http://localhost:5000'}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={checkHealth}
                disabled={isChecking}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                Check Connection
              </Button>
            </div>

            {lastChecked && (
              <p className="text-xs text-slate-600">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="mb-6 border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Frontend</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• React 18 + TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Vite Build Tool</li>
                    <li>• React Router</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Backend</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Express.js</li>
                    <li>• Prisma ORM</li>
                    <li>• PostgreSQL</li>
                    <li>• RESTful API</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Data Preview */}
        <Card className="mb-6 border-2 border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Sample Insights (Demo Mode)</CardTitle>
                <CardDescription>Preview of mock alert data</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadSampleData}
                disabled={isLoadingSamples}
              >
                {isLoadingSamples ? 'Loading...' : 'Load Sample Data'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sampleAlerts.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <p className="text-sm">Click "Load Sample Data" to preview alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sampleAlerts.map((alert) => (
                  <AlertCard key={alert.alertId} alert={alert} />
                ))}
                <p className="text-xs text-slate-600 mt-4">
                  {sampleAlerts.length} sample alerts loaded from /insights/mock-batch
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="space-x-2">
            <Link to="/demo/learner">
              <Button variant="outline">Learner View</Button>
            </Link>
            <Link to="/demo/instructor">
              <Button variant="outline">Instructor View</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
