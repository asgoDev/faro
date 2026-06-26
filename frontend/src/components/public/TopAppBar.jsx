import React, { useState, useEffect } from 'react';
import bandera from '/bandera.webp';


export default function TopAppBar({ search, setSearch }) {
  const [showSearch, setShowSearch] = useState(false);
  const [inputValue, setInputValue] = useState(search);

  // Sincronizar el input local si el estado global cambia o se limpia
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    setSearch('');
  };

  const handleBack = () => {
    setShowSearch(false);
    handleClear();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#00346f] text-white shadow-md border-b border-white/10 flex items-center justify-between px-4 h-16">

      {!showSearch ? (
        <>
          <h1 className="font-headline-md text-lg sm:text-xl font-bold tracking-tight text-white uppercase  flex-1 font-montserrat">
            Faro de Venezuela
          </h1>
          <button
            onClick={() => setShowSearch(true)}
            className="active:opacity-80 transition-opacity p-2 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center w-full gap-1">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Buscar por nombre..."
            className="flex-1 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all"
            autoFocus
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-white/60 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
          <button
            type="submit"
            className="p-2 text-[#fecb00] hover:text-[#fecb00]/80 flex items-center justify-center cursor-pointer"
            title="Buscar"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </form>
      )}
    </header>
  );
}
