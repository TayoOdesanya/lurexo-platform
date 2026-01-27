'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff } from 'lucide-react';

interface QRScannerCameraProps {
  onScan: (decodedText: string) => void;
  isActive: boolean;
}

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
  const [scannedCode, setScannedCode] = useState<string>('');

  const handleScan = (decodedText: string) => {
    setScannedCode(decodedText);
    console.log('Scanned:', decodedText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">QR Scanner</h1>
        
        <QRScannerCamera onScan={handleScan} isActive={true} />
        
        {scannedCode && (
          <div className="mt-6 p-4 bg-white/10 rounded-xl text-white">
            <p className="text-sm text-gray-400 mb-1">Last scanned:</p>
            <p className="font-mono text-lg break-all">{scannedCode}</p>
          </div>
        )}
      </div>
    </div>
  );
}