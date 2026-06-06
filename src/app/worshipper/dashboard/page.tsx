import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emergencyApi, alertApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { formatElapsed } from '@/lib/utils';
import { Incident, MissingPersonAlert } from '@/types';
import { AlertCircle, Users, MapPin, Phone, Heart, Music } from 'lucide-react';
import Link from 'next/link';

export default async function WorshipperDashboardPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

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
  const userIncidents = incidents.filter(i => i.createdBy === session?.user.id);
  const activeIncidents = userIncidents.filter(i => i.status !== 'Resolved' && i.status !== 'Cancelled');
  const openAlerts = alerts.filter(a => a.status === 'Open');

  const quickActions = [
    {
      title: 'Medical Emergency',
      description: 'Report medical distress',
      icon: Heart,
      href: '/worshipper/emergency?type=medical',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 border-red-200',
    },
    {
      title: 'Security Issue',
      description: 'Report security concern',
      icon: AlertCircle,
      href: '/worshipper/emergency?type=security',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
    },
    {
      title: 'Missing Child',
      description: 'Report missing person',
      icon: Users,
      href: '/worshipper/missing-child',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'My Vehicle',
      description: 'Save parking location',
      icon: MapPin,
      href: '/worshipper/my-vehicle',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'Parking Report',
      description: 'Report blocked vehicle',
      icon: AlertCircle,
      href: '/worshipper/parking-report',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
    },
    {
      title: 'Guidance',
      description: '24/7 support hotline',
      icon: Phone,
      href: 'tel:+2341234567890',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 border-green-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome to Pilgrim Hub</h1>
              <p className="text-blue-100 text-lg">
                {session?.user.name ? `Hello, ${session.user.name}` : 'Your safety is our priority'}
              </p>
            </div>
            <Music className="h-16 w-16 opacity-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Action Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <div className={`${action.bgColor} border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 h-full hover:scale-105`}>
                    <div className={`bg-gradient-to-br ${action.color} rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-700 font-medium uppercase tracking-wide">Your Active Incidents</p>
                  <p className="text-3xl font-bold text-red-900 mt-1">{activeIncidents.length}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-red-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Missing Alerts</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{openAlerts.length}</p>
                </div>
                <Users className="h-10 w-10 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Location Access</p>
                  <p className="text-3xl font-bold text-amber-900 mt-1">Enabled</p>
                </div>
                <MapPin className="h-10 w-10 text-amber-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incidents and Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Incidents */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Active Incidents</CardTitle>
                <Badge variant={activeIncidents.length > 0 ? 'destructive' : 'success'}>
                  {activeIncidents.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {activeIncidents.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm text-slate-500">No active incidents reported.</p>
                  <p className="text-xs text-slate-400 mt-2">We hope everything is safe with you.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeIncidents.map((incident) => (
                    <Link key={incident.id} href={`/worshipper/incident/${incident.id}`}>
                      <div className="rounded-lg border border-slate-200 p-4 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{incident.reportType}</p>
                            <p className="text-xs text-slate-500 mt-1">Location: {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</p>
                          </div>
                          <Badge variant={incident.status === 'Pending' ? 'destructive' : incident.status === 'Dispatched' ? 'warning' : 'success'}>
                            {incident.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 mt-3">
                          {incident.assignedOfficerName ? (
                            <>Assigned to: <span className="font-medium">{incident.assignedOfficerName}</span></>
                          ) : (
                            <span className="text-red-600 font-medium">Awaiting assignment</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">{formatElapsed(incident.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Missing Person Alerts */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Missing Person Alerts</CardTitle>
                <Badge variant={openAlerts.length > 0 ? 'warning' : 'success'}>
                  {openAlerts.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {openAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm text-slate-500">No missing person alerts currently active.</p>
                  <p className="text-xs text-slate-400 mt-2">Stay safe and look out for others.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {openAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{alert.fullName}</p>
                          <p className="text-xs text-slate-600 mt-1">Age: {alert.age ?? 'Unknown'}</p>
                        </div>
                        <Badge variant="warning">Missing</Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">Last seen: {alert.lastSeenAreaText ?? 'Unknown location'}</p>
                      <p className="text-xs text-slate-500 mt-2">{formatElapsed(alert.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Emergency Hotline</p>
                  <p className="text-slate-600 text-sm">+234 1234 5678 90</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Report an Issue</p>
                  <Link href="/worshipper/emergency" className="text-blue-600 hover:underline text-sm">
                    Click here to report now
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
