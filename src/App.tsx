// Version 2.0
import { useState } from 'react';

function App() {
  const [slides, setSlides] = useState([{ id: 1, title: '', content: '' }]);
  const [coverText, setCoverText] = useState('');

  return (
    <div className="min-h-screen bg-black text-white p-8 font-montserrat text-left">
      <h1 className="text-4xl font-cinzel text-center mb-12 text-gold-500 uppercase tracking-widest">
        Carousel Studio
      </h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая часть */}
        <div className="lg:col-span-1 space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <section>
            <h2 className="text-gold-500 font-bold mb-4 uppercase text-sm">1. Обложка</h2>
            <textarea 
              value={coverText}
              onChange={(e) => setCoverText(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-gold-500 outline-none text-white"
              placeholder="Введите заголовок..."
            />
          </section>

          <section>
            <h2 className="text-gold-500 font-bold mb-4 uppercase text-sm">2. Слайды</h2>
            <button 
              onClick={() => setSlides([...slides, { id: Date.now(), title: '', content: '' }])}
              className="w-full py-3 bg-gold-500 text-black font-bold rounded-xl text-xs uppercase"
            >
              + Добавить слайд
            </button>
          </section>
        </div>

        {/* Правая часть */}
        <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-10 flex items-center justify-center">
          <div className="w-full max-w-md aspect-square bg-zinc-950 border border-zinc-800 rounded-lg p-10 flex flex-col justify-center relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>
            <h3 className="text-gold-500 font-cinzel text-3xl uppercase mb-4 break-words">
              {coverText || "ВАШ ЗАГОЛОВОК"}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;