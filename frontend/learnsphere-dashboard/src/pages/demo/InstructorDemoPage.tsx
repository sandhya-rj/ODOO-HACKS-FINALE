/**
 * Instructor Demo Dashboard
 * 
 * Aggregated view of learner insights with severity filtering.
 * Shows real-time alerts and analytics for instructors.
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCard } from '@/components/insights/AlertCard';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import type { Alert as InsightAlert } from '@/lib/api';

type SeverityFilter = 'all' | 'high' | 'medium' | 'low';

export default function InstructorDemoPage() {
  const [alerts, setAlerts] = useState<InsightAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<SeverityFilter>('all');

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    setIsLoading(true);
    try {
      const result = await api.insights.mockBatch();
      setAlerts(result.alerts);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);

  const highSeverityCount = alerts.filter(a => a.severity === 'high').length;
  const mediumSeverityCount = alerts.filter(a => a.severity === 'medium').length;
  const lowSeverityCount = alerts.filter(a => a.severity === 'low').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Instructor Dashboard
          </h1>
          <p className="text-slate-600">
            Michael Chen - Course Admin
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Active Alerts</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                {alerts.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                Requires instructor attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs text-red-700">High Severity</CardDescription>
              <CardTitle className="text-3xl font-bold text-red-900">
                {highSeverityCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-700">
                Immediate action required
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Courses Monitored</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                JavaScript Fundamentals, React Essentials
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-2 border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600" />
                <CardTitle className="text-base">Filter Alerts</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadAlerts}
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setFilter('all')}
              >
                All ({alerts.length})
              </Badge>
              <Badge
                variant={filter === 'high' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200"
                onClick={() => setFilter('high')}
              >
                High Severity ({highSeverityCount})
              </Badge>
              <Badge
                variant={filter === 'medium' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200"
                onClick={() => setFilter('medium')}
              >
                Medium ({mediumSeverityCount})
              </Badge>
              <Badge
                variant={filter === 'low' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                onClick={() => setFilter('low')}
              >
                Low ({lowSeverityCount})
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Feed */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Alert Feed
            </h2>
            <p className="text-sm text-slate-600">
              {filteredAlerts.length} {filter !== 'all' ? `${filter} severity` : ''} alert{filteredAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {isLoading && (
            <Card className="border-2 border-slate-200">
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">Loading insights...</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && filteredAlerts.length === 0 && (
            <Card className="border-2 border-slate-200">
              <CardContent className="py-12 text-center">
                <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">
                  No alerts match the selected filter
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoading && filteredAlerts.map((alert) => (
            <AlertCard key={alert.alertId} alert={alert} />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/demo/learner">
            <Button variant="outline">
              View Learner Experience
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
