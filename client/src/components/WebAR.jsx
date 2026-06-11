import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  RefreshCw, 
  Info, 
  Trash2, 
  Smartphone, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Scan
} from 'lucide-react';

export default function WebAR() {
  const [activeScan, setActiveScan] = useState(null); // 'plastic', 'cigarette', 'screen'
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [targetObject, setTargetObject] = useState('plastic'); // Item placed in front of lens
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Webcam block or not found. Using simulation grid mode.', err.message);
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const scanDatabase = {
    plastic: {
      title: '♻️ PLASTIC BOTTLE IDENTIFIED',
      subtitle: 'Polyethylene Terephthalate (PET 1) - Clear Resin',
      decomposition: 'Takes 450+ years to break down.',
      fact: '91% of domestic plastics end up in landfills or oceans, breaking down into toxic microplastics.',
      action: 'Separate this bottle into the Blue Recycling Bin immediately. Earn +10 Points.',
      bgColor: 'border-emerald-500 bg-emerald-950/90 text-emerald-400'
    },
    cigarette: {
      title: '🚬 TOXIC WASTE: CIGARETTE PACK',
      subtitle: 'Cellulose Acetate Filter & Toxic Nicotiana Tabacum',
      decomposition: 'Takes 10-12 years to decompose.',
      fact: 'Butts release toxic chemicals (arsenic, lead) into soil and water systems. Filters represent the #1 littered item globally.',
      action: 'Consider joining the "Healthy Lungs: 7-Day Smoking Detox" challenge. Earn +150 Points.',
      bgColor: 'border-red-500 bg-red-950/90 text-red-400'
    },
    screen: {
      title: '💻 EXCESSIVE SCREEN USAGE',
      subtitle: 'High-intensity Blue Light emission (400-450nm)',
      decomposition: 'Active ocular fatigue strain.',
      fact: 'Blue light suppresses melatonin production by up to 50%, delaying sleep cycles and straining macular receptors.',
      action: 'Lock your phone. Perform the 20-20-20 rule: look 20 feet away for 20 seconds. Earn +20 Points.',
      bgColor: 'border-sky-500 bg-sky-950/90 text-sky-400'
    }
  };

  // Perform Simulated Lens Scanning
  const triggerScan = () => {
    setIsScanning(true);
    setActiveScan(null);

    setTimeout(() => {
      setIsScanning(false);
      setActiveScan(targetObject);
    }, 2500);
  };

  const resetScan = () => {
    setActiveScan(null);
    setIsScanning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <Camera className="w-6 h-6 text-emerald-500" /> WebAR Camera Scanner
        </h2>
        <p className="text-xs text-slate-400 font-sans">Place an item in front of your camera, select the matching target preset, and tap "Scan Viewfinder".</p>
      </div>

      {/* Main Scanner Screen split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Camera Frame Viewfinder */}
        <div className="lg:col-span-2 relative h-[500px] w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6 shadow-2xl">
          
          {/* Real video or Simulated grid background */}
          {cameraActive ? (
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 opacity-80 border border-slate-800">
              <div className="absolute inset-0 border border-slate-800 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-slate-800 rounded-full animate-pulse"></div>
                <div className="w-32 h-32 border border-dashed border-slate-800 rounded-full animate-pulse-slow"></div>
              </div>
              <Camera className="w-12 h-12 text-slate-600 mb-2 animate-bounce-slow" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">Viewfinder active (Webcam Offline)</span>
            </div>
          )}

          {/* Top Bar Overlay: Object Simulator Selector */}
          <div className="z-10 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center justify-between text-white w-full border border-white/10 text-xs">
            <span className="font-semibold text-slate-300">Target Object in Frame:</span>
            <select
              value={targetObject}
              onChange={(e) => {
                setTargetObject(e.target.value);
                resetScan();
              }}
              className="bg-slate-800 text-white rounded-lg border border-slate-700 px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="plastic">🥤 Plastic Water Bottle</option>
              <option value="cigarette">🚬 Cigarette Packet</option>
              <option value="screen">📱 Computer/Phone Screen</option>
            </select>
          </div>

          {/* Laser scanning sweep line */}
          {isScanning && (
            <div className="absolute left-0 right-0 h-1.5 bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-bounce z-20"></div>
          )}

          {/* Bounding box overlay for simulated AI detection */}
          {!isScanning && activeScan && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className={`w-64 h-64 border-4 border-dashed rounded-3xl flex items-center justify-center animate-pulse ${
                activeScan === 'plastic' ? 'border-emerald-500' : activeScan === 'cigarette' ? 'border-red-500' : 'border-sky-500'
              }`}>
                <div className="px-3 py-1 bg-black/80 text-[10px] text-white font-bold rounded-full border border-white/10 -mt-64">
                  {activeScan.toUpperCase()} DETECTED (98% MATCH)
                </div>
              </div>
            </div>
          )}

          {/* Scanner action / trigger */}
          <div className="z-10 w-full flex justify-center mt-auto">
            {!isScanning && !activeScan ? (
              <button
                onClick={triggerScan}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full flex items-center gap-2 shadow-lg shadow-emerald-500/20 text-xs transition-transform hover:scale-105"
              >
                <Scan className="w-4.5 h-4.5" /> Scan Viewfinder Frame
              </button>
            ) : isScanning ? (
              <div className="px-6 py-3 bg-slate-900/80 border border-slate-800 text-slate-300 rounded-full text-xs font-bold animate-pulse">
                Analyzing camera pixels...
              </div>
            ) : (
              <button
                onClick={resetScan}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-full text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" /> Reset Scanner
              </button>
            )}
          </div>

          {/* Scanner Overlay information block */}
          {activeScan && !isScanning && (
            <div className={`z-10 p-5 rounded-2xl border-2 backdrop-blur-md space-y-3 animate-slide-up w-full ${scanDatabase[activeScan].bgColor} mt-4`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5"><Sparkles className="w-4.5 h-4.5" /> {scanDatabase[activeScan].title}</h4>
                  <p className="text-[10px] text-white/70 font-semibold mt-0.5">{scanDatabase[activeScan].subtitle}</p>
                </div>
              </div>

              <div className="text-xs space-y-1 bg-black/40 p-3 rounded-xl border border-white/5">
                <p><span className="font-bold text-white">Decomposition:</span> {scanDatabase[activeScan].decomposition}</p>
                <p><span className="font-bold text-white">Impact Fact:</span> {scanDatabase[activeScan].fact}</p>
              </div>

              <p className="text-[10px] font-bold text-white flex items-center gap-1 bg-white/10 p-2 rounded">
                <Info className="w-4 h-4 shrink-0" /> {scanDatabase[activeScan].action}
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Guides & Details */}
        <div className="p-6 glass-card rounded-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold">AR Scanner Guide</h3>
            <p className="text-xs text-slate-400">How to use the AwareSphere object scanner for local environment and health audits.</p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <div className="p-3 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">1. Place the Object</h5>
              <p className="text-[11px] mt-0.5">Hold up a plastic bottle, cigarette packet, or position yourself in front of a computer screen.</p>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">2. Match the Preset</h5>
              <p className="text-[11px] mt-0.5">Use the drop-down selector at the top of the viewfinder screen to place the simulated target item.</p>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">3. Scan & Analyze</h5>
              <p className="text-[11px] mt-0.5">Click "Scan Viewfinder Frame". The analyzer scans color distributions and overlays bounding statistics.</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] text-emerald-600 dark:text-emerald-400 leading-normal font-semibold">
            🌱 Pro-Tip: Identifying and correctly segregating plastics based on scanning Resin codes reduces contamination rates at recycling centers by 30%.
          </div>
        </div>

      </div>

    </div>
  );
}
