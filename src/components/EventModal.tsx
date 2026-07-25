import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineEvent } from '../types';
import { ERAS_CONFIG } from '../data/initialEvents';
import { X, MapPin, Users, Quote, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

interface EventModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onNavigate,
  hasPrev,
  hasNext,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  if (!event) return null;

  const eraInfo = ERAS_CONFIG[event.era];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded bg-[#0b0c10] border border-[#3d372e] shadow-[0_0_50px_rgba(0,0,0,0.95)] z-10 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#23211b] bg-[#12131a]/90">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: eraInfo?.themeColor || '#c88828' }}
              />
              <span className="font-cinzel text-xs sm:text-sm text-[#c88828] tracking-widest uppercase">
                {event.eraLabel}
              </span>
              <span className="text-[#4a4539]">•</span>
              <span className="font-mono text-xs text-[#8e887a]">{event.timePeriodDisplay}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded text-[#a39e8f] hover:text-[#f3e3a9] hover:bg-[#201d16] transition"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 custom-scrollbar">
            {/* Title & Subtitle */}
            <div>
              <div className="flex items-center gap-2 text-xs font-cinzel text-[#8e8777] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#c88828]" />
                <span>{eraInfo?.gameTitle}</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f3e3a9] tracking-wide leading-tight">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="font-cormorant italic text-base sm:text-lg text-[#b8ad95] mt-1">
                  {event.subtitle}
                </p>
              )}
            </div>

            {/* Image Banner Display (if available) */}
            {event.imageUrl && (
              <div className="relative group overflow-hidden rounded border border-[#2a2720] bg-[#050507]">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full max-h-96 object-cover transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-80" />
                
                {/* Lightbox Trigger */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-3 right-3 p-2 rounded bg-[#0b0c10]/80 border border-[#4a4234] text-[#d8d0bd] hover:text-[#f3e3a9] hover:border-[#c88828] transition backdrop-blur text-xs flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Ampliar Imagem</span>
                </button>

                {event.imageCaption && (
                  <p className="absolute bottom-3 left-3 right-16 text-xs font-cormorant italic text-[#d2c9b2] drop-shadow-md">
                    {event.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Quote Block (Epitaph style) */}
            {event.quote && (
              <blockquote className="relative p-4 sm:p-5 rounded bg-[#13141c]/80 border-l-2 border-[#c88828] italic font-cormorant text-base sm:text-lg text-[#dfd5be] space-y-2">
                <Quote className="w-6 h-6 text-[#c88828]/30 absolute top-3 right-3" />
                <p className="relative z-10 leading-relaxed">"{event.quote}"</p>
                {event.quoteAuthor && (
                  <footer className="text-right text-xs font-cinzel tracking-widest text-[#a89d87] not-italic">
                    — {event.quoteAuthor}
                  </footer>
                )}
              </blockquote>
            )}

            {/* Full Lore Text */}
            <div className="space-y-3 border-t border-[#1f1d18] pt-5">
              <h3 className="font-cinzel text-xs text-[#8e8777] tracking-widest uppercase">
                Crônica de História
              </h3>
              <p className="font-cormorant text-base sm:text-lg text-[#d0c8b4] leading-relaxed whitespace-pre-line">
                {event.fullLore}
              </p>
            </div>

            {/* Event Metadata Cards (Location, Characters, Tags) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#1f1d18] pt-5">
              {event.location && (
                <div className="p-3.5 rounded bg-[#101117] border border-[#23211b] flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#c88828] mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[10px] font-cinzel text-[#8e8777] uppercase tracking-wider">
                      Localização Principal
                    </span>
                    <span className="font-cormorant text-sm text-[#f0e6cf]">
                      {event.location}
                    </span>
                  </div>
                </div>
              )}

              {event.characters && event.characters.length > 0 && (
                <div className="p-3.5 rounded bg-[#101117] border border-[#23211b] flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#c88828] mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[10px] font-cinzel text-[#8e8777] uppercase tracking-wider">
                      Personagens e Figuras Chave
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {event.characters.map((char, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#191a24] text-[11px] font-cormorant text-[#d8cfba] border border-[#2d2a23]"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar Navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#23211b] bg-[#12131a]/90">
            <button
              onClick={() => onNavigate('prev')}
              disabled={!hasPrev}
              className={`px-3 py-1.5 rounded border font-cinzel text-xs flex items-center gap-1.5 transition ${
                hasPrev
                  ? 'bg-[#181922] border-[#383329] text-[#c2bda8] hover:text-[#f3e3a9] hover:border-[#c88828]'
                  : 'opacity-40 cursor-not-allowed border-transparent text-[#5c584e]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-cinzel text-[#706b5f]">darksoulsChronicle</span>

            <button
              onClick={() => onNavigate('next')}
              disabled={!hasNext}
              className={`px-3 py-1.5 rounded border font-cinzel text-xs flex items-center gap-1.5 transition ${
                hasNext
                  ? 'bg-[#181922] border-[#383329] text-[#c2bda8] hover:text-[#f3e3a9] hover:border-[#c88828]'
                  : 'opacity-40 cursor-not-allowed border-transparent text-[#5c584e]'
              }`}
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Lightbox Modal for Image */}
        {isLightboxOpen && event.imageUrl && (
          <div
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded bg-[#181922] text-[#f3e3a9] hover:bg-[#282936]"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={event.imageUrl}
              alt={event.title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[90vh] object-contain rounded border border-[#3d372e]"
            />
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
