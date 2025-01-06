import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VersePaginatorProps {
  currentVerse: number;
  totalVerses: number;
  onVerseChange: (verse: number) => void;
}

const VersePaginator: React.FC<VersePaginatorProps> = ({
  currentVerse,
  totalVerses,
  onVerseChange,
}) => {
  const handleKeyPress = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentVerse > 1) {
      onVerseChange(currentVerse - 1);
    } else if (e.key === 'ArrowRight' && currentVerse < totalVerses) {
      onVerseChange(currentVerse + 1);
    }
  }, [currentVerse, totalVerses, onVerseChange]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="flex items-center justify-center space-x-4 my-4">
      <button
        onClick={() => currentVerse > 1 && onVerseChange(currentVerse - 1)}
        disabled={currentVerse === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-gray-600">
        Verse {currentVerse} of {totalVerses}
      </span>
      <button
        onClick={() => currentVerse < totalVerses && onVerseChange(currentVerse + 1)}
        disabled={currentVerse === totalVerses}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default VersePaginator;