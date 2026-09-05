"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Compass, 
  Eye, 
  Info, 
  Building2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  Leaf
} from "lucide-react";

interface TourScene {
  id: string;
  name: string;
  location: string;
  facilityType: string;
  description: string;
  image: string;
  hotspots: Array<{
    id: string;
    title: string;
    desc: string;
    x: number; // percentage 0 - 100
    y: number; // percentage 0 - 100
    icon: string;
  }>;
}

const TOUR_SCENES: TourScene[] = [
  {
    id: "aster-waterfront",
    name: "Aster Medcity Waterfront Presidential Suite",
    location: "Kochi, Ernakulam (JCI Accredited)",
    facilityType: "Quaternary Inpatient Suite",
    description: "Ultra-luxury international recovery wing overlooking the Cochin backwaters with dedicated in-suite ICU telemetry, attendant bedroom, and personal nursing console.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=2000&q=85",
    hotspots: [
      {
        id: "hs-1",
        title: "In-Suite ICU Telemetry",
        desc: "24/7 wireless continuous vital monitoring connected directly to Chief of Surgery console.",
        x: 32,
        y: 46,
        icon: "pulse"
      },
      {
        id: "hs-2",
        title: "Private Backwater Balcony",
        desc: "Air-purified recovery terrace overlooking pristine backwaters for stress reduction & oxygenation.",
        x: 68,
        y: 35,
        icon: "leaf"
      },
      {
        id: "hs-3",
        title: "Attendant Executive Bed",
        desc: "Separate adjoining luxury suite with international hospitality dining for accompanying family.",
        x: 82,
        y: 62,
        icon: "info"
      }
    ]
  },
  {
    id: "amrita-robotics",
    name: "Amrita Institute Robotic Surgical Theater",
    location: "Edappally, Kochi (NABH Accredited)",
    facilityType: "Hybrid Robotic OT Suite",
    description: "Class 100 laminar airflow surgical suite equipped with dual Da Vinci Xi robotic consoles, 4D-CT navigation, and sub-millimeter cardiac valve micro-instrumentation.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=2000&q=85",
    hotspots: [
      {
        id: "hs-4",
        title: "Da Vinci Xi Surgical Robot",
        desc: "EndoWrist instruments with 7 degrees of freedom allowing ultra-precise off-pump coronary anastomosis.",
        x: 45,
        y: 52,
        icon: "pulse"
      },
      {
        id: "hs-5",
        title: "Laminar Airflow Sterility",
        desc: "HEPA-filtered positive pressure system maintaining zero-infection surgical environment.",
        x: 55,
        y: 18,
        icon: "shield"
      }
    ]
  },
  {
    id: "somatheeram-ayurveda",
    name: "Somatheeram Ayurvedic Backwater Sanatorium",
    location: "Chowara Beach, Thiruvananthapuram",
    facilityType: "NABH Classical Ayurveda Center",
    description: "Centuries-old heritage healing haven situated on lush seaside cliff tops specializing in authentic 14–21 day Panchakarma, Pizhichil, and herbal oil spine recovery.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85",
    hotspots: [
      {
        id: "hs-6",
        title: "Classical Herbal Dispensary",
        desc: "Over 450 proprietary classical herbal preparations sourced from Western Ghats organic flora.",
        x: 35,
        y: 58,
        icon: "leaf"
      },
      {
        id: "hs-7",
        title: "Dharapaath Ayurvedic Treatment Table",
        desc: "Handcrafted single-piece medicinal wood (Venga) table designed for synchronized herbal oil therapies.",
        x: 64,
        y: 55,
        icon: "info"
      }
    ]
  },
  {
    id: "kottakkal-heritage",
    name: "Arya Vaidya Sala Kottakkal Heritage Convalescence",
    location: "Kottakkal, Malappuram",
    facilityType: "120-Year Ashtavaidya Foundation",
    description: "World-renowned research sanatorium where classical Sanskrit treatises guide specialized post-operative rehabilitation, joint restoration, and neuro-motor recovery.",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=2000&q=85",
    hotspots: [
      {
        id: "hs-8",
        title: "Ashtavaidya Vaidya Consultation Desk",
        desc: "Traditional Nadi Pariksha (pulse diagnostics) combined with modern radiological correlation.",
        x: 50,
        y: 42,
        icon: "pulse"
      }
    ]
  }
];

interface VirtualTour360ViewerProps {
  onBookConsultation?: () => void;
}

export function VirtualTour360Viewer({ onBookConsultation }: VirtualTour360ViewerProps = {}) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [panOffset, setPanOffset] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<any | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  const currentScene = TOUR_SCENES[currentSceneIndex];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setPanOffset((prev) => (prev + 0.08) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setDragStartX(e.clientX);
    setPanOffset((prev) => {
      let next = prev - deltaX * 0.08;
      if (next < 0) next += 100;
      return next % 100;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
      setIsAutoRotating(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    setDragStartX(e.touches[0].clientX);
    setPanOffset((prev) => {
      let next = prev - deltaX * 0.12;
      if (next < 0) next += 100;
      return next % 100;
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={viewerContainerRef}
      className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen" : "w-full"
      }`}
    >
      {/* 360 Panorama Viewport */}
      <div 
        className="relative h-[420px] sm:h-[540px] lg:h-[620px] w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Seamless Panoramic Image with 360 Scroll Simulation */}
        <div 
          className="absolute inset-y-0 flex h-full will-change-transform"
          style={{
            transform: `translateX(-${panOffset}%)`,
            width: "300%",
            transition: isDragging ? "none" : "transform 0.05s ease-out"
          }}
        >
          <img 
            src={currentScene.image} 
            alt={currentScene.name}
            className="w-1/3 h-full object-cover shrink-0 pointer-events-none brightness-90 contrast-105"
          />
          <img 
            src={currentScene.image} 
            alt={currentScene.name}
            className="w-1/3 h-full object-cover shrink-0 pointer-events-none brightness-90 contrast-105"
          />
          <img 
            src={currentScene.image} 
            alt={currentScene.name}
            className="w-1/3 h-full object-cover shrink-0 pointer-events-none brightness-90 contrast-105"
          />
        </div>

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(15,32,66,0.5)_100%)]" />

        {/* 360 Compass & Interactive Indicator */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 p-2 px-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs">
          <Compass className="w-4 h-4 text-[#38BDF8] animate-[spin_8s_linear_infinite]" />
          <span className="font-mono text-[11px] font-bold text-blue-200">
            360° LIVE TOUR • HEADING {Math.round((panOffset * 3.6)) % 360}°
          </span>
        </div>

        {/* Top Right Controls (Auto-spin, Audio, Fullscreen) */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
              isAutoRotating 
                ? "bg-[#0E82FD] text-white border-blue-400/30 shadow-lg shadow-blue-500/30" 
                : "bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800"
            }`}
            title={isAutoRotating ? "Pause Auto-Rotation" : "Resume 360° Auto-Rotation"}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md border border-white/10 transition-all shadow-md"
            title="Toggle Fullscreen Inspection"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Interactive 3D Hotspot Pins on Scene */}
        {currentScene.hotspots.map((hs) => {
          // Calculate relative position based on panOffset
          const adjustedX = (hs.x - (panOffset % 100) + 100) % 100;
          const isVisible = adjustedX >= 5 && adjustedX <= 95;

          if (!isVisible) return null;

          return (
            <div
              key={hs.id}
              className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
              style={{ left: `${adjustedX}%`, top: `${hs.y}%` }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(activeHotspot?.id === hs.id ? null : hs);
                }}
                className="relative group p-2 rounded-full bg-[#0E82FD] text-white shadow-xl shadow-blue-500/50 hover:scale-125 transition-all duration-300 cursor-pointer"
              >
                <span className="absolute inset-0 rounded-full bg-[#38BDF8] animate-ping opacity-75" />
                {hs.icon === "pulse" ? (
                  <HeartPulse className="w-4 h-4 relative z-10" />
                ) : hs.icon === "leaf" ? (
                  <Leaf className="w-4 h-4 relative z-10" />
                ) : hs.icon === "shield" ? (
                  <ShieldCheck className="w-4 h-4 relative z-10" />
                ) : (
                  <Info className="w-4 h-4 relative z-10" />
                )}
              </button>

              {/* Hotspot Floating Tooltip */}
              {activeHotspot?.id === hs.id && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 text-white shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center space-x-2 text-[#38BDF8] text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Clinical Inspection</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{hs.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{hs.desc}</p>
                  <button 
                    onClick={() => setActiveHotspot(null)}
                    className="mt-2 text-[10px] text-slate-400 hover:text-white font-bold"
                  >
                    Close [✕]
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Drag Hint on First Load */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center text-white/70 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 animate-pulse hidden sm:block">
          <span className="text-xs font-semibold">‹ Drag to rotate 360° panorama ›</span>
        </div>

        {/* Bottom Scene Info Banner */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/15 text-white">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-[#38BDF8] border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                {currentScene.facilityType}
              </span>
              <span className="text-xs text-slate-400">• {currentScene.location}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{currentScene.name}</h3>
            <p className="text-xs text-slate-300 line-clamp-2 sm:line-clamp-none leading-relaxed">
              {currentScene.description}
            </p>
          </div>

          {/* Scene Nav Switchers & Action Button */}
          <div className="flex flex-wrap items-center gap-2 self-end shrink-0">
            {onBookConsultation && (
              <button
                onClick={onBookConsultation}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0E82FD] to-[#38BDF8] hover:from-blue-600 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book This Facility</span>
              </button>
            )}

            <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  setCurrentSceneIndex((prev) => (prev === 0 ? TOUR_SCENES.length - 1 : prev - 1));
                  setActiveHotspot(null);
                }}
                className="p-1.5 rounded-lg hover:bg-[#0E82FD] text-white transition-all cursor-pointer"
                title="Previous Facility"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-slate-400 px-1.5">
                {currentSceneIndex + 1} / {TOUR_SCENES.length}
              </span>
              <button
                onClick={() => {
                  setCurrentSceneIndex((prev) => (prev === TOUR_SCENES.length - 1 ? 0 : prev + 1));
                  setActiveHotspot(null);
                }}
                className="p-1.5 rounded-lg hover:bg-[#0E82FD] text-white transition-all cursor-pointer"
                title="Next Facility"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails Scene Selector Strip */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-3 overflow-x-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 hidden sm:inline">
          360° Facilities:
        </span>
        {TOUR_SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => {
              setCurrentSceneIndex(idx);
              setActiveHotspot(null);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center space-x-2 cursor-pointer ${
              currentSceneIndex === idx
                ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30 font-bold"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate max-w-[160px] sm:max-w-none">{scene.name.split(" ")[0]} {scene.name.split(" ")[1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
