import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emergencyApi } from '@/lib/api';
import { Badge, Card, CardContent } from '@/components/ui';
import { formatElapsed } from '@/lib/utils';

export default async function ResponderIncidentsPage() {
  const session = await getServerSession(authOptions);
  let incidents: any[] = [];
  try {
    const res = await emergencyApi.incidents(session!.accessToken);
    incidents = res.data?.items ?? [];
  } catch {
    // backend offline
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Incident queue</h1>
        <p className="text-sm text-muted-foreground">Review active assignments and incident status.</p>
      </div>
      <div className="grid gap-4">
        {incidents.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">No incidents available.</p>
            </CardContent>
          </Card>
        ) : (
          incidents.map(incident => (
            <Card key={incident.id}>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{incident.patientName ?? 'Unknown patient'}</p>
                    <p className="text-xs text-muted-foreground">{incident.reportType} — {formatElapsed(incident.createdAt)}</p>
                  </div>
                  <Badge variant={incident.status === 'Pending' ? 'destructive' : incident.status === 'Resolved' ? 'success' : 'warning'}>
                    {incident.status}
                  </Badge>
                </div>
                <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-xs text-muted-foreground">{incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Assigned</p>
                    <p className="text-xs text-muted-foreground">{incident.assignedOfficerName ?? 'Unassigned'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
