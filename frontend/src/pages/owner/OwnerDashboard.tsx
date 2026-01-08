import { Link } from 'react-router-dom';
import { Building2, Users, QrCode, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OwnerLayout from '@/components/layouts/OwnerLayout';

// Mock data
const mockGym = {
  name: 'FitZone Gym',
  status: 'APPROVED', // PENDING or APPROVED
};

const stats = [
  { label: 'Total Members', value: '156', icon: Users, color: 'text-primary' },
  { label: "Today's Check-ins", value: '42', icon: QrCode, color: 'text-accent' },
  { label: 'Gym Status', value: mockGym.status === 'APPROVED' ? 'Active' : 'Pending', icon: mockGym.status === 'APPROVED' ? CheckCircle2 : Clock, color: mockGym.status === 'APPROVED' ? 'text-primary' : 'text-accent' },
];

const recentCheckins = [
  { id: 1, name: 'John Smith', time: '10:30 AM', avatar: 'J' },
  { id: 2, name: 'Sarah Wilson', time: '10:15 AM', avatar: 'S' },
  { id: 3, name: 'Mike Johnson', time: '09:45 AM', avatar: 'M' },
  { id: 4, name: 'Emily Davis', time: '09:30 AM', avatar: 'E' },
];

export default function OwnerDashboard() {
  const hasGym = true; // Change to false to show "Register Gym" prompt

  return (
    <OwnerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your gym overview.</p>
          </div>
          {!hasGym && (
            <Link to="/dashboard/owner/register-gym">
              <Button className="gradient-hero text-primary-foreground shadow-primary">
                <Plus className="w-5 h-5 mr-2" />
                Register Gym
              </Button>
            </Link>
          )}
        </div>

        {hasGym ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="bg-card rounded-2xl p-6 shadow-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.color === 'text-primary' ? 'gradient-hero' : 'gradient-accent'} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Gym Info Card */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Your Gym</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mockGym.status === 'APPROVED' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-accent/10 text-accent'
                }`}>
                  {mockGym.status === 'APPROVED' ? 'Active' : 'Pending Approval'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl gradient-hero flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{mockGym.name}</h3>
                  <p className="text-muted-foreground">View details and manage settings</p>
                </div>
              </div>
            </div>

            {/* Recent Check-ins */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Check-ins</h2>
                <Link to="/dashboard/owner/qr" className="text-primary font-medium hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentCheckins.map((checkin) => (
                  <div key={checkin.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">{checkin.avatar}</span>
                      </div>
                      <span className="font-medium text-foreground">{checkin.name}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{checkin.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* No Gym State */
          <div className="bg-card rounded-2xl p-12 shadow-card text-center">
            <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Gym Registered</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Register your gym to start accepting members and tracking check-ins.
            </p>
            <Link to="/dashboard/owner/register-gym">
              <Button className="gradient-hero text-primary-foreground shadow-primary">
                <Plus className="w-5 h-5 mr-2" />
                Register Your Gym
              </Button>
            </Link>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
