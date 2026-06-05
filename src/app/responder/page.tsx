import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emergencyApi, alertApi } from '@/lib/api';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatElapsed } from '@/lib/utils';
import { Incident, MissingPersonAlert } from '@/types';

export default async function ResponderDashboardPage() {
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
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Cancelled');
  const openAlerts = alerts.filter(a => a.status === 'Open');

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Responder dashboard</h1>
            <p className="text-sm text-muted-foreground">Track active incidents, view alerts, and stay mission-ready.</p>
          </div>
          <div className="space-y-2 text-sm text-slate-500">
            <div><span className="font-semibold text-slate-900">{activeIncidents.length}</span> active incidents</div>
            <div><span className="font-semibold text-slate-900">{openAlerts.length}</span> open missing alerts</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incident queue</CardTitle>
          </CardHeader>
          <CardContent>
            {activeIncidents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active incidents right now.</p>
            ) : (
              <div className="space-y-3">
                {activeIncidents.slice(0, 6).map(incident => (
                  <div key={incident.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{incident.patientName ?? 'Unknown patient'}</p>
                        <p className="text-xs text-muted-foreground">{incident.reportType} • {incident.latitude.toFixed(3)}, {incident.longitude.toFixed(3)}</p>
                      </div>
                      <Badge variant={incident.reportType === 'Medical' ? 'destructive' : 'warning'}>
                        {incident.reportType}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                      <div>Assigned officer: {incident.assignedOfficerName ?? 'Unassigned'}</div>
                      <div>Status: {incident.status}</div>
                      <div className="text-xs text-muted-foreground">{formatElapsed(incident.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missing person alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {openAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open missing-person alerts.</p>
            ) : (
              <div className="space-y-3">
                {openAlerts.slice(0, 6).map(alert => (
                  <div key={alert.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{alert.fullName}</p>
                        <p className="text-xs text-muted-foreground">Last seen: {alert.lastSeenAreaText ?? 'Unknown'}</p>
                      </div>
                      <Badge variant={alert.status === 'Open' ? 'destructive' : 'success'}>
                        {alert.status}
                      </Badge>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">{alert.description}</div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{alert.sightingCount} sighting{alert.sightingCount !== 1 ? 's' : ''}</span>
                      <span>{formatElapsed(alert.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emergencyApi, alertApi } from '@/lib/api';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatElapsed } from '@/lib/utils';
import { Incident, MissingPersonAlert } from '@/types';

export default async function ResponderDashboardPage() {
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
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Cancelled');
  const openAlerts = alerts.filter(a => a.status === 'Open');

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Responder dashboard</h1>
            <p className="text-sm text-muted-foreground">Track active incidents, view alerts, and stay mission-ready.</p>
          </div>
          <div className="space-y-2 text-sm text-slate-500">
            <div><span className="font-semibold text-slate-900">{activeIncidents.length}</span> active incidents</div>
            <div><span className="font-semibold text-slate-900">{openAlerts.length}</span> open missing alerts</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incident queue</CardTitle>
          </CardHeader>
          <CardContent>
            {activeIncidents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active incidents right now.</p>
            ) : (
              <div className="space-y-3">
                {activeIncidents.slice(0, 6).map(incident => (
                  <div key={incident.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{incident.patientName ?? 'Unknown patient'}</p>
                        <p className="text-xs text-muted-foreground">{incident.reportType} • {incident.latitude.toFixed(3)}, {incident.longitude.toFixed(3)}</p>
                      </div>
                      <Badge variant={incident.reportType === 'Medical' ? 'destructive' : 'warning'}>
                        {incident.reportType}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                      <div>Assigned officer: {incident.assignedOfficerName ?? 'Unassigned'}</div>
                      <div>Status: {incident.status}</div>
                      <div className="text-xs text-muted-foreground">{formatElapsed(incident.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missing person alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {openAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open missing-person alerts.</p>
            ) : (
              <div className="space-y-3">
                {openAlerts.slice(0, 6).map(alert => (
                  <div key={alert.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{alert.fullName}</p>
                        <p className="text-xs text-muted-foreground">Last seen: {alert.lastSeenAreaText ?? 'Unknown'}</p>
                      </div>
                      <Badge variant={alert.status === 'Open' ? 'destructive' : 'success'}>
                        {alert.status}
                      </Badge>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">{alert.description}</div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{alert.sightingCount} sighting{alert.sightingCount !== 1 ? 's' : ''}</span>
                      <span>{formatElapsed(alert.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
