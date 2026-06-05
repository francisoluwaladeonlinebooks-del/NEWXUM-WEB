import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { alertApi } from '@/lib/api';
import { Badge, Card, CardContent } from '@/components/ui';
import { formatElapsed } from '@/lib/utils';

export default async function ResponderMissingPersonsPage() {
  const session = await getServerSession(authOptions);
  let alerts: any[] = [];
  try {
    const res = await alertApi.list(session!.accessToken);
    alerts = res.data?.items ?? [];
  } catch {
    // backend offline
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Missing-person alerts</h1>
        <p className="text-sm text-muted-foreground">Track open alerts and coordinate response across the camp.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {alerts.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">No missing-person alerts available.</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map(alert => (
            <Card key={alert.id}>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{alert.fullName}</p>
                    <p className="text-xs text-muted-foreground">Age {alert.age ?? '?'}</p>
                  </div>
                  <Badge variant={alert.status === 'Open' ? 'destructive' : 'success'}>{alert.status}</Badge>
                </div>
                <p className="text-sm text-slate-600">{alert.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{alert.sightingCount} sighting{alert.sightingCount !== 1 ? 's' : ''}</span>
                  <span>{formatElapsed(alert.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
