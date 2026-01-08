import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Clock, Image, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import OwnerLayout from '@/components/layouts/OwnerLayout';

const facilityOptions = [
  'Cardio Equipment', 'Free Weights', 'Swimming Pool', 'Sauna', 
  'Group Classes', 'Personal Training', 'Locker Rooms', 'Parking',
  'WiFi', 'Juice Bar', 'Yoga Studio', 'CrossFit Area'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function RegisterGym() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    planType: '',
    imageUrl: '',
    facilities: [] as string[],
    hours: {} as Record<string, string>,
  });

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const updateHours = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: { ...prev.hours, [day]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call - replace with actual
      // await gymService.registerGym(formData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Gym registered successfully!',
        description: 'Your gym is pending approval.',
      });
      
      navigate('/dashboard/owner/my-gym');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Register Your Gym</h1>
          <p className="text-muted-foreground">Fill in the details to register your gym on GymKey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Gym Name</Label>
                <Input
                  id="name"
                  placeholder="FitZone Gym"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="123 Fitness Street, City"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="40.7128"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="-74.0060"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planType">Plan Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, planType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Cover Image URL</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/gym-image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="pl-10"
                  />
                </div>
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
              {facilityOptions.map((facility) => (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.facilities.includes(facility)
                      ? 'gradient-hero text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {facility}
                </button>
              ))}
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

            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium text-foreground">{day}</span>
                  <Input
                    placeholder="6:00 AM - 10:00 PM"
                    value={formData.hours[day] || ''}
                    onChange={(e) => updateHours(day, e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full gradient-hero text-primary-foreground shadow-primary hover:opacity-90 transition-opacity py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                Register Gym
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </OwnerLayout>
  );
}
