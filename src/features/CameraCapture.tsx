import { useRef, useState, useCallback } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "../components/Button";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isCaptured, setIsCaptured] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError("");
      setIsCaptured(false);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Tidak dapat mengakses kamera. Pastikan izin telah diberikan.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setIsCaptured(true);
        stopCamera();
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        {error ? (
          <div className="text-red-400 text-sm text-center p-4">{error}</div>
        ) : !stream && !isCaptured ? (
          <button onClick={startCamera} className="text-white flex flex-col items-center gap-2 hover:text-blue-400 transition-colors">
            <Camera size={48} />
            <span>Buka Kamera</span>
          </button>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${isCaptured ? 'hidden' : 'block'}`}
            />
            <canvas ref={canvasRef} className={`w-full h-full object-cover ${isCaptured ? 'block' : 'hidden'}`} />
          </>
        )}
      </div>

      {stream && !isCaptured && (
        <Button onClick={capturePhoto} className="w-full max-w-sm flex items-center justify-center gap-2">
          <Camera size={18} />
          Ambil Foto
        </Button>
      )}
      
      {isCaptured && (
        <Button variant="outline" onClick={startCamera} className="w-full max-w-sm flex items-center justify-center gap-2">
          <RefreshCw size={18} />
          Ulangi Foto
        </Button>
      )}
    </div>
  );
}
