'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, Search, Users, QrCode } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiBase';

const API_BASE_URL = getApiBaseUrl();

function getAccessTokenClient(): string | null {
  try {
    return localStorage.getItem('authToken') ?? localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

interface QRScannerCameraProps {
  onScan: (decodedText: string) => void;
  isActive: boolean;
}

type GuestListStatus = 'INVITED' | 'CHECKED_IN' | 'CANCELLED';

type GuestListEntry = {
  id: string;
  eventId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  status: GuestListStatus;
  createdAt?: string;
  updatedAt?: string;
};

type ScanResult = {
  status: 'scanned' | 'already_scanned';
  ticketNumber?: string;
  qrCode?: string;
  eventTitle?: string;
  tierName?: string;
  holderName?: string;
  scannedAt?: string | null;
};

function QRScannerCamera({ onScan, isActive }: QRScannerCameraProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const initScanner = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Use back camera on mobile
        });
        stream.getTracks().forEach((track) => track.stop()); // Stop immediately, just checking permission

        setHasPermission(true);

        // Initialize scanner
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10, // Frames per second
            qrbox: { width: 250, height: 250 }, // Scanning box size
          },
          (decodedText) => {
            // Success callback
            onScan(decodedText);
            
            // Vibrate on successful scan (if supported)
            if ('vibrate' in navigator) {
              navigator.vibrate(200);
            }
          },
          (errorMessage) => {
            // Error callback (can be noisy, so we don't log all)
          }
        );

        setIsScanning(true);
        setError(null);
      } catch (err) {
        console.error('Scanner init error:', err);
        setHasPermission(false);
        setError('Camera access denied. Please enable camera permissions.');
      }
    };

    initScanner();

    // Cleanup
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
            setIsScanning(false);
          })
          .catch(console.error);
      }
    };
  }, [isActive, onScan]);

  if (!isActive) {
    return (
      <div className="w-full aspect-square bg-gray-900 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <CameraOff className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-medium">Scanner inactive</p>
        </div>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="w-full aspect-square bg-gray-900 rounded-2xl flex items-center justify-center p-8">
        <div className="text-center text-white">
          <CameraOff className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium mb-2">Camera Access Required</p>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Scanner container */}
      <div
        id="qr-reader"
        className="w-full rounded-2xl overflow-hidden shadow-2xl"
      />

      {/* Scanning overlay */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner markers */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-purple-500 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-purple-500 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-purple-500 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-purple-500 rounded-br-xl" />

          {/* Scanning line animation */}
          <div className="absolute inset-x-0 top-1/2 h-1 bg-purple-500 animate-pulse" />
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-2 text-white text-sm font-medium">
        <Camera className="w-4 h-4 text-green-500" />
        <span>Ready to scan</span>
      </div>
    </div>
  );
}

export default function ScannerPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId;
  const scannerIdRef = useRef(`scanner_${Date.now()}`);

  const [activeTab, setActiveTab] = useState<'scanner' | 'guest-list'>('scanner');
  const [scannedCode, setScannedCode] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSubmitting, setScanSubmitting] = useState(false);

  const [guestEntries, setGuestEntries] = useState<GuestListEntry[]>([]);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setAccessToken(getAccessTokenClient());
  }, []);

  useEffect(() => {
    if (activeTab !== 'guest-list' || !accessToken || !eventId) return;

    let cancelled = false;
    setGuestLoading(true);
    setGuestError(null);

    fetch(`${API_BASE_URL}/events/${eventId}/guest-list`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || 'Failed to load guest list');
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? (data as GuestListEntry[]) : [];
        setGuestEntries(list);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setGuestError(err?.message ?? 'Failed to load guest list');
      })
      .finally(() => {
        if (!cancelled) setGuestLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, accessToken, eventId]);

  const handleScan = async (decodedText: string) => {
    setScannedCode(decodedText);
    setScanError(null);

    if (scanSubmitting) return;

    const token = getAccessTokenClient();
    if (!token) {
      setScanError('Sign in required to validate tickets.');
      return;
    }

    setScanSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/tickets/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          qrCode: decodedText,
          eventId,
          scannerId: scannerIdRef.current,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Failed to scan ticket');
      }

      const payload = await res.json();
      setScanResult({
        status: payload.status,
        ticketNumber: payload.ticket?.ticketNumber,
        qrCode: payload.ticket?.qrCode,
        eventTitle: payload.ticket?.eventTitle,
        tierName: payload.ticket?.tierName,
        holderName: payload.ticket?.holderName,
        scannedAt: payload.ticket?.scannedAt ?? null,
      });
    } catch (err: any) {
      setScanError(err?.message ?? 'Failed to scan ticket');
    } finally {
      setScanSubmitting(false);
    }
  };

  const filteredGuests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return guestEntries;
    return guestEntries.filter((guest) => {
      const name = guest.name?.toLowerCase() ?? '';
      const email = guest.email?.toLowerCase() ?? '';
      const phone = guest.phone?.toLowerCase() ?? '';
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [guestEntries, searchQuery]);

  const renderStatusBadge = (status: GuestListStatus) => {
    switch (status) {
      case 'CHECKED_IN':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
            Checked In
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
            Invited
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-3xl mx-auto text-white">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold">Event Scanner</h1>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Scanner
            </button>
            <button
              onClick={() => setActiveTab('guest-list')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'guest-list'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Guest List
            </button>
          </div>
        </div>

        {activeTab === 'scanner' ? (
          <div>
            <QRScannerCamera onScan={handleScan} isActive={true} />

            {scannedCode && (
              <div className="mt-6 p-4 bg-white/10 rounded-xl text-white">
                <p className="text-sm text-gray-400 mb-1">Last scanned:</p>
                <p className="font-mono text-lg break-all">{scannedCode}</p>
              </div>
            )}

            {scanError && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {scanError}
              </div>
            )}

            {scanResult && (
              <div
                className={`mt-4 rounded-xl border p-4 text-sm ${
                  scanResult.status === 'scanned'
                    ? 'border-green-500/30 bg-green-500/10 text-green-100'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {scanResult.status === 'scanned' ? 'Ticket scanned' : 'Already scanned'}
                  </span>
                  {scanResult.scannedAt && (
                    <span className="text-xs opacity-80">
                      {new Date(scanResult.scannedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                {scanResult.holderName && (
                  <p className="mt-2">Guest: {scanResult.holderName}</p>
                )}
                {scanResult.tierName && (
                  <p className="mt-1">Tier: {scanResult.tierName}</p>
                )}
                {scanResult.ticketNumber && (
                  <p className="mt-1 font-mono break-all">Ticket: {scanResult.ticketNumber}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-semibold">Guest List</h2>
                  </div>
                  <p className="text-sm text-gray-400">
                    {guestEntries.length} {guestEntries.length === 1 ? 'guest' : 'guests'}
                  </p>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guests..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>

            {guestLoading ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-300">Loading guest list...</p>
              </div>
            ) : guestError ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <p className="text-red-300 font-medium mb-2">Unable to load guest list</p>
                <p className="text-sm text-red-200/80">{guestError}</p>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-300">
                <p className="font-medium">No guests found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different search.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">{guest.name}</p>
                      <div className="text-sm text-gray-400 space-y-1 mt-1">
                        <p className="truncate">{guest.email ?? '-'}</p>
                        <p className="truncate">{guest.phone ?? '-'}</p>
                        {guest.notes && <p className="text-xs text-gray-500">{guest.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(guest.status ?? 'INVITED')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
