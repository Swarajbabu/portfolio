import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ front, back, className }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn("perspective-1000 w-full cursor-pointer group", className)}
      onClick={handleFlip}
    >
      <div 
        className={cn(
          "relative w-full transition-transform duration-700 preserve-3d h-full min-h-[450px]",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden h-full w-full">
          {front}
          {/* Flip Indicator */}
          <div className="absolute bottom-4 right-4 bg-neo-cream neo-border-thin p-2 neo-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-10">
            <span>Flip</span>
            <RefreshCcw className="h-3 w-3" />
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 h-full w-full">
          {back}
          {/* Flip Back Indicator */}
          <div className="absolute bottom-4 right-4 bg-neo-cream neo-border-thin p-2 neo-shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-10">
            <span>Back</span>
            <RefreshCcw className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
