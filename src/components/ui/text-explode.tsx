'use client';

import { useCallback, useEffect, useRef } from 'react';
import { m, useAnimationControls, Variants } from 'framer-motion';

import { cn } from '@/lib/utils';

const containerVariants: Variants = {
  initial: {
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 0.5,
    },
    letterSpacing: '0px',
  },
  shrink: {
    // Scale might need to be adjust according to font size for better effect
    scale: 0.8,
    letterSpacing: '-10%',
  },
  jitter: {
    x: [0, -3, 3, -3, 3, 0],
    y: [0, -2, 2, -2, 2, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: 'easeInOut',
    },
  },
  explode: {
    scale: [0.7, 0.9, 1],
    opacity: [1, 0.7, 0],
    letterSpacing: '0px',
    transition: {
      times: [0, 0.9, 1],
    },
  },
  end: {
    scale: 1,
    letterSpacing: '0px',
    translateY: 50,
  },
};

const createExplosion = ({
  index,
  total,
}: {
  index: number;
  total: number;
}) => {
  const direction = Math.random() > Math.random() ? -1 : 1;

  // Increased horizontal spread
  const x = Math.random() * 15 * total * direction;

  // Increased vertical bias and radius for a more "earned" burst
  const radius = total * 10;
  const angleRange = Math.PI;
  const angle = (index / (total - 1)) * angleRange;
  // Bias significantly upward (-Math.sin) with more force
  const y = radius * -Math.sin(angle) * (1 + Math.random() * 2);

  const rotation = Math.random() * 720 * direction; // More rotation

  return {
    translateX: [0, x * 0.6, x * 0.9, x],
    translateY: [0, y, y * 1.1, y * 0.8, y * 0.5], // Aggressive upward arc
    rotate: [0, rotation * 0.5, rotation * 0.9, rotation],
    scale: [1, 1.4, 2 + Math.random(), 2.5 + Math.random() * 2],
    opacity: [1, 0.9, 0.4, 0],
  };
};

const characterVariants: Variants = {
  jitter: () => ({
    x: [0, -3 + Math.random() * 6, 3 - Math.random() * 6, 0],
    y: [0, -2 + Math.random() * 4, 2 - Math.random() * 4, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.33, 0.66, 1],
      ease: 'easeInOut',
    },
  }),
  shrink: {
    scale: 1.1,
  },
  explode: createExplosion,
  end: {
    translateY: 0,
    translateX: 0,
    rotate: 0,
    scale: 1,
  },
  initial: {
    opacity: 1,
  },
};

const splitText = (text: string) => String(text).split(/(?:)/u);

export default function TextExplode({
  text,
  mode = 'loop',
  className,
  trigger = false,
  onComplete,
}: {
  text: string;
  className?: string;
  mode?: 'loop' | 'hover' | 'manual';
  trigger?: boolean;
  onComplete?: () => void;
}) {
  const characters = splitText(text);
  const controls = useAnimationControls();
  const isPlaying = useRef(false);

  const animateSequence = useCallback(async () => {
    await controls.start('shrink', {
      duration: 0.8,
      ease: 'easeOut',
    });
    // Removed jitter for a cleaner feel
    await controls.start('explode', {
      duration: 0.6,
      ease: 'easeOut',
    });
    await controls.start('end');
    await controls.start('initial', {
      delay: 0.2,
      duration: 0.6,
      ease: 'easeOut',
    });

    if (mode === 'loop') {
      // eslint-disable-next-line react-hooks/immutability
      requestAnimationFrame(() => animateSequence());
    } else {
      isPlaying.current = false;
      onComplete?.();
    }
  }, [mode, controls, onComplete]);

  useEffect(() => {
    if (!characters.length || mode === 'hover' || mode === 'manual') {
      return;
    }

    animateSequence();
  }, [characters.length, mode, animateSequence]);

  useEffect(() => {
    if (mode === 'manual' && trigger && !isPlaying.current) {
      isPlaying.current = true;
      animateSequence();
    }
  }, [trigger, mode, animateSequence]);

  return (
    <m.div
      variants={containerVariants}
      animate={controls}
      onPointerDown={() => {
        if (mode === 'hover' && !isPlaying.current) {
          isPlaying.current = true;
          animateSequence();
        }
      }}
      onMouseEnter={() => {
        if (mode === 'hover' && !isPlaying.current) {
          isPlaying.current = true;
          animateSequence();
        }
      }}
      className={cn(
        'flex items-center justify-center text-3xl tracking-normal text-foreground',
        className,
      )}
    >
      {characters.map((char, index) => (
        <m.span
          key={index}
          variants={characterVariants}
          custom={{ index, total: characters.length }}
          className="inline-block whitespace-pre"
        >
          {char === ' ' ? '\u00A0' : char}
        </m.span>
      ))}
      <span className="sr-only">{text}</span>
    </m.div>
  );
}
