import React, { useState } from 'react';

interface Slide {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [slides, setSlides] = useState<Slide[]>([{ id: Date.now(), title: '', content: '' }]);
  const [coverText, setCoverText] = useState('');
  const [footerText, setFooterText] = useState('');

  const addSlide = () => {
    setSlides([...slides, { id: Date.now(), title: '', content: '' }]);
  };

  const updateSlide = (id: number, field: keyof Slide, value: string) => {
    setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSlide = (id: number) => {
    setSlides(slides.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-montserrat">
      <h1 className="text-3xl md:text-4xl font-cinzel text-center mb-12 tracking-widest text-gold-500">
        CAROUSEL STUDIO
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* ЛЕВАЯ ПАНЕЛЬ НАСТРОЕК */}
        <div className="lg:col-span-1 space-y-8 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          
          <section>
            <h2 className="text-gold-500 font-bold mb-4 uppercase text-sm tracking-wider">1. Фон-референс</h2>
            <label className="border-2 border-dashed border-zinc-700 rounded-xl p-6 block text-center hover:border-gold-500 transition-colors cursor-pointer">
              <input type="file" className="hidden" accept="image/*" />
              <span className="text-xs text-zinc-400">+ Загрузить фон (JPEG/PNG)</span>
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-gold-500 font-bold mb-2 uppercase text-sm tracking-wider">2. Обложка</h2>
            <div>
              <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-tighter">Заголовок обложки (Золотой)</p>
              <textarea 
                value={coverText}
                onChange={(e) => setCoverText(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-gold-500 outline-none h-20 text-white"
                placeholder="СИЛА ВОЛИ..."
              />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-tighter">Добивка (Мелкий белый)</p>
              <input 
                type="text" 
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-gold-500 outline-none text-white"
                placeholder="Например: Почему так происходит?"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-gold-500 font-bold mb-4 uppercase text-sm tracking-wider">3. Слайды</h2>
            {slides.map((slide, index) => (
              <div key={slide.id} className="p-4 bg-black/40 border border-zinc-800 rounded-xl space-y-3 relative">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-zinc-500 font-bold">СЛАЙД {index + 1}</span>
                   <button onClick={() => removeSlide(slide.id)} className="text-red-500 text-[10px] hover:underline">Удалить</button>
                </div>
                <input 
                  value={slide.title}
                  onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-800 p-1 text-sm outline-none focus:border-gold-500"
                  placeholder="Заголовок слайда"
                />
                <textarea 
                  value={slide.content}
                  onChange={(e) => updateSlide(slide.id, 'content', e.target.value)}
                  className="w-full bg-transparent p-1 text-xs outline-none h-16 resize-none"
                  placeholder="Текст слайда..."
                />
              </div>
            ))}
            <button 
              onClick={addSlide}
              className="w-full py-3 bg-gold-500 text-black font-bold rounded-xl text-xs hover:bg-gold-600 transition-all uppercase"
            >
              + Добавить слайд
            </button>
          </section>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ ПРЕДПРОСМОТРА */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 md:p-10 h-full min-h-[600px] flex flex-col">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-8 text-center font-bold">Предпросмотр</h2>
            
            <div className="flex-grow flex items-center justify-center">
              {/* Эмуляция слайда */}
              <div className="aspect-square w-full max-w-[400px] bg-zinc-950 border border-zinc-800 shadow-2xl relative p-10 flex flex-col justify-center overflow-hidden rounded-lg">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>
                 <h3 className="text-gold-500 font-cinzel text-3xl mb-4 leading-tight uppercase">
                    {coverText || "Заголовок"}
                 </h3>
                 <p className="text-zinc-400 text-sm leading-relaxed">
                    {footerText || "Ваш текст появится здесь..."}
                 </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center md:justify-end">
               <button className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all text-sm uppercase tracking-wider">
                 Скачать все слайды
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;