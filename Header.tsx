
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Bank<span className="text-blue-600">Analyzer</span></h1>
        </div>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
          <a href="#" className="text-blue-600">Extratos</a>
        </nav>

        <div className="flex items-center gap-2">
           <span className="hidden sm:inline text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">AI POWERED</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
