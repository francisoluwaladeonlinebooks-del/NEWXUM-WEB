import { propertyApi } from '@/lib/api';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BookingFlow } from '@/components/worshipper/BookingFlow';
import { Badge, Card, CardContent } from '@/components/ui';
import { Building2, MapPin, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [propertyRes, roomsRes] = await Promise.all([
    propertyApi.get(params.id),
    propertyApi.getRoomTypes(params.id),
  ]);

  if (!propertyRes.success || !propertyRes.data) notFound();

  const property = propertyRes.data;
  const rooms = roomsRes.data ?? [];
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin className="h-4 w-4" />
              <span>{property.address}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">{property.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Badge variant={property.status === 'Approved' ? 'success' : 'secondary'}>{property.status}</Badge>
              <span className="rounded-full bg-white px-3 py-1 text-slate-600 shadow-sm">Hosted by {property.hostName}</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
              <p className="text-sm text-slate-500">Verified rooms</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{rooms.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Redemption City</p>
            </div>
            {property.lastSupervisedAt && (
              <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
                <p className="text-sm text-slate-500">Last supervised</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatDate(property.lastSupervisedAt)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {property.photoUrls?.length > 0 && (
        <div className="grid gap-4 overflow-hidden rounded-[2rem] lg:grid-cols-[2.5fr_1fr] lg:h-[420px] mb-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={property.photoUrls[0]} alt={`${property.name} main`} className="h-full w-full object-cover" />
          </div>
          <div className="grid gap-4">
            {property.photoUrls.slice(1, 3).map((url, index) => (
              <div key={index} className="relative overflow-hidden rounded-[2rem] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`${property.name} photo ${index + 2}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.65fr_0.95fr]">
        <div>
          <Card className="mb-8">
            <CardContent className="p-7">
              <h2 className="text-2xl font-semibold text-slate-900">About this property</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{property.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Host</p>
                  <p className="mt-2 font-semibold text-slate-900">{property.hostName}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="mt-2 font-semibold text-slate-900">{property.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Available Room Types</h2>
              <p className="mt-1 text-sm text-slate-500">Choose the right rate and capacity for your stay.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">{rooms.length} room type{rooms.length === 1 ? '' : 's'}</span>
          </div>

          <div className="space-y-5">
            {rooms.map((room) => (
              <Card key={room.id} className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900">{room.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{room.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {room.amenities.map((amenity) => (
                          <span key={amenity} className="rounded-full bg-[#E8F1FF] px-3 py-1 text-xs font-semibold text-[#1B3A6B]">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-slate-500">Sleeps {room.capacity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-[#1B3A6B]">₦{room.pricePerNight.toLocaleString()}</div>
                      <p className="mt-1 text-sm text-slate-500">per night</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Booking summary</h2>
            <p className="mt-3 text-sm text-slate-600">Get notified when a room becomes available and confirm your stay with the host.</p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                <span className="text-sm text-slate-500">Property status</span>
                <span className="font-semibold text-slate-900">{property.status}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                <span className="text-sm text-slate-500">Room types</span>
                <span className="font-semibold text-slate-900">{rooms.length}</span>
              </div>
              {property.lastSupervisedAt && (
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-500">Supervised</span>
                  <span className="font-semibold text-slate-900">{formatDate(property.lastSupervisedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <BookingFlow property={property} rooms={rooms} session={session} />
          </div>
        </div>
      </div>
    </div>
  );
}
