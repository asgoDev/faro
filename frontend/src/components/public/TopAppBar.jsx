import React, { useState } from 'react';
import bandera from '/bandera.webp';


export default function TopAppBar({ search, setSearch }) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#00346f] text-white shadow-md border-b border-white/10 flex items-center justify-between px-4 h-16">
      <div className="w-20 h-10  p-1">
        <img
          alt="Logo Faro de Venezuela"
          className="w-full h-full object-contain "
          src={bandera}
        />
      </div>
      {!showSearch ? (
        <>
          <h1 className="font-headline-md text-lg sm:text-xl font-bold tracking-tight text-white uppercase text-center flex-1 font-montserrat">
            Faro de Venezuela
          </h1>
          <button
            onClick={() => setShowSearch(true)}
            className="active:opacity-80 transition-opacity p-2 text-white/80 hover:text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </>
      ) : (
        <div className="flex items-center w-full">
          <button
            onClick={() => {
              setShowSearch(false);
              setSearch('');
            }}
            className="p-2 text-white/80 hover:text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="flex-1 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all"
            autoFocus
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-2 text-white/60 hover:text-white flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
