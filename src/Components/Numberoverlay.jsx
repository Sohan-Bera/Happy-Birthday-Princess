import React, { useEffect } from 'react';

export default function NumberOverlay({ active, digit }) {
  useEffect(() => {
    if (!active) return;

    // Web Audio API for the sound effect
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();

      const playThud = (freq, time, duration, gainVal) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + time + duration);

        gain.gain.setValueAtTime(gainVal, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + duration);
      };

      // "TA" - Initial reveal sound
      playThud(100, 0, 0.25, 0.6);

      // "DUM" - Cinematic bass drop on zoom
      playThud(55, 1.5, 1.3, 1.3);
    } catch (e) {
      console.log('Audio playback prevented', e);
    }
  }, [active]);

  if (!active) return null;

  const leftDigit = digit[0] || "2";
  const rightDigit = digit[1] || "0";

  return (
    <div className="netflix-zoom-overlay">
      {/* Warm Ambient Lens Flare */}
      <div className="netflix-lens-flare" />

      {/* 3D Zooming Digits */}
      <div className="netflix-digit-container perspective-2000">
        <div className="netflix-digit digit-left">{leftDigit}</div>
        <div className="netflix-digit digit-right">{rightDigit}</div>
      </div>
    </div>
  );
}