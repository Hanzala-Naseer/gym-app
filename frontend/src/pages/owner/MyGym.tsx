import { Building2, MapPin, Clock, CheckCircle2, Tag } from 'lucide-react';
import OwnerLayout from '@/components/layouts/OwnerLayout';

const mockGym = {
  name: 'FitZone Gym',
  status: 'APPROVED',
  address: '123 Fitness Street, Downtown',
  latitude: 40.7128,
  longitude: -74.0060,
  planType: 'Pro',
  facilities: ['Cardio Equipment', 'Free Weights', 'Swimming Pool', 'Sauna', 'Group Classes'],
  hours: {
    Monday: '6:00 AM - 10:00 PM',
    Tuesday: '6:00 AM - 10:00 PM',
    Wednesday: '6:00 AM - 10:00 PM',
    Thursday: '6:00 AM - 10:00 PM',
    Friday: '6:00 AM - 10:00 PM',
    Saturday: '8:00 AM - 8:00 PM',
    Sunday: '8:00 AM - 6:00 PM',
  },
};

export default function MyGym() {
  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Gym</h1>
            <p className="text-muted-foreground">View and manage your gym details.</p>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            mockGym.status === 'APPROVED' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-accent/10 text-accent'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            {mockGym.status === 'APPROVED' ? 'Active' : 'Pending Approval'}
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gym Name</p>
                <p className="font-medium text-foreground">{mockGym.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{mockGym.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Latitude</p>
                  <p className="text-foreground">{mockGym.latitude}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Longitude</p>
                  <p className="text-foreground">{mockGym.longitude}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan Type</p>
                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium gradient-accent text-accent-foreground">
                  {mockGym.planType}
                </span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Operating Hours</h2>
            </div>

            <div className="space-y-3">
              {Object.entries(mockGym.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="font-medium text-foreground">{day}</span>
                  <span className="text-muted-foreground">{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Tag className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Facilities</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {mockGym.facilities.map((facility) => (
              <span
                key={facility}
                className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
