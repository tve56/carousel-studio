import React, { useState } from 'react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-montserrat">
      {/* Заголовок */}
      <h1 className="text-4xl font-cinzel text-center mb-12 tracking-widest">
        CAROUSEL <span className="text-gold-500">STUDIO</span>
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ЛЕВАЯ ПАНЕЛЬ НАСТРОЕК */}
        <div className="lg:col-span-1 space-y-8 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          
          {/* 1. ФОН-РЕФЕРЕНС */}
          <section>
            <h2 className="text-gold-500 font-bold mb-4">1. ФОН-РЕФЕРЕНС</h2>
            <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-gold-500 transition-colors cursor-pointer">
              <span className="text-sm text-zinc-400">+ Загрузить фон (JPEG/PNG)</span>
            </div>
          </section>

          {/* 2. ОБЛОЖКА */}
          <section>
            <h2 className="text-gold-500 font-bold mb-4">2. ОБЛОЖКА</h2>
            <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-tighter">Первая строка - золото, остальные - белые</p>
            <textarea 
              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-gold-500 outline-none h-24"
              placeholder="СИЛА ВОЛИ..."
            />
            <div className="mt-4">
              <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-tighter">Добивка (центр, мелкий белый)</p>
              <input 
                type="text" 
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-gold-500 outline-none"
                placeholder="Например: Почему так происходит?"
              />
            </div>
          </section>

          {/* 3. СЛАЙДЫ */}
          <section>
            <h2 className="text-gold-500 font-bold mb-2">3. СЛАЙДЫ</h2>
            <p className="text-xs text-zinc-500 mb-4">СЛАЙД 1</p>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-all">
              + Добавить слайд
            </button>
          </section>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ ПРЕДПРОСМОТРА */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 h-full min-h-[500px] flex flex-col">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-8 text-center">Предпросмотр</h2>
            
            <div className="flex-grow border border-zinc-800 border-dashed rounded-2xl flex items-center justify-center relative bg-black/40">
              <span className="text-zinc-600 text-sm">Заполни тексты и нажми генерацию</span>
            </div>

            <div className="mt-8 flex justify-end gap-4">
               <button className="px-6 py-2 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition-all">
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