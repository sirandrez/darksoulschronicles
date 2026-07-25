import React, { useState, useEffect, useMemo } from 'react';
import { TimelineEvent } from './types';
import { INITIAL_TIMELINE_EVENTS } from './data/initialEvents';
import { EmberParticles } from './components/EmberParticles';
import { TimelineAxis } from './components/TimelineAxis';
import { EventModal } from './components/EventModal';

export default function App() {
  const [events] = useState<TimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Sorted events
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.yearOrOrder - b.yearOrOrder);
  }, [events]);

  // Modal navigation logic
  const currentModalIndex = useMemo(() => {
    if (!selectedEvent) return -1;
    return sortedEvents.findIndex((e) => e.id === selectedEvent.id);
  }, [selectedEvent, sortedEvents]);

  const handleNavigateModal = (direction: 'prev' | 'next') => {
    if (currentModalIndex === -1) return;
    const targetIdx = direction === 'prev' ? currentModalIndex - 1 : currentModalIndex + 1;
    if (targetIdx >= 0 && targetIdx < sortedEvents.length) {
      setSelectedEvent(sortedEvents[targetIdx]);
    }
  };

  // Keyboard Navigation & Esc listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
      } else if (selectedEvent) {
        if (e.key === 'ArrowLeft') {
          handleNavigateModal('prev');
        } else if (e.key === 'ArrowRight') {
          handleNavigateModal('next');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent, currentModalIndex, sortedEvents]);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#c2bda8] relative flex flex-col justify-between font-optimus selection:bg-[#c88828]/30 selection:text-[#f3e3a9]">
      {/* Background Ember Particles Canvas */}
      <EmberParticles />

      {/* HEADER SECTION - Centered Title & Subtitle */}
      <header className="relative z-20 border-b border-[#1a1916] bg-[#07080a]/90 backdrop-blur-md pt-8 pb-6 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
          <h1 className="font-optimus text-2xl sm:text-4xl font-bold tracking-widest text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]">
            darksoulsChronicle
          </h1>
          <p className="font-optimus text-xs sm:text-sm text-[#a39c89] tracking-wider mt-2">
            O Ciclo do Fogo e das Sombras
          </p>
        </div>
      </header>

      {/* MAIN TIMELINE MURAL STAGE */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-8 md:py-16 overflow-hidden">
        <TimelineAxis
          events={sortedEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </main>

      {/* FOOTER SECTION - Single Sentence Only */}
      <footer className="relative z-20 border-t border-[#181714] bg-[#060608]/95 py-6 px-4 text-center">
        <p className="font-optimus text-sm sm:text-base text-[#d2c8b0] tracking-wider">
          Be Safe, Friend. Don’t You Dare Go Hollow.
        </p>
      </footer>

      {/* MODAL - Event Lore Details */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onNavigate={handleNavigateModal}
        hasPrev={currentModalIndex > 0}
        hasNext={currentModalIndex >= 0 && currentModalIndex < sortedEvents.length - 1}
      />
    </div>
  );
}
