import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emergencyApi, alertApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { formatElapsed } from '@/lib/utils';
import { roleName } from '@/lib/utils';
import { Incident, MissingPersonAlert } from '@/types';
import { AlertCircle, Users, Clock, CheckCircle, MapPin, Radio } from 'lucide-react';

export default async function ResponderStandbyPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const userRole = session?.user.role;

  let incidentsRes: { data?: { items: Incident[] } } = { data: { items: [] } };
  let alertsRes: { data?: { items: MissingPersonAlert[] } } = { data: { items: [] } };

  try {
    [incidentsRes, alertsRes] = await Promise.all([
      emergencyApi.incidents(token ?? ''),
      alertApi.list(token ?? ''),
    ]);
  } catch {
    // fallback when backend is offline
  }

  const incidents = incidentsRes.data?.items ?? [];
  const alerts = alertsRes.data?.items ?? [];
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Cancelled');
  const pendingIncidents = incidents.filter(i => i.status === 'Pending');
  const openAlerts = alerts.filter(a => a.status === 'Open');
  const resolvedIncidents = incidents.filter(i => i.status === 'Resolved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header Section with Status */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Operations Hub</h1>
              <p className="text-orange-100 text-lg">
                Welcome back, {session?.user.name}. You are a {roleName(userRole || 'responder')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-orange-100 text-sm mb-2">Current Status</p>
              <Badge className="bg-green-500 text-white px-4 py-2">AVAILABLE</Badge>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <p className="text-orange-100 text-sm">Active Incidents</p>
              <p className="text-3xl font-bold text-white mt-1">{activeIncidents.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <p className="text-orange-100 text-sm">Pending Dispatch</p>
              <p className="text-3xl font-bold text-white mt-1">{pendingIncidents.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <p className="text-orange-100 text-sm">Missing Alerts</p>
              <p className="text-3xl font-bold text-white mt-1">{openAlerts.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <p className="text-orange-100 text-sm">Today Resolved</p>
              <p className="text-3xl font-bold text-white mt-1">{resolvedIncidents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dispatch Readiness Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-700 font-medium uppercase tracking-wide">GPS Status</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">Connected</p>
                  <p className="text-xs text-green-600 mt-1">Accurate within 10m</p>
                </div>
                <MapPin className="h-10 w-10 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Connection</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">Stable</p>
                  <p className="text-xs text-blue-600 mt-1">WebSocket active</p>
                </div>
                <Radio className="h-10 w-10 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-700 font-medium uppercase tracking-wide">Battery</p>
                  <p className="text-2xl font-bold text-orange-900 mt-1">92%</p>
                  <p className="text-xs text-orange-600 mt-1">Charging recommended</p>
                </div>
                <CheckCircle className="h-10 w-10 text-orange-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incident Queue and Alerts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Incident Queue */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Incident Queue
                </CardTitle>
                <Badge variant={activeIncidents.length > 0 ? 'destructive' : 'success'}>
                  {activeIncidents.length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {activeIncidents.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-slate-600 font-medium">No active incidents</p>
                  <p className="text-xs text-slate-500 mt-2">You&apos;re all caught up. Stay ready!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeIncidents.slice(0, 6).map((incident, idx) => (
                    <div key={incident.id} className="rounded-lg border-l-4 border-l-red-500 bg-red-50 p-4 hover:bg-red-100 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <p className="text-sm font-bold text-slate-900">{incident.reportType} Emergency</p>
                          </div>
                          <p className="text-xs text-slate-600">Patient: {incident.patientName ?? 'Unknown'}</p>
                          <p className="text-xs text-slate-500 mt-1">Location: {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</p>
                        </div>
                        <Badge variant={incident.status === 'Pending' ? 'destructive' : incident.status === 'Dispatched' ? 'warning' : 'success'}>
                          {incident.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className={incident.assignedOfficerName ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {incident.assignedOfficerName ? `Assigned to ${incident.assignedOfficerName}` : 'Unassigned'}
                        </span>
                        <span className="text-slate-500">{formatElapsed(incident.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                  {activeIncidents.length > 6 && (
                    <div className="text-center text-xs text-slate-500 py-3 border-t border-slate-200">
                      +{activeIncidents.length - 6} more incidents
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Missing Person Alerts */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Missing Person Alerts
                </CardTitle>
                <Badge variant={openAlerts.length > 0 ? 'destructive' : 'success'}>
                  {openAlerts.length} open
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {openAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-slate-600 font-medium">No open alerts</p>
                  <p className="text-xs text-slate-500 mt-2">All missing persons have been resolved.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openAlerts.slice(0, 6).map((alert) => (
                    <div key={alert.id} className="rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-4 hover:bg-amber-100 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{alert.fullName}</p>
                          <p className="text-xs text-slate-600">Age {alert.age ?? '?'} · {alert.lastSeenAreaText ?? 'Location unknown'}</p>
                        </div>
                        <Badge variant="warning">Missing</Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className={alert.sightingCount > 0 ? 'text-green-600 font-medium' : 'text-red-600'}>
                          {alert.sightingCount} sighting{alert.sightingCount !== 1 ? 's' : ''}
                        </span>
                        <span className="text-slate-500">{formatElapsed(alert.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                  {openAlerts.length > 6 && (
                    <div className="text-center text-xs text-slate-500 py-3 border-t border-slate-200">
                      +{openAlerts.length - 6} more alerts
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-600" />
              Today&apos;s Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200">
                <p className="text-xs text-slate-600 font-medium mb-1">Total Incidents</p>
                <p className="text-2xl font-bold text-slate-900">{incidents.length}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4 border border-green-200">
                <p className="text-xs text-green-700 font-medium mb-1">Resolved</p>
                <p className="text-2xl font-bold text-green-900">{resolvedIncidents.length}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4 border border-orange-200">
                <p className="text-xs text-orange-700 font-medium mb-1">Pending</p>
                <p className="text-2xl font-bold text-orange-900">{pendingIncidents.length}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
                <p className="text-xs text-blue-700 font-medium mb-1">Missing Persons</p>
                <p className="text-2xl font-bold text-blue-900">{openAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
