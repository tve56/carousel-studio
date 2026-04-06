import { useState } from 'react';

function App() {
  const [coverMainText, setCoverMainText] = useState<string>('');
  const [coverSmallText, setCoverSmallText] = useState<string>('');

  const [slideInputs, setSlideInputs] = useState<string[]>(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<string[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSlideChange = (index: number, value: string) => {
    const newInputs = [...slideInputs];
    newInputs[index] = value;
    setSlideInputs(newInputs);
  };

  const addSlideInput = () => {
    setSlideInputs([...slideInputs, '']);
  };

  const removeSlideInput = (index: number) => {
    const newInputs = slideInputs.filter((_, i) => i !== index);
    setSlideInputs(newInputs.length ? newInputs : ['']);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSlides([]);

    await document.fonts.ready;

    const generatedUrls: string[] = [];
    
    try {
      if (coverMainText.trim() !== '' || coverSmallText.trim() !== '') {
        const coverUrl = await createCoverSlide(coverMainText, coverSmallText, referenceImage || undefined);
        generatedUrls.push(coverUrl);
        setSlides([...generatedUrls]); 
      }

      const validSlides = slideInputs.filter(text => text.trim() !== '');
      for (const slideText of validSlides) {
        const url = await createSlide(slideText, referenceImage || undefined);
        generatedUrls.push(url);
        setSlides([...generatedUrls]); 
      }
    } catch (error) {
      console.error("Ошибка генерации:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- НОВАЯ ФУНКЦИЯ ДЛЯ СКАЧИВАНИЯ ---
  const handleDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // ФУНКЦИЯ 1: ОБЛОЖКА
  // =========================================================================
  const createCoverSlide = (mainText: string, smallText: string, bgImageBase64?: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const renderCoverText = () => {
        ctx.textAlign = 'center'; 
        ctx.textBaseline = 'top'; 
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 20;

        const xPos = 540; 
        const maxWidth = 940; 

        const wrapText = (text: string, font: string) => {
            ctx.font = font;
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0] || '';
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
            if (currentLine) lines.push(currentLine);
            return lines;
        };

        const mainTextParts = mainText.split('\n');
        const allMainLines: {text: string, font: string, height: number, spacing: number, isGold: boolean}[] = [];

        if (mainTextParts.length > 0 && mainTextParts[0].trim() !== '') {
            const titleText = mainTextParts[0].trim();
            const titleFont = '700 92px "Cinzel", serif';
            const titleWrapped = wrapText(titleText, titleFont);
            
            titleWrapped.forEach((wl, idx) => {
                allMainLines.push({
                    text: wl, 
                    font: titleFont, 
                    height: 100, 
                    spacing: (idx === titleWrapped.length - 1) ? 20 : 5, 
                    isGold: true 
                });
            });

            if (mainTextParts.length > 1) {
                const subtitleText = mainTextParts.slice(1).join(' ').replace(/\s+/g, ' ').trim();
                
                if (subtitleText !== '') {
                    const subtitleFont = '700 40px "Cinzel", serif';
                    const subtitleWrapped = wrapText(subtitleText, subtitleFont);
                    
                    subtitleWrapped.forEach((wl, idx) => {
                        allMainLines.push({
                            text: wl, 
                            font: subtitleFont, 
                            height: 46, 
                            spacing: 5, 
                            isGold: false 
                        });
                    });
                }
            }
        }

        const smallLinesRaw = smallText.split('\n');
        const allSmallLines: {text: string, font: string, height: number, spacing: number}[] = [];
        smallLinesRaw.forEach(rawLine => {
            if (rawLine.trim() === '') {
                allSmallLines.push({text: '', font: '', height: 30, spacing: 0});
                return;
            }
            const font = '200 32px "Montserrat", sans-serif';
            const wrapped = wrapText(rawLine.trim(), font);
            wrapped.forEach((wl, idx) => {
                allSmallLines.push({
                    text: wl, 
                    font, 
                    height: 40, 
                    spacing: (idx === wrapped.length - 1) ? 10 : 5
                });
            });
        });

        let totalHeight = 0;
        allMainLines.forEach(l => totalHeight += l.height + l.spacing);
        if (allMainLines.length > 0 && allSmallLines.length > 0 && allSmallLines[0].text !== '') {
            totalHeight += 80; 
        }
        allSmallLines.forEach(l => totalHeight += l.height + l.spacing);

        const safeAreaTop = 200;
        const safeAreaBottom = 1100;
        let currentY = safeAreaTop + ((safeAreaBottom - safeAreaTop) - totalHeight) / 2;
        if (currentY < safeAreaTop) currentY = safeAreaTop;

        allMainLines.forEach(l => {
            if (l.text === '') {
                currentY += l.height;
                return;
            }
            ctx.font = l.font;
            
            if (l.isGold) {
                const gradient = ctx.createLinearGradient(xPos, currentY, xPos, currentY + l.height);
                gradient.addColorStop(0, '#FFFCE0'); 
                gradient.addColorStop(0.4, '#D4AF37'); 
                gradient.addColorStop(1, '#A87D00'); 
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = '#ffffff'; 
            }
            
            ctx.fillText(l.text, xPos, currentY); 
            currentY += l.height + l.spacing;
        });

        if (allMainLines.length > 0 && allSmallLines.length > 0 && allSmallLines[0].text !== '') {
            currentY += 80;
        }

        allSmallLines.forEach(l => {
            if (l.text === '') {
                currentY += l.height;
                return;
            }
            ctx.font = l.font;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(l.text, xPos, currentY); 
            currentY += l.height + l.spacing;
        });

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };

      if (bgImageBase64) {
        const img = new Image();
        img.onload = () => {
          const scale = Math.max(1080 / img.width, 1350 / img.height);
          const x = (1080 / 2) - (img.width / 2) * scale;
          const y = (1350 / 2) - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.fillRect(0, 0, 1080, 1350);
          renderCoverText();
        };
        img.src = bgImageBase64;
      } else {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, 1080, 1350);
        renderCoverText();
      }
    });
  };

  // =========================================================================
  // ФУНКЦИЯ 2: ОБЫЧНЫЕ СЛАЙДЫ
  // =========================================================================
  const createSlide = (text: string, bgImageBase64?: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const renderTextAndUI = () => {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top'; 
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 15;

        const maxWidth = 800;
        const paragraphs = text.split('\n');

        let totalTextBlockHeight = 0;
        let isFirstTextLineSim = true;

        paragraphs.forEach((para, index) => {
          if (para.trim() === '') {
            totalTextBlockHeight += 40; 
            return;
          }
          if (isFirstTextLineSim) {
            ctx.font = '700 70px "Cinzel", serif';
            isFirstTextLineSim = false;
          } else {
            ctx.font = '200 32px "Montserrat", sans-serif';
          }
          const lineHeight = ctx.font.includes('70px') ? 85 : 48;
          const paraSpacing = ctx.font.includes('70px') ? 70 : 48;

          const words = para.split(' ');
          let simLine = '';
          let linesThisPara = 1;

          for (let n = 0; n < words.length; n++) {
            const testLine = simLine + words[n] + ' ';
            if (ctx.measureText(testLine).width > maxWidth && n > 0) {
              linesThisPara++;
              simLine = words[n] + ' ';
            } else {
              simLine = testLine;
            }
          }
          totalTextBlockHeight += linesThisPara * lineHeight;

          if (index < paragraphs.length - 1) {
              totalTextBlockHeight += paraSpacing;
          }
        });

        const safeAreaTop = 280;   
        const safeAreaBottom = 1080; 
        const availableHeight = safeAreaBottom - safeAreaTop;
        
        let centeredStartingY = safeAreaTop + (availableHeight - totalTextBlockHeight) / 2;
        if (centeredStartingY < safeAreaTop) {
            centeredStartingY = safeAreaTop;
        }

        const xPos = 140; 
        let currentY = centeredStartingY; 
        let isFirstTextLine = true; 

        for (let i = 0; i < paragraphs.length; i++) {
          const para = paragraphs[i];

          if (para.trim() === '') {
            currentY += 40;
            continue;
          }

          if (isFirstTextLine) {
            ctx.font = '700 70px "Cinzel", serif';
            const headerGradient = ctx.createLinearGradient(xPos, currentY, xPos, currentY + 85);
            headerGradient.addColorStop(0, '#FFFCE0'); 
            headerGradient.addColorStop(0.4, '#D4AF37'); 
            headerGradient.addColorStop(1, '#A87D00'); 
            ctx.fillStyle = headerGradient; 
            isFirstTextLine = false;
          } else {
            ctx.font = '200 32px "Montserrat", sans-serif';
            ctx.fillStyle = '#ffffff'; 
          }

          const words = para.split(' ');
          let line = '';
          const lineHeight = ctx.font.includes('70px') ? 85 : 48; 
          const paraSpacing = ctx.font.includes('70px') ? 70 : 48;

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (ctx.measureText(testLine).width > maxWidth && n > 0) {
              ctx.fillText(line.trim(), xPos, currentY);
              line = words[n] + ' ';
              currentY += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line.trim(), xPos, currentY);
          
          if (i < paragraphs.length - 1) {
            currentY += paraSpacing;
          }
        }

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };

      if (bgImageBase64) {
        const img = new Image();
        img.onload = () => {
          const scale = Math.max(1080 / img.width, 1350 / img.height);
          const x = (1080 / 2) - (img.width / 2) * scale;
          const y = (1350 / 2) - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.fillRect(0, 0, 1080, 1350);
          renderTextAndUI();
        };
        img.src = bgImageBase64;
      } else {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, 1080, 1350);
        renderTextAndUI();
      }
    });
  };

  // =========================================================================
  // ИНТЕРФЕЙС ПРИЛОЖЕНИЯ
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-center mb-12">
          CAROUSEL <span className="text-yellow-500">STUDIO</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="col-span-1 bg-[#111] p-8 rounded-3xl border border-white/5 flex flex-col h-fit">
            
            <h2 className="text-xl font-bold mb-4 text-yellow-500">1. ФОН-РЕФЕРЕНС</h2>
            <label className="block w-full cursor-pointer bg-black border-2 border-dashed border-white/20 hover:border-yellow-500 rounded-2xl p-4 text-center mb-8 transition-all">
              <span className="text-sm text-gray-400">
                {referenceImage ? 'Фон загружен!' : '+ Загрузить фон (JPEG/PNG)'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            <h2 className="text-xl font-bold mb-4 text-yellow-500">2. ОБЛОЖКА</h2>
            <div className="space-y-4 mb-8">
              <div>
                <span className="text-xs font-bold text-gray-500 mb-2 block">ПЕРВАЯ СТРОКА - ЗОЛОТО, ОСТАЛЬНЫЕ - БЕЛЫЕ</span>
                <textarea
                  className="w-full h-28 bg-black border border-white/10 rounded-2xl p-4 focus:border-yellow-500 text-sm outline-none transition-all resize-none font-sans"
                  placeholder="Например: ЧИТАЕШЬ КНИГУ..."
                  value={coverMainText}
                  onChange={(e) => setCoverMainText(e.target.value)}
                />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 mb-2 block">ДОБИВКА (ЦЕНТР, МЕЛКИЙ БЕЛЫЙ)</span>
                <textarea
                  className="w-full h-16 bg-black border border-white/10 rounded-2xl p-4 focus:border-yellow-500 text-sm outline-none transition-all resize-none font-sans"
                  placeholder="Например: Почему так происходит?"
                  value={coverSmallText}
                  onChange={(e) => setCoverSmallText(e.target.value)}
                />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 text-yellow-500">3. СЛАЙДЫ</h2>
            <div className="space-y-4 mb-6">
              {slideInputs.map((text, index) => (
                <div key={index} className="relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-500">СЛАЙД {index + 1}</span>
                    {slideInputs.length > 1 && (
                      <button 
                        onClick={() => removeSlideInput(index)}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                  <textarea
                    className="w-full h-40 bg-black border border-white/10 rounded-2xl p-4 focus:border-yellow-500 text-sm outline-none transition-all resize-none font-sans"
                    placeholder={`Заголовок (золотой)\n\nТекст абзаца...`}
                    value={text}
                    onChange={(e) => handleSlideChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addSlideInput}
              className="w-full mb-8 border border-white/20 hover:border-white/50 text-white py-3 rounded-2xl transition-all text-sm font-bold"
            >
              + ДОБАВИТЬ СЛАЙД
            </button>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (slideInputs.every(t => t.trim() === '') && coverMainText.trim() === '')}
              className="w-full mt-auto bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 rounded-2xl transition-all disabled:opacity-50"
            >
              {isGenerating ? 'РИСУЕМ...' : 'СГЕНЕРИРОВАТЬ КАРУСЕЛЬ'}
            </button>
          </div>

          <div className="col-span-2 bg-[#111] p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-6">ПРЕДПРОСМОТР</h2>
            <div className="grid grid-cols-2 gap-6">
              {slides.map((slide, index) => {
                const isCover = index === 0 && (coverMainText || coverSmallText);
                const slideNumber = index + (coverMainText || coverSmallText ? 0 : 1);
                
                return (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="rounded-2xl overflow-hidden border border-white/10 relative group shadow-lg">
                      <img src={slide} className="w-full h-auto" alt={`Слайд ${index + 1}`} />
                      {!isCover && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">
                          {slideNumber}
                        </div>
                      )}
                    </div>
                    
                    {/* НОВАЯ КНОПКА СКАЧИВАНИЯ ПОД СЛАЙДОМ */}
                    <button
                      onClick={() => handleDownload(slide, isCover ? 'cover.jpg' : `slide-${slideNumber}.jpg`)}
                      className="w-full bg-white/5 hover:bg-yellow-500 hover:text-black text-white text-sm font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      СКАЧАТЬ {isCover ? 'ОБЛОЖКУ' : `СЛАЙД ${slideNumber}`}
                    </button>
                  </div>
                );
              })}
            </div>
            {slides.length === 0 && (
              <div className="w-full h-96 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-gray-500">
                Заполни тексты и нажми генерацию
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;