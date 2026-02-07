/**
 * Demo Dashboard - Landing Page
 * 
 * Entry point for the LearnSphere demonstration.
 * Allows selection between learner, instructor, and system views.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  Activity, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface PersonaCard {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: typeof User;
  route: string;
  variant: 'learner' | 'instructor' | 'system';
}

const personas: PersonaCard[] = [
  {
    id: 'noah-davis',
    name: 'Noah Davis',
    role: 'Struggling Learner',
    description: 'Experience the learner journey with real-time adaptive insights',
    icon: User,
    route: '/demo/learner',
    variant: 'learner',
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    role: 'Instructor',
    description: 'View aggregated insights and analytics for all learners',
    icon: GraduationCap,
    route: '/demo/instructor',
    variant: 'instructor',
  },
  {
    id: 'system',
    name: 'System Overview',
    role: 'System Status',
    description: 'Monitor backend connectivity and system health',
    icon: Activity,
    route: '/demo/system',
    variant: 'system',
  },
];

const variantStyles = {
  learner: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/50',
  instructor: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50',
  system: 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/50',
};

export default function DemoDashboard() {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  async function checkBackendHealth() {
    try {
      const result = await api.health.check();
      setIsBackendHealthy(result.ok);
    } catch {
      setIsBackendHealthy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            LearnSphere
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Adaptive Insights Demo
          </p>
          
          {/* Backend Status */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200">
            {isBackendHealthy === null ? (
              <>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                <span className="text-sm text-slate-600">Checking backend...</span>
              </>
            ) : isBackendHealthy ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Backend Connected
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  Backend Disconnected
                </span>
              </>
            )}
          </div>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <Card
                key={persona.id}
                className={`transition-all duration-200 cursor-pointer ${variantStyles[persona.variant]}`}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <CardTitle className="text-lg">{persona.name}</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-500">
                    {persona.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    {persona.description}
                  </p>
                  <Link to={persona.route}>
                    <Button className="w-full" variant="outline">
                      View as {persona.role.split(' ')[0]}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Info */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Demo Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Frontend</p>
                <p className="text-slate-600">React + TypeScript + Tailwind</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Backend</p>
                <p className="text-slate-600">Express + Prisma + PostgreSQL</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Insights</p>
                <p className="text-slate-600">Real-time adaptive detection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
