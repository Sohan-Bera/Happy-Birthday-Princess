import React, { useState, useRef } from 'react';

const MEMORIES = [
  {
    id: 1,
    title: "Happy Birthday Sweety",

    desc: "Wishing a fantastic birthday to the most fantastic person. Also who brings so much positive energy to everyone around her. May this next year be full with great adventure and full of joy.",
    image: "Birthday Cake.png",
  },
  {
    id: 2,
    title: "Wishes Comes True",

    desc: "May all you wishlisted iteam and dreams fulfilled and comes true. Just stay positive and never loose hope. Just trust the process.",
    image: "Wishlist image.jpg",
  },
  {
    id: 3,
    title: "Gentle Heart Sweetest Smile",
  
    desc: "You carry a soft, effortless warmth wherever you go, but nothing lights up the world quite like your smile. Your gentle heart brings comfort to everyone around you, and your laughter is pure magic. Keep smiling, sweet soul—your joy is the most beautiful thing in this world.",
    image: "Plumeria Card.png",
  },
  {
    id: 4,
    title: "Beauty Overloaded",
  
    desc: "In a world of quiet shadows, your radiance shines with an intensity that leaves me utterly captivated. Every glance at you turns my world upside down and my heart into a rushing storm of adoration.",
    image: "My Flowers.jpeg",
  },
  {
    id: 5,
    title: "Forever Your Biggest Admirer",

    desc: "From every gentle laugh to every dream you chase, you never fail to amaze me. Celebrating twenty years of your magic is special, but loving you through it all is my greatest joy. Forever in your corner, forever your biggest admirer.",
    image: "Last card.jpg",
  }
];

export default function StoryBook() {
  const [cards, setCards] = useState(MEMORIES);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDirection, setAnimDirection] = useState('next');
  const [letterState, setLetterState] = useState('sealed'); // 'sealed' | 'unsealing' | 'opened'

  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleOpenLetter = () => {
    if (letterState !== 'sealed') return;
    setLetterState('unsealing');

    setTimeout(() => {
      setLetterState('opened');
    }, 1100);
  };
  const nextCard = () => {
    if (isAnimating || cards.length <= 1) return;
    setAnimDirection('next');
    setIsAnimating(true);

    setTimeout(() => {
      setCards((prev) => {
        const updated = [...prev];
        const shifted = updated.shift();
        if (shifted) updated.push(shifted);
        return updated;
      });
      setIsAnimating(false);
    }, 450);
  };

  const prevCard = () => {
    if (isAnimating || cards.length <= 1) return;
    setAnimDirection('prev');
    setIsAnimating(true);

    setCards((prev) => {
      const updated = [...prev];
      const popped = updated.pop();
      if (popped) return [popped, ...updated];
      return updated;
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  };

  const handleStart = (clientX) => {
    if (isAnimating || letterState !== 'opened') return;
    startX.current = clientX;
    isDragging.current = true;
  };

  const handleEnd = (clientX) => {
    if (!isDragging.current || isAnimating || letterState !== 'opened') return;
    isDragging.current = false;

    const diffX = startX.current - clientX;
    if (diffX > 40) nextCard();
    else if (diffX < -40) prevCard();
    else if (Math.abs(diffX) < 10) nextCard();
  };

  return (
    <section id="story" className="storybook-section">
      <div className="storybook-header">
        <h2 className="storybook-title">Moments Frozen in Time</h2>
      </div>

      {letterState !== 'opened' ? (
        <div className="envelope-wrapper" onClick={handleOpenLetter}>
          <div className={`clean-envelope ${letterState === 'unsealing' ? 'unsealing' : ''}`}>
            
            {/* Envelope Interior Backing */}
            <div className="envelope-interior" />

            {/* Letter Inside */}
            <div className="letter-paper">
              <h4 className="letter-heading">For My Love</h4>
            </div>

            {/* Left & Right Side Pocket Folds */}
            <div className="fold-left" />
            <div className="fold-right" />

            {/* Bottom Pocket Fold */}
            <div className="fold-bottom" />

            {/* Top Folding Flap */}
            <div className="fold-top" />

            {/* Wax Seal */}
            <div className="wax-seal">
              <span className="seal-text">UNSEAL</span>
            </div>

          </div>
          <p className="tap-hint">Tap the seal to open your letter. After finished<br />reading you can scroll to see your delution.</p>
        </div>
      ) : (
        <div className="revealed-storybook-container">
          <div
            className="deck-container"
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseUp={(e) => handleEnd(e.clientX)}
          >
            {cards.map((card, index) => {
              const isTop = index === 0;
              const isNext = index === 1;
              const isThird = index === 2;

              let cardClass = "memory-card";
              if (isTop && isAnimating && animDirection === 'next') {
                cardClass += " slide-out";
              } else if (isTop) {
                cardClass += " card-top";
              } else if (isNext) {
                cardClass += " card-behind-1";
              } else if (isThird) {
                cardClass += " card-behind-2";
              } else {
                cardClass += " card-hidden";
              }

              return (
                <div key={card.id} className={cardClass}>
                  <div className="card-photo-wrapper">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="card-photo"
                      draggable="false"
                    />
                    <span className="card-tag">{card.tag}</span>
                  </div>
                  <div className="card-content">
                    <span className="card-date">{card.date}</span>
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-desc">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="deck-controls-clean">
            <button onClick={prevCard} className="nav-link-btn" disabled={isAnimating}>
              PREVIOUS
            </button>

            <div className="deck-counter">
              <span className="counter-current">
                {String(cards[0]?.id || 1).padStart(2, '0')}
              </span>
              <span className="counter-divider">/</span>
              <span className="counter-total">
                {String(MEMORIES.length).padStart(2, '0')}
              </span>
            </div>

            <button onClick={nextCard} className="nav-link-btn nav-link-primary" disabled={isAnimating}>
              NEXT
            </button>
          </div>
        </div>
      )}
    </section>
  );
}