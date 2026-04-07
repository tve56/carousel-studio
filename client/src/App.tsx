import React, { useState, useRef } from 'react';
import './App.css';

interface SlideData {
  title: string;
  subtitle: string;
}

const App: React.FC = () => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([
    { title: 'ЗАГОЛОВОК СЛАЙДА', subtitle: 'Ваш подзаголовок или описание здесь' }
  ]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBgImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateSlide = (index: number, field: keyof SlideData, value: string) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const addSlide = () => {
    setSlides([...slides, { title: 'НОВЫЙ СЛАЙД', subtitle: 'Текст слайда' }]);
  };

  const removeSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const drawSlide = (ctx: CanvasRenderingContext2D, slide: SlideData, img: HTMLImageElement) => {
    // Рисуем фон
    ctx.drawImage(img, 0, 0, 1080, 1350);

    // Настройки заголовка (Cinzel)
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = 'bold 80px Cinzel';
    
    const titleLines = wrapText(ctx, slide.title.toUpperCase(), 900);
    titleLines.forEach((line, i) => {
      ctx.fillText(line, 540, 500 + (i * 100));
    });

    // Настройки подзаголовка (Montserrat)
    ctx.font = '400 40px Montserrat';
    const subStartTop = 550 + (titleLines.length * 100);
    const subtitleLines = wrapText(ctx, slide.subtitle, 800);
    
    subtitleLines.forEach((line, i) => {
      ctx.fillText(line, 540, subStartTop + (i * 60));
    });
  };

  const downloadSlides = async () => {
    if (!canvasRef.current || !bgImage) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = bgImage;
    await new Promise((res) => (img.onload = res));

    for (let i = 0; i < slides.length; i++) {
      ctx.clearRect(0, 0, 1080, 1350);
      drawSlide(ctx, slides[i], img);
      
      const link = document.createElement('a');
      link.download = `slide-${i + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      // Небольшая пауза между скачиваниями
      await new Promise(r => setTimeout(r, 300));
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CAROUSEL STUDIO</h1>
        <div className="controls">
          <input type="file" accept="image/*" onChange={handleImageUpload} id="bg-upload" />
          <label htmlFor="bg-upload" className="btn">ЗАГРУЗИТЬ ФОН</label>
          <button onClick={addSlide} className="btn">ДОБАВИТЬ СЛАЙД</button>
          <button onClick={downloadSlides} className="btn primary" disabled={!bgImage}>СКАЧАТЬ ВСЕ СЛАЙДЫ</button>
        </div>
      </header>

      <main className="slides-grid">
        {slides.map((slide, index) => (
          <div key={index} className="slide-card">
            <h3>Слайд {index + 1}</h3>
            <textarea 
              placeholder="Заголовок" 
              value={slide.title} 
              onChange={(e) => updateSlide(index, 'title', e.target.value)}
            />
            <textarea 
              placeholder="Подзаголовок" 
              value={slide.subtitle} 
              onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
            />
            <button onClick={() => removeSlide(index)} className="btn-delete">Удалить</button>
          </div>
        ))}
      </main>

      {/* Скрытый холст для генерации */}
      <canvas ref={canvasRef} width={1080} height={1350} style={{ display: 'none' }} />
    </div>
  );
};

export default App;