import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Calendar, Download, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OwnerLayout from '@/components/layouts/OwnerLayout';

const mockGymId = 'gym_abc123';

const mockCheckins = [
  { id: 1, name: 'John Smith', email: 'john@example.com', time: '10:30 AM', date: '2024-01-15' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', time: '10:15 AM', date: '2024-01-15' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', time: '09:45 AM', date: '2024-01-15' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', time: '09:30 AM', date: '2024-01-15' },
  { id: 5, name: 'Alex Brown', email: 'alex@example.com', time: '09:00 AM', date: '2024-01-15' },
];

export default function QRPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const todayCheckins = mockCheckins.length;

  const downloadQR = () => {
    const svg = document.getElementById('gym-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'gymkey-qr-code.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">QR Code & Check-ins</h1>
          <p className="text-muted-foreground">Display this QR code for members to check in.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Card */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Your Gym QR Code</h2>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-background p-6 rounded-2xl border border-border mb-6">
                <QRCodeSVG
                  id="gym-qr-code"
                  value={`gymkey://checkin/${mockGymId}`}
                  size={200}
                  level="H"
                  includeMargin
                  bgColor="transparent"
                  fgColor="currentColor"
                  className="text-foreground"
                />
              </div>
              <p className="text-muted-foreground text-sm text-center mb-6">
                Members can scan this code to check in instantly
              </p>
              <Button onClick={downloadQR} variant="outline" className="w-full">
                <Download className="w-5 h-5 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Today's Check-ins</p>
                  <p className="text-4xl font-bold text-foreground">{todayCheckins}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Filter by Date</span>
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Check-ins Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Check-in History</h2>
            <p className="text-muted-foreground text-sm">Showing check-ins for {selectedDate}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {mockCheckins.map((checkin) => (
                  <tr key={checkin.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-bold">
                            {checkin.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{checkin.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{checkin.email}</td>
                    <td className="p-4 text-muted-foreground">{checkin.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
