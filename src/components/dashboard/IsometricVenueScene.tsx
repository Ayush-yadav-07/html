import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  MapPin, 
  Users, 
  Armchair, 
  Eye, 
  Compass, 
  Flower2, 
  GlassWater,
  Layers
} from 'lucide-react';
import { EventItem, SeatingTable } from '../../types';

interface IsometricVenueSceneProps {
  activeEvent?: EventItem;
  tables: SeatingTable[];
  totalGuests: number;
}

type ViewAngle = 'overview' | 'stage' | 'seating';

export const IsometricVenueScene: React.FC<IsometricVenueSceneProps> = ({
  activeEvent,
  tables,
  totalGuests,
}) => {
  const [lightingMode, setLightingMode] = useState<'golden' | 'evening' | 'starlit'>('golden');
  const [viewAngle, setViewAngle] = useState<ViewAngle>('overview');
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredObject(null);
  };

  const venueName = activeEvent?.venue || 'The Glasshouse Pavilion & Orangery';
  const eventName = activeEvent?.name || 'Grand Gala Celebration';
  const tableCount = tables.length > 0 ? tables.length : 6;

  // View angle preset rotations
  const angleConfigs = {
    overview: { rotateX: 54, rotateZ: -32, scale: 1 },
    stage: { rotateX: 42, rotateZ: -18, scale: 1.15 },
    seating: { rotateX: 60, rotateZ: -45, scale: 1.1 },
  }[viewAngle];

  // Lighting scheme styles
  const lightConfig = {
    golden: {
      ambient: 'from-[#FDFBF7] via-[#F7EEDF] to-[#EAD8C3]',
      border: 'border-[#E6D5C1]',
      glow: 'shadow-[0_16px_40px_rgba(217,130,97,0.18)]',
      festoonColor: '#F59E0B',
      plinthBase: '#F3E8DA',
      plinthEdge: '#E6D5C1',
      stageGlow: 'bg-amber-300/30',
      tagText: 'Golden Hour Daylight',
      badgeBg: 'bg-[#FCF8F1]',
      badgeText: 'text-[#29231F]',
    },
    evening: {
      ambient: 'from-[#34241B] via-[#432F24] to-[#251A14]',
      border: 'border-[#5C4033]',
      glow: 'shadow-[0_16px_40px_rgba(185,110,66,0.32)]',
      festoonColor: '#FBBF24',
      plinthBase: '#2E2018',
      plinthEdge: '#5C4033',
      stageGlow: 'bg-amber-400/40',
      tagText: 'Candlelight Twilight',
      badgeBg: 'bg-[#483329]',
      badgeText: 'text-[#FCF8F1]',
    },
    starlit: {
      ambient: 'from-[#1E1714] via-[#2A1F1A] to-[#120D0A]',
      border: 'border-[#483329]',
      glow: 'shadow-[0_16px_40px_rgba(72,51,41,0.55)]',
      festoonColor: '#FDE68A',
      plinthBase: '#1C1512',
      plinthEdge: '#3A2920',
      stageGlow: 'bg-yellow-200/50',
      tagText: 'Starlit Evening Gala',
      badgeBg: 'bg-[#29231F]',
      badgeText: 'text-[#FCF8F1]',
    },
  }[lightingMode];

  return (
    <div className="paper-card rounded-3xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 shadow-md">
      {/* Top Editorial Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-[#E6D5C1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D98261] bg-[#D98261]/15 px-2.5 py-0.5 rounded-full border border-[#D98261]/30">
              Architectural Scale Model 1:50
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#A6A77A]" />
            <span className="text-xs font-serif italic text-[#483329]/70">Interactive 3D Venue</span>
          </div>
          <h3 className="text-base sm:text-lg font-editorial font-bold text-[#29231F] mt-1 tracking-tight truncate max-w-xs sm:max-w-md">
            {venueName}
          </h3>
        </div>

        {/* Scene Viewpoint & Lighting Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Viewpoint Presets */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] text-xs">
            <button
              type="button"
              onClick={() => setViewAngle('overview')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                viewAngle === 'overview'
                  ? 'bg-[#FCF8F1] text-[#29231F] font-bold shadow-xs border border-[#E6D5C1]'
                  : 'text-[#483329]/70 hover:text-[#29231F]'
              }`}
              title="Overview Perspective"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setViewAngle('stage')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                viewAngle === 'stage'
                  ? 'bg-[#FCF8F1] text-[#29231F] font-bold shadow-xs border border-[#E6D5C1]'
                  : 'text-[#483329]/70 hover:text-[#29231F]'
              }`}
              title="Stage Focus"
            >
              Stage
            </button>
            <button
              type="button"
              onClick={() => setViewAngle('seating')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                viewAngle === 'seating'
                  ? 'bg-[#FCF8F1] text-[#29231F] font-bold shadow-xs border border-[#E6D5C1]'
                  : 'text-[#483329]/70 hover:text-[#29231F]'
              }`}
              title="Seating Focus"
            >
              Seating
            </button>
          </div>

          {/* Lighting Mode Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
            <button
              type="button"
              onClick={() => setLightingMode('golden')}
              className={`p-1.5 rounded-lg transition-all ${
                lightingMode === 'golden'
                  ? 'bg-[#FCF8F1] text-[#D98261] shadow-xs border border-[#E6D5C1]'
                  : 'text-[#483329]/60 hover:text-[#29231F]'
              }`}
              title="Golden Hour Sun"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLightingMode('evening')}
              className={`p-1.5 rounded-lg transition-all ${
                lightingMode === 'evening'
                  ? 'bg-[#483329] text-[#FCF8F1] shadow-xs'
                  : 'text-[#483329]/60 hover:text-[#29231F]'
              }`}
              title="Candlelight Twilight"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6D5C1]" />
            </button>
            <button
              type="button"
              onClick={() => setLightingMode('starlit')}
              className={`p-1.5 rounded-lg transition-all ${
                lightingMode === 'starlit'
                  ? 'bg-[#29231F] text-amber-200 shadow-xs'
                  : 'text-[#483329]/60 hover:text-[#29231F]'
              }`}
              title="Starlit Evening Gala"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Viewport Canvas */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`w-full h-80 sm:h-92 md:h-100 rounded-2xl relative bg-gradient-to-br ${lightConfig.ambient} border ${lightConfig.border} overflow-hidden flex items-center justify-center cursor-grab select-none transition-all duration-700`}
        style={{
          perspective: '1300px',
        }}
      >
        {/* Overhead Hanging Festoon Lighting Strings */}
        <div className="absolute top-2 left-0 right-0 h-10 pointer-events-none flex justify-around px-6 opacity-85 z-20">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-[1px] h-3.5 bg-[#E6D5C1]/40" />
              <div 
                className="w-2.5 h-2.5 rounded-full shadow-sm animate-pulse"
                style={{
                  backgroundColor: lightConfig.festoonColor,
                  boxShadow: `0 0 12px ${lightConfig.festoonColor}`,
                  animationDelay: `${(i % 4) * 0.3}s`
                }}
              />
            </div>
          ))}
        </div>

        {/* Tactile 3D Symmetrical Platform */}
        <div
          className="relative preserve-3d transition-all duration-500 ease-out"
          style={{
            transform: `scale(${angleConfigs.scale}) rotateX(${angleConfigs.rotateX + tilt.x}deg) rotateZ(${angleConfigs.rotateZ + tilt.y}deg)`,
            transformStyle: 'preserve-3d',
            width: '340px',
            height: '270px',
          }}
        >
          {/* Base Travertine / Terrazzo Architectural Plinth */}
          <div 
            className="absolute inset-0 rounded-3xl border-2 transition-all duration-500"
            style={{
              backgroundColor: lightConfig.plinthBase,
              borderColor: lightConfig.plinthEdge,
              boxShadow: lightingMode === 'golden' 
                ? '0 30px 50px -10px rgba(72,51,41,0.28), inset 0 0 25px rgba(217,130,97,0.12)' 
                : '0 35px 60px -10px rgba(0,0,0,0.65), inset 0 0 30px rgba(251,191,36,0.18)',
              transform: 'translateZ(0px)',
            }}
          >
            {/* Geometric Floor Tile Engraving */}
            <div 
              className="absolute inset-3 border border-dashed border-[#D98261]/35 rounded-2xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(217,130,97,0.22) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />

            {/* Perimeter Garden Pathway Runner */}
            <div 
              className="absolute top-18 bottom-4 left-1/2 -translate-x-1/2 w-14 border-x border-[#D98261]/30 bg-[#D98261]/10 rounded-sm"
              style={{ transform: 'translateZ(2px)' }}
            />
          </div>

          {/* Miniature Sculpted Urns / Topiary Cypress at 4 Corners */}
          {[
            { top: '8px', left: '8px' },
            { top: '8px', right: '8px' },
            { bottom: '8px', left: '8px' },
            { bottom: '8px', right: '8px' },
          ].map((pos, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredObject('gardens')}
              className="absolute w-6 h-6 rounded-full bg-[#A6A77A]/30 border border-[#A6A77A] flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-10"
              style={{
                ...pos,
                transform: 'translateZ(12px)',
                boxShadow: '0 4px 8px rgba(72,51,41,0.2)',
              }}
              title="Decorative Topiary Planter"
            >
              <div className="w-3 h-3 rounded-full bg-[#A6A77A] border border-[#555635]" />
            </div>
          ))}

          {/* 1. Main Ceremonial Head Stage (Back Wall) */}
          <div
            onMouseEnter={() => setHoveredObject('stage')}
            className={`absolute top-3 left-6 right-6 h-22 rounded-2xl border-2 border-[#D98261] flex flex-col items-center justify-center p-2.5 text-center transition-all cursor-pointer ${
              hoveredObject === 'stage' ? 'scale-105 border-[#B96E42]' : ''
            }`}
            style={{
              transform: 'translateZ(28px)',
              backgroundColor: lightingMode === 'golden' ? '#FCF8F1' : '#483329',
              boxShadow: '0 14px 26px rgba(72,51,41,0.22)',
            }}
          >
            {/* Floral Arch Pergola Canopy */}
            <div className="absolute -top-3.5 w-36 h-7 rounded-full border-t-2 border-[#D98261] bg-[#FCF8F1] dark:bg-[#29231F] flex items-center justify-around px-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D98261]" title="Rose Garland" />
              <span className="w-2 h-2 rounded-full bg-[#A6A77A]" title="Olive Foliage" />
              <span className="w-2 h-2 rounded-full bg-[#E6D5C1]" title="Orchid Blossom" />
              <span className="w-2 h-2 rounded-full bg-[#D98261]" title="Rose Garland" />
            </div>

            {/* Brass Stage Candelabras */}
            <div className="absolute top-1 left-2 w-2 h-4 rounded-t-sm bg-amber-400 border border-amber-600 shadow-2xs" />
            <div className="absolute top-1 right-2 w-2 h-4 rounded-t-sm bg-amber-400 border border-amber-600 shadow-2xs" />

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D98261] mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Ceremonial Mandap & Stage
            </span>
            <p className="text-xs font-editorial font-bold text-[#29231F] dark:text-[#FCF8F1] truncate max-w-[210px]">
              {eventName}
            </p>
            <span className="text-[9px] text-[#A6A77A] font-semibold mt-0.5">
              Acoustic Rigging & Floral Canopy
            </span>
          </div>

          {/* 2. Central VIP Banquet Table (Middle) */}
          <div
            onMouseEnter={() => setHoveredObject('vip-table')}
            className={`absolute top-28 left-1/2 -translate-x-1/2 w-28 h-18 rounded-2xl border-2 border-[#D98261] flex flex-col items-center justify-center cursor-pointer transition-all ${
              hoveredObject === 'vip-table' ? 'scale-110 border-[#B96E42]' : ''
            }`}
            style={{
              transform: 'translateZ(22px)',
              backgroundColor: lightingMode === 'golden' ? '#FCF8F1' : '#483329',
              boxShadow: '0 12px 24px rgba(217,130,97,0.25)',
            }}
          >
            {/* Table Runner */}
            <div className="absolute inset-x-2 h-2 rounded-sm bg-[#D98261]/25 top-1.5" />
            {/* Centerpiece Lantern */}
            <div className="w-4 h-2 rounded-full bg-[#A6A77A] mb-0.5 shadow-xs border border-white" />
            <span className="text-[10px] font-bold text-[#D98261]">Royal Banquet</span>
            <span className="text-[8px] text-[#483329] dark:text-[#E6D5C1] font-medium">Family & Hosts (10 Seats)</span>

            {/* Miniature Surrounding Chairs (Top & Bottom) */}
            <div className="absolute -top-2 inset-x-3 flex justify-between pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 rounded-t-xs bg-[#E6D5C1] border border-[#B96E42]/50" />
              ))}
            </div>
            <div className="absolute -bottom-2 inset-x-3 flex justify-between pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 rounded-b-xs bg-[#E6D5C1] border border-[#B96E42]/50" />
              ))}
            </div>
          </div>

          {/* 3. Left Wing Round Table (Table 1) */}
          <div
            onMouseEnter={() => setHoveredObject('table-1')}
            className={`absolute bottom-6 left-6 w-20 h-20 rounded-full border-2 border-[#E6D5C1] flex flex-col items-center justify-center cursor-pointer transition-all ${
              hoveredObject === 'table-1' ? 'scale-110 border-[#D98261]' : ''
            }`}
            style={{
              transform: 'translateZ(18px)',
              backgroundColor: lightingMode === 'golden' ? '#FFFFFF' : '#3E2D23',
              boxShadow: '0 8px 18px rgba(72,51,41,0.18)',
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#D98261] border border-white shadow-xs animate-pulse" />
            <span className="text-[9px] font-bold text-[#483329] dark:text-[#E6D5C1] mt-1">Table 1</span>
            <span className="text-[8px] text-[#A6A77A] font-semibold">VIP 8 Chairs</span>

            {/* Radial Chairs around round table */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#E6D5C1] border border-[#B96E42]/40"
                style={{
                  transform: `rotate(${deg}deg) translate(14px) rotate(-${deg}deg)`,
                }}
              />
            ))}
          </div>

          {/* 4. Right Wing Round Table (Table 2) */}
          <div
            onMouseEnter={() => setHoveredObject('table-2')}
            className={`absolute bottom-6 right-6 w-20 h-20 rounded-full border-2 border-[#E6D5C1] flex flex-col items-center justify-center cursor-pointer transition-all ${
              hoveredObject === 'table-2' ? 'scale-110 border-[#D98261]' : ''
            }`}
            style={{
              transform: 'translateZ(18px)',
              backgroundColor: lightingMode === 'golden' ? '#FFFFFF' : '#3E2D23',
              boxShadow: '0 8px 18px rgba(72,51,41,0.18)',
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#A6A77A] border border-white shadow-xs" />
            <span className="text-[9px] font-bold text-[#483329] dark:text-[#E6D5C1] mt-1">Table 2</span>
            <span className="text-[8px] text-[#A6A77A] font-semibold">Friends 8 Chairs</span>

            {/* Radial Chairs around round table */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#E6D5C1] border border-[#B96E42]/40"
                style={{
                  transform: `rotate(${deg}deg) translate(14px) rotate(-${deg}deg)`,
                }}
              />
            ))}
          </div>

          {/* 5. Cocktail Bar & Champagne Terrace (Right Edge) */}
          <div
            onMouseEnter={() => setHoveredObject('bar')}
            className={`absolute top-26 right-2 w-16 h-10 rounded-xl border border-[#A6A77A] flex flex-col items-center justify-center cursor-pointer transition-all ${
              hoveredObject === 'bar' ? 'scale-110 border-[#D98261]' : ''
            }`}
            style={{
              transform: 'translateZ(16px)',
              backgroundColor: lightingMode === 'golden' ? '#F7F0E5' : '#33241C',
              boxShadow: '0 6px 14px rgba(72,51,41,0.15)',
            }}
          >
            <GlassWater className="w-3 h-3 text-[#D98261]" />
            <span className="text-[8px] font-bold text-[#483329] dark:text-[#E6D5C1]">Bar Lounge</span>
          </div>
        </div>

        {/* Live Contextual Inspection Brass Card (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-[#FCF8F1]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#E6D5C1] shadow-lg flex items-center gap-3 z-20 text-xs max-w-[280px] sm:max-w-xs transition-all">
          <div className="w-3 h-3 rounded-full bg-[#D98261] flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
          <div>
            <p className="font-bold font-editorial text-sm text-[#29231F] leading-tight">
              {hoveredObject === 'stage' 
                ? 'Ceremonial Main Stage' 
                : hoveredObject === 'vip-table'
                ? 'Central Royal Banquet'
                : hoveredObject === 'table-1' 
                ? 'Table 1 • 8 Seated' 
                : hoveredObject === 'table-2' 
                ? 'Table 2 • 8 Seated' 
                : hoveredObject === 'bar'
                ? 'Artisan Cocktail Lounge'
                : hoveredObject === 'gardens'
                ? 'Topiary Urns & Botanical Borders'
                : `${lightConfig.tagText}`}
            </p>
            <p className="text-[11px] text-[#483329]/75 leading-tight mt-0.5">
              {hoveredObject === 'stage'
                ? 'Floral canopy with terracotta accents & audio relay'
                : hoveredObject === 'vip-table'
                ? 'Reserved for bride/groom family and honorary guests'
                : hoveredObject === 'table-1'
                ? 'Assigned attendees with dietary preferences registered'
                : hoveredObject === 'table-2'
                ? 'Close friends & wedding party section'
                : hoveredObject === 'bar'
                ? 'Beverage bar with dedicated sommelier service'
                : hoveredObject === 'gardens'
                ? 'Sculpted cypress planters lining travertine walkway'
                : `Interactive 3D model • Hover elements or switch viewpoints`}
            </p>
          </div>
        </div>

        {/* Floating Capacity Pin (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <div className="px-3 py-1.5 rounded-xl bg-[#FCF8F1]/95 backdrop-blur-sm border border-[#E6D5C1] text-xs font-bold text-[#29231F] flex items-center gap-1.5 shadow-sm">
            <Users className="w-3.5 h-3.5 text-[#D98261]" />
            <span>Capacity: {totalGuests || 250} Attendees</span>
          </div>
        </div>
      </div>

      {/* Bottom Model Meta Strip */}
      <div className="mt-3.5 pt-3 border-t border-[#E6D5C1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#483329]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 text-[#D98261]" />
            <span>Tables: <strong>{tableCount}</strong> Arranged</span>
          </span>
          <span className="flex items-center gap-1.5 truncate max-w-[200px]">
            <MapPin className="w-3.5 h-3.5 text-[#A6A77A]" />
            <span className="truncate">{venueName}</span>
          </span>
        </div>

        <div className="text-[11px] font-serif italic text-[#B96E42]">
          "EventEase Warm Editorial 3D spatial studio design"
        </div>
      </div>
    </div>
  );
};
