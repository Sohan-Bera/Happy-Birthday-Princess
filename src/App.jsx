import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import MatrixOverlay from './Components/MatrixOverlay';
import NumberOverlay from './Components/Numberoverlay';
import StoryBook from './Components/Storybook';

export default function App() {
  const [introStage, setIntroStage] = useState('matrix');
  const audioRef = useRef(null);

  const handleMatrixComplete = () => {
    setIntroStage('zoom');

    setTimeout(() => {
      setIntroStage('hero');
    }, 2800);
  };

  useEffect(() => {
    if (introStage === 'hero' && audioRef.current) {
      audioRef.current.volume = 1.0;
      
      const playAudio = () => {
        audioRef.current?.play().then(() => {
          window.removeEventListener('click', playAudio);
          window.removeEventListener('touchstart', playAudio);
        }).catch((err) => {
          console.log("Waiting for user interaction to play audio:", err);
        });
      };

      playAudio();

      // Fallback: Starts music on first click/tap anywhere on the screen if browser blocks autoplay
      window.addEventListener('click', playAudio);
      window.addEventListener('touchstart', playAudio);

      return () => {
        window.removeEventListener('click', playAudio);
        window.removeEventListener('touchstart', playAudio);
      };
    }
  }, [introStage]);

  const scrollToStory = () => {
    const section = document.getElementById('story');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Dynamic Base URL ensures correct path on GitHub Pages */}
      <audio 
        ref={audioRef} 
        src={`${import.meta.env.BASE_URL}nimbus-roger-gabalda-main.mp3`} 
        loop 
        preload="auto" 
      />

      {introStage === 'matrix' && (
        <MatrixOverlay oldAge="19" newAge="20" onComplete={handleMatrixComplete} />
      )}

      {introStage === 'zoom' && (
        <NumberOverlay active={true} digit="20" />
      )}

      <div className={`main-content ${introStage === 'hero' ? 'visible' : 'hidden'}`}>
        <div className="bg-gradient-sky" />
        <div className="bg-stars" />

        <section 
          className="hero-section"
          style={{ '--hero-bg': `url(${import.meta.env.BASE_URL}Landing-Page-rose.png)` }}
        >
          <div>
            <h1 className="hero-title">
              Happy Birthday
              <span className="hero-title-sub">Sanyukta💖</span>
            </h1>
            <p className="hero-desc">
              Amidst the quiet chaos of the world, your presence is my peace and your voice is my home. 
              I'm happy to get a person like you.<br />All happyness belongs to you.<br /> Happy 20th birthday, my love.
            </p>
            <button onClick={scrollToStory} className="btn-primary">
              EXPLORE NEXT
            </button>
          </div>
        </section>

        <StoryBook />

        <section 
          className="footer-section"
          style={{ '--footer-bg': `url(${import.meta.env.BASE_URL}Aurora-Footer.png)` }}
        >
          <h6 className="footer-title">
            Always stay happy & keep smiling my princess.
          </h6>
          <div className="animate-heart">❤️</div>
          <div classNamme="footer-copyright">
            © {new Date().getFullYear()}Birthday 20. Designed and developed by Sohan for Sanyukta. All Rights Reserved.
          </div>
        </section>
      </div>
    </div>
  );
}