import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, TimelineEvent } from '../types';
import { getErasConfig } from '../data/initialEvents';
import { ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';

interface TimelineAxisProps {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
  onSelectEvent: (event: TimelineEvent) => void;
  language: Language;
}

export const TimelineAxis: React.FC<TimelineAxisProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  language,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const erasConfig = getErasConfig(language);

  // Always display all events chronologically sorted
  const sortedEvents = [...events].sort((a, b) => a.yearOrOrder - b.yearOrOrder);

  // Scroll to selected event when changed externally
  useEffect(() => {
    if (selectedEvent && containerRef.current) {
      const el = document.getElementById(`event-node-${selectedEvent.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedEvent]);

  // Handle Dragging / Panning on horizontal timeline
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScrollBy = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const amount = direction === 'left' ? -400 : 400;
    containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="w-full relative flex flex-col items-center select-none py-6 sm:py-12">
      {/* HORIZONTAL TIMELINE VIEW */}
      <div className="w-full relative my-2 md:my-6 py-4 px-2 sm:px-6">
        {/* Scroll Control Arrows */}
        <button
          onClick={() => handleScrollBy('left')}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#121318]/90 border border-[#3a352a] text-[#c2bda8] hover:text-[#f3e3a9] hover:border-[#c88828] hover:bg-[#201c13] transition-all shadow-xl backdrop-blur"
          aria-label={language === 'pt' ? 'Rolar para a esquerda' : 'Scroll left'}
          title={language === 'pt' ? 'Rolar para a esquerda' : 'Scroll left'}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => handleScrollBy('right')}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#121318]/90 border border-[#3a352a] text-[#c2bda8] hover:text-[#f3e3a9] hover:border-[#c88828] hover:bg-[#201c13] transition-all shadow-xl backdrop-blur"
          aria-label={language === 'pt' ? 'Rolar para a direita' : 'Scroll right'}
          title={language === 'pt' ? 'Rolar para a direita' : 'Scroll right'}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Drag scrollable container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`w-full overflow-x-auto py-32 sm:py-40 px-6 sm:px-12 no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth relative ${
            isDragging ? 'scroll-auto' : ''
          }`}
        >
          {/* Wrapper spanning full content width so the line reaches all points */}
          <div className="relative inline-flex items-center min-w-full py-12 px-20 sm:px-32">
            {/* The Main Horizontal Axis Line spanning across all points */}
            <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c88828] to-transparent -translate-y-1/2 z-0 shadow-[0_0_12px_rgba(200,136,40,0.6)]">
              <div className="w-full h-full bg-gradient-to-r from-[#201a10] via-[#f5d08b] to-[#201a10] opacity-80 animate-slow-glow" />
            </div>

            {/* Timeline Nodes Container */}
            <div className="flex items-center gap-64 sm:gap-80 md:gap-96 min-w-max relative z-10">
            {sortedEvents.map((evt, index) => {
              const isSelected = selectedEvent?.id === evt.id;
              const isHovered = hoveredEvent?.id === evt.id;
              const isMajor = evt.importance === 'pivotal' || evt.importance === 'major';
              const eraInfo = erasConfig[evt.era] || erasConfig['era_antiga'];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={evt.id}
                  id={`event-node-${evt.id}`}
                  className="relative flex items-center justify-center group cursor-pointer w-8 h-8"
                  onClick={() => onSelectEvent(evt)}
                  onMouseEnter={() => setHoveredEvent(evt)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Era Tag Indicator above/below */}
                  <div
                    className={`absolute whitespace-nowrap text-[10px] font-optimus tracking-widest uppercase transition-all duration-300 left-1/2 -translate-x-1/2 pointer-events-none ${
                      isEven ? '-top-12' : 'top-12'
                    } ${
                      isSelected || isHovered ? 'text-[#f5d08b] scale-105' : 'text-[#7e786b]'
                    }`}
                  >
                    <span className="flex items-center gap-1 bg-[#0c0d12]/95 px-2.5 py-1 rounded border border-[#23211a] shadow-md">
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ backgroundColor: eraInfo.themeColor }}
                      />
                      {evt.eraLabel}
                    </span>
                  </div>

                  {/* Timeline Node Point (The Glowing Bonfire / Darksign Ember) */}
                  <motion.div
                    whileHover={{ scale: 1.35 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative z-20 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isMajor ? 'w-8 h-8' : 'w-6 h-6'
                    }`}
                  >
                    {/* Outer Glowing Ring */}
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#c88828]/30 animate-ping ring-2 ring-[#e8942b]'
                          : isHovered
                          ? 'bg-[#c88828]/20 ring-1 ring-[#c88828]'
                          : 'bg-[#181613]'
                      }`}
                      style={{
                        boxShadow: isSelected || isHovered ? `0 0 16px ${eraInfo.glowColor}` : 'none',
                      }}
                    />

                    {/* Inner Ember Flame Dot */}
                    <div
                      className={`w-full h-full rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-tr from-[#9c3d12] via-[#e8942b] to-[#fce4a6] border-[#fff0c2] scale-110 shadow-[0_0_20px_rgba(240,150,50,0.9)]'
                          : isHovered
                          ? 'bg-[#e8942b] border-[#fce4a6] shadow-[0_0_12px_rgba(220,130,40,0.7)]'
                          : 'bg-[#1e1c18] border-[#4a4234] hover:border-[#c88828]'
                      }`}
                    >
                      {isMajor && (
                        <Sparkles
                          className={`w-3 h-3 ${
                            isSelected ? 'text-[#08080a] animate-pulse' : 'text-[#c88828]'
                          }`}
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Title Banner (Well spaced, centered, wrapping cleanly without overlapping neighboring points) */}
                  <div
                    className={`absolute text-center flex flex-col items-center justify-center transition-all duration-300 w-56 sm:w-64 max-w-[260px] left-1/2 -translate-x-1/2 pointer-events-none ${
                      isEven ? 'top-12' : 'bottom-12'
                    }`}
                  >
                    <h4
                      className={`font-optimus text-xs sm:text-sm font-semibold tracking-wide transition-colors whitespace-normal break-words leading-tight px-1 ${
                        isSelected
                          ? 'text-[#f5e4bc] drop-shadow-[0_0_8px_rgba(200,136,40,0.6)] font-bold'
                          : isHovered
                          ? 'text-[#dfcb9a]'
                          : 'text-[#a39c89]'
                      }`}
                    >
                      {evt.title}
                    </h4>
                    <p className="text-[10px] text-[#706b5f] font-cormorant italic truncate mt-1">
                      {evt.timePeriodDisplay}
                    </p>
                  </div>

                  {/* Hover Tooltip Card */}
                  <AnimatePresence>
                    {isHovered && !isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: isEven ? 10 : -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`absolute z-40 w-64 p-3.5 rounded bg-[#0f1015]/95 border border-[#3d372e] shadow-[0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-md pointer-events-none left-1/2 -translate-x-1/2 ${
                          isEven ? 'top-28' : 'bottom-28'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#c88828] font-optimus mb-1">
                          <span>{evt.eraLabel}</span>
                          <span className="font-mono">{evt.timePeriodDisplay}</span>
                        </div>
                        <h5 className="font-optimus text-sm text-[#f3e3a9] font-bold mb-1">
                          {evt.title}
                        </h5>
                        <p className="font-cormorant text-xs text-[#b0a996] line-clamp-2 leading-relaxed">
                          {evt.shortDescription}
                        </p>
                        {evt.location && (
                          <div className="mt-2 text-[10px] text-[#807a6d] flex items-center gap-1 border-t border-[#1f1e1a] pt-1.5">
                            <MapPin className="w-3 h-3 text-[#c88828]" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
