import React, { useState, useEffect, useMemo } from 'react';
import { Language, TimelineEvent } from './types';
import { getTimelineEvents } from './data/initialEvents';
import { EmberParticles } from './components/EmberParticles';
import { TimelineAxis } from './components/TimelineAxis';
import { EventModal } from './components/EventModal';
import { Instagram, Globe } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('pt');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Get localized events based on selected language
  const events = useMemo(() => {
    return getTimelineEvents(language);
  }, [language]);

  // Sorted events chronologically
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.yearOrOrder - b.yearOrOrder);
  }, [events]);

  // Selected event object derived from ID
  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return sortedEvents.find((e) => e.id === selectedEventId) || null;
  }, [selectedEventId, sortedEvents]);

  // Modal navigation index
  const currentModalIndex = useMemo(() => {
    if (!selectedEventId) return -1;
    return sortedEvents.findIndex((e) => e.id === selectedEventId);
  }, [selectedEventId, sortedEvents]);

  const handleNavigateModal = (direction: 'prev' | 'next') => {
    if (currentModalIndex === -1) return;
    const targetIdx = direction === 'prev' ? currentModalIndex - 1 : currentModalIndex + 1;
    if (targetIdx >= 0 && targetIdx < sortedEvents.length) {
      setSelectedEventId(sortedEvents[targetIdx].id);
    }
  };

  // Keyboard Navigation & Esc listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEventId(null);
      } else if (selectedEventId) {
        if (e.key === 'ArrowLeft') {
          handleNavigateModal('prev');
        } else if (e.key === 'ArrowRight') {
          handleNavigateModal('next');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEventId, currentModalIndex, sortedEvents]);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#c2bda8] relative flex flex-col justify-between font-optimus selection:bg-[#c88828]/30 selection:text-[#f3e3a9]">
      {/* Background Ember Particles Canvas */}
      <EmberParticles />

      {/* HEADER SECTION - Instagram Button (Left), Title (Center), Language Toggle (Right) */}
      <header className="relative z-20 border-b border-[#1a1916] bg-[#07080a]/90 backdrop-blur-md py-3 sm:py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          
          {/* Left Side: Instagram Button ("UM ORGANIZADOR FURTIVO") */}
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
            <a
              href="https://www.instagram.com/sirandrez"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded bg-[#0f1015]/90 border border-[#3d3422] text-[#c88828] hover:text-[#f3e3a9] hover:border-[#c88828] hover:bg-[#1a1812] transition-all duration-300 shadow-sm backdrop-blur"
              title="Instagram sirandrez"
            >
              <Instagram className="w-3.5 h-3.5 text-[#c88828] group-hover:scale-110 transition-transform duration-300" />
              <span className="font-optimus text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                {language === 'pt' ? 'UM ORGANIZADOR FURTIVO' : 'A FURTIVE ORGANIZER'}
              </span>
            </a>
          </div>

          {/* Center: Main Title & Subtitle */}
          <div className="text-center">
            <h1 className="font-optimus text-2xl sm:text-3xl lg:text-4xl font-bold tracking-widest text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]">
              darksoulsChronicle
            </h1>
            <p className="font-optimus text-xs sm:text-sm text-[#a39c89] tracking-wider mt-1">
              {language === 'pt'
                ? 'O Ciclo do Fogo e das Sombras'
                : 'The Cycle of Fire and Dark'}
            </p>
          </div>

          {/* Right Side: Language Option Toggle (PT / EN) */}
          <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
            <div className="flex items-center p-0.5 rounded bg-[#0e0f14] border border-[#2b271f] shadow-inner">
              <span className="text-[#605a4e] px-1.5 hidden sm:inline-flex items-center text-xs" title="Idioma / Language">
                <Globe className="w-3 h-3" />
              </span>
              <button
                onClick={() => setLanguage('pt')}
                title="Português"
                className={`px-2 py-0.5 text-[10px] sm:text-xs font-optimus font-bold tracking-wider rounded transition-all duration-200 ${
                  language === 'pt'
                    ? 'bg-[#c88828] text-[#08080a] shadow-[0_0_8px_rgba(200,136,40,0.5)]'
                    : 'text-[#8a8475] hover:text-[#d4cebd]'
                }`}
              >
                PT
              </button>
              <button
                onClick={() => setLanguage('en')}
                title="English"
                className={`px-2 py-0.5 text-[10px] sm:text-xs font-optimus font-bold tracking-wider rounded transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-[#c88828] text-[#08080a] shadow-[0_0_8px_rgba(200,136,40,0.5)]'
                    : 'text-[#8a8475] hover:text-[#d4cebd]'
                }`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN TIMELINE MURAL STAGE */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 md:py-12 overflow-hidden">
        <TimelineAxis
          events={sortedEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={(evt) => setSelectedEventId(evt.id)}
          language={language}
        />
      </main>

      {/* FOOTER SECTION */}
      <footer className="relative z-20 border-t border-[#181714] bg-[#060608]/95 py-6 px-4 text-center">
        <p className="font-optimus text-sm sm:text-base text-[#d2c8b0] tracking-wider">
          {language === 'pt'
            ? 'Proteja-se, amigo. Não ouse se tornar Hollow.'
            : 'Be Safe, Friend. Don’t You Dare Go Hollow.'}
        </p>
      </footer>

      {/* MODAL - Event Lore Details */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEventId(null)}
        onNavigate={handleNavigateModal}
        hasPrev={currentModalIndex > 0}
        hasNext={currentModalIndex >= 0 && currentModalIndex < sortedEvents.length - 1}
        language={language}
      />
    </div>
  );
}
