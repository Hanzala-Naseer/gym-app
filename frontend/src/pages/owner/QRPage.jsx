import { useEffect, useState, useCallback, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Calendar,
  Download,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function QRPage() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const pollerRef = useRef(null);

  const [gym, setGym] = useState(null);
  const [qrToken, setQrToken] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(true);

  const gymId = gym?.id;

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await fetch(`${API_URL}/owners/my-gyms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setGym(null);
          return;
        }

        const data = await res.json();
        const myGym = data.gyms?.[0] || null;

        setGym(
          myGym ? { ...myGym, status: myGym.status?.toLowerCase() } : null,
        );

        if (myGym?.status === "approved" && pollerRef.current) {
          clearInterval(pollerRef.current);
          pollerRef.current = null;
        }
      } catch (err) {
        console.error("Gym fetch error:", err);
        setGym(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGym();

    pollerRef.current = setInterval(() => {
      if (!gym || gym.status !== "approved") {
        fetchGym();
      }
    }, 4000);

    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
      }
    };
  }, [token, API_URL, gym?.status]);

  const fetchQR = useCallback(async () => {
    if (!gymId || gym.status !== "approved") {
      setQrToken(null);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/qr/${gymId}/qr`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setQrToken(null);
        return;
      }

      const data = await res.json();
      if (data?.qrToken) {
        setQrToken(data.qrToken);
        setSecondsLeft(60);
      } else {
        setQrToken(null);
      }
    } catch (err) {
      console.error("QR fetch error:", err);
      setQrToken(null);
    }
  }, [gymId, gym?.status, token, API_URL]);

  useEffect(() => {
    if (!gym || gym.status !== "approved") return;

    fetchQR();
    const interval = setInterval(fetchQR, 60000);
    return () => clearInterval(interval);
  }, [fetchQR, gym?.status]);

  /* ======================================================
     3️⃣ QR COUNTDOWN
  ====================================================== */
  useEffect(() => {
    if (!qrToken || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [qrToken, secondsLeft]);

  /* ======================================================
     4️⃣ FETCH ATTENDANCE
  ====================================================== */
  useEffect(() => {
    if (!gymId) return;

    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${API_URL}/qr/${gymId}/attendance`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setAttendance([]);
          return;
        }

        const data = await res.json();
        setAttendance(data.attendance || []);
      } catch (err) {
        console.error("Attendance fetch error:", err);
        setAttendance([]);
      }
    };

    fetchAttendance();
  }, [gymId, token, API_URL]);

  const filteredAttendance = attendance.filter((a) =>
    a.checkedInAt.startsWith(selectedDate),
  );
  const todayCheckins = filteredAttendance.length;

  /* ======================================================
     5️⃣ DOWNLOAD QR
  ====================================================== */
  const downloadQR = () => {
    const svg = document.getElementById("gym-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = png;
      link.download = "gymkey-qr.png";
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  /* ======================================================
     6️⃣ RENDER
  ====================================================== */
  if (loading) {
    return (
      <OwnerLayout>
        <div className="text-center p-12 text-lg text-primary">
          <Clock className="w-6 h-6 mx-auto mb-3 animate-spin" />
          Loading gym details...
        </div>
      </OwnerLayout>
    );
  }

  if (!gym || gym.status !== "approved") {
    return (
      <OwnerLayout>
        <div className="bg-card rounded-2xl p-8 shadow-card text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-accent" />
          <h2 className="text-xl font-bold mb-2">Waiting for Admin Approval</h2>
          <p className="text-muted-foreground animate-pulse">
            QR access will unlock automatically once approved.
          </p>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            QR Code & Check-ins
          </h1>
          <p className="text-muted-foreground">
            QR refreshes automatically every 60 seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <QrCode className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Live Gym QR</h2>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-background p-6 rounded-2xl border mb-4">
                <QRCodeSVG
                  id="gym-qr-code"
                  value={qrToken}
                  size={220}
                  level="H"
                />
              </div>

              <div className="flex items-center gap-2 text-sm mb-4">
                <Clock className="w-4 h-4" />
                Expires in {secondsLeft}s
              </div>

              {/* <Button onClick={downloadQR} variant="outline" className="w-full">
                <Download className="w-5 h-5 mr-2" />
                Download QR
              </Button> */}
            </div>
          </div>

          {/* Attendance */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <p className="text-muted-foreground mb-1">Today's Check-ins</p>
              <p className="text-4xl font-bold">{todayCheckins}</p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5" />
                Filter by Date
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5" />
                Attendance ({filteredAttendance.length})
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3">
                {filteredAttendance.length ? (
                  filteredAttendance.map((a, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0"
                    >
                      <p className="font-medium">{a.user.name}</p>
                      <p className="text-muted-foreground">
                        {new Date(a.checkedInAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No check-ins for this date.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
