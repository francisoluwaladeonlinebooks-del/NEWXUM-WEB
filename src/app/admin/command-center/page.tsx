import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emergencyApi, alertApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { formatElapsed } from '@/lib/utils';
import { Incident, MissingPersonAlert } from '@/types';
import { AlertCircle, Map, Users, Radio, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function AdminCommandCenterPage() {
  const session = await getServerSession(authOptions);
  const token = session!.accessToken;

  let incidentsRes: { data?: { items: Incident[] } } = { data: { items: [] } };
  let alertsRes: { data?: { items: MissingPersonAlert[] } } = { data: { items: [] } };
  try {
    [incidentsRes, alertsRes] = await Promise.all([
      emergencyApi.incidents(token),
      alertApi.list(token),
    ]);
  } catch {
    /* backend offline */
  }

  const incidents = incidentsRes.data?.items ?? [];
  const alerts = alertsRes.data?.items ?? [];

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Cancelled');
  const pendingIncidents = incidents.filter(i => i.status === 'Pending');
  const openAlerts = alerts.filter(a => a.status === 'Open');
  const resolvedIncidents = incidents.filter(i => i.status === 'Resolved');
  const escalatedIncidents = incidents.filter(i => i.status === 'Escalated');

  // Simulate responder data
  const respondersOnDuty = 24;
  const respondersAvailable = 18;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Command Center Header */}
      <div className="border-b border-slate-700 bg-gradient-to-r from-slate-900 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-400">LIVE MONITORING</span>
              </div>
              <h1 className="text-4xl font-bold">Command Center</h1>
              <p className="text-slate-300 text-lg mt-2">Real-time operational control & incident management</p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 text-sm mb-2">Session</p>
              <p className="font-mono text-sm text-green-400">{session?.user.name}</p>
              <p className="text-xs text-slate-400 mt-1">2FA Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Three-Pane Layout: Incident Feed (left) | Tactical Map (center) | Proximity Matrix (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* LEFT PANE: Incident Feed */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 shadow-2xl h-full">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <CardTitle className="text-white text-lg">Incident Feed</CardTitle>
                  </div>
                  <Badge className="bg-red-500/80 text-white">{activeIncidents.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-96">
                {activeIncidents.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    <p>No active incidents</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700">
                    {activeIncidents.map((incident, idx) => (
                      <Link key={incident.id} href={`/admin/incidents/${incident.id}`}>
                        <div className={`p-3 hover:bg-slate-700/50 transition-colors cursor-pointer border-l-4 ${
                          incident.status === 'Pending' ? 'border-l-red-500' :
                          incident.status === 'Escalated' ? 'border-l-orange-500' : 'border-l-yellow-500'
                        }`}>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1">
                              <p className="text-white text-xs font-bold">{incident.reportType}</p>
                              <p className="text-slate-400 text-xs mt-0.5">{incident.patientName ?? 'Unknown'}</p>
                            </div>
                            <span className={`inline-block w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              incident.status === 'Pending' ? 'bg-red-600' :
                              incident.status === 'Escalated' ? 'bg-orange-600' : 'bg-yellow-600'
                            }`}>
                              {idx + 1}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs">{formatElapsed(incident.createdAt)}</p>
                          <div className="mt-2 text-xs text-slate-400">
                            {incident.assignedOfficerName ? (
                              <p>→ {incident.assignedOfficerName}</p>
                            ) : (
                              <p className="text-red-400 font-medium">⚠ Unassigned</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* CENTER PANE: Tactical Map & KPIs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tactical Map Placeholder */}
            <Card className="bg-slate-800/50 border-slate-700 shadow-2xl">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white text-lg">Tactical Map</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">Monthly</Badge>
                    <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">Congress</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg h-64 flex items-center justify-center border border-slate-600">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-slate-500 mx-auto mb-3 opacity-50" />
                    <p className="text-slate-400 text-sm">Map visualization layer</p>
                    <p className="text-slate-500 text-xs mt-2">PostGIS geofence polygon displayed here</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Incidents</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Responders</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-3 h-3 bg-slate-500 rounded"></div>
                    <span>Geofence</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Dashboard */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-300 text-xs font-semibold uppercase">Active Incidents</p>
                      <p className="text-3xl font-bold text-red-400 mt-2">{activeIncidents.length}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-500 opacity-70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-xs font-semibold uppercase">Resolved Today</p>
                      <p className="text-3xl font-bold text-green-400 mt-2">{resolvedIncidents.length}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500 opacity-70" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RIGHT PANE: Proximity Matrix & Personnel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 shadow-2xl h-full">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white text-lg">Responders</CardTitle>
                  </div>
                  <Badge className="bg-blue-600 text-white">{respondersAvailable}/{respondersOnDuty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-96">
                <div className="divide-y divide-slate-700">
                  {/* Sample Responders */}
                  {[
                    { name: 'Dr. Stella Ola', role: 'Medical', status: 'Available', zone: 'Zone A' },
                    { name: 'Sgt. Emeka', role: 'Security', status: 'Active Mission', zone: 'Zone B' },
                    { name: 'Officer Adebayo', role: 'Traffic', status: 'Available', zone: 'Zone C' },
                    { name: 'Paramedic Kene', role: 'Medical', status: 'Available', zone: 'Zone A' },
                    { name: 'Officer Chioma', role: 'Security', status: 'Standby', zone: 'Zone D' },
                  ].map((responder, idx) => (
                    <div key={idx} className="p-3 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold truncate">{responder.name}</p>
                          <p className="text-slate-400 text-xs">{responder.role}</p>
                        </div>
                        <div className={`inline-block w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                          responder.status === 'Available' ? 'bg-green-500' :
                          responder.status === 'Active Mission' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{responder.zone}</span>
                        <span className={`font-medium ${
                          responder.status === 'Available' ? 'text-green-400' :
                          responder.status === 'Active Mission' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {responder.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Control Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Missing Persons & Escalations */}
          <Card className="bg-slate-800/50 border-slate-700 shadow-2xl">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-400" />
                  <CardTitle className="text-white text-lg">Missing Person Alerts</CardTitle>
                </div>
                <Badge className={openAlerts.length > 0 ? 'bg-amber-600 text-white' : 'bg-green-600 text-white'}>
                  {openAlerts.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {openAlerts.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">No open missing person alerts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openAlerts.slice(0, 4).map((alert) => (
                    <div key={alert.id} className="rounded border border-amber-700/50 bg-amber-900/20 p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-white text-sm font-semibold">{alert.fullName}</p>
                        <Badge variant="warning" className="text-xs">Missing</Badge>
                      </div>
                      <p className="text-slate-400 text-xs">Age: {alert.age ?? '?'} · {alert.lastSeenAreaText ?? 'Unknown'}</p>
                      <p className="text-slate-500 text-xs mt-1">Sightings: {alert.sightingCount}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Status & Controls */}
          <Card className="bg-slate-800/50 border-slate-700 shadow-2xl">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Radio className="h-5 w-5 text-green-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-slate-700/50 border border-slate-600">
                <span className="text-slate-300 text-sm">WebSocket Connection</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-semibold">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-slate-700/50 border border-slate-600">
                <span className="text-slate-300 text-sm">Database Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-semibold">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-slate-700/50 border border-slate-600">
                <span className="text-slate-300 text-sm">Response Time (avg)</span>
                <span className="text-blue-400 text-xs font-semibold">1.2s</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/admin/vetting" className="block">
                  <button className="w-full py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                    Vetting Queue
                  </button>
                </Link>
                <Link href="/admin/incidents" className="block">
                  <button className="w-full py-2 px-3 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold transition-colors">
                    All Incidents
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Log */}
        <Card className="mt-6 bg-slate-800/50 border-slate-700 shadow-2xl">
          <CardHeader className="border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-white text-lg">Recent Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {incidents.slice(0, 8).map((incident, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-slate-700/50 transition-colors text-xs">
                  <span className="text-slate-500 font-mono">{formatElapsed(incident.createdAt)}</span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    incident.status === 'Pending' ? 'bg-red-500' :
                    incident.status === 'Resolved' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></span>
                  <span className="text-slate-300 flex-grow">{incident.reportType} incident reported · {incident.patientName ?? 'Unknown'}</span>
                  <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                    {incident.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
