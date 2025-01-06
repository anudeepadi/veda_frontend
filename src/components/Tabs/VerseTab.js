import React, { useState, useEffect } from 'react';
import { Info, Download, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { fetchVerses, downloadAudio } from '../../services/api';
import AudioPlayer from '../AudioPlayer/AudioPlayer';

const VerseTab = ({ searchResults, selectedMandala, selectedHymn, loading }) => {
  const [verses, setVerses] = useState([]);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [activeAudio, setActiveAudio] = useState(null);

  useEffect(() => {
    if (selectedMandala && selectedHymn) {
      loadVerses();
    }
  }, [selectedMandala, selectedHymn]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('verse-bookmarks');
    if (savedBookmarks) {
      setBookmarks(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  const loadVerses = async () => {
    try {
      const data = await fetchVerses(selectedMandala, selectedHymn);
      setVerses(data.verses);
      setError(null);
    } catch (err) {
      console.error('Error loading verses:', err);
      setError('Failed to load verses. Please try again.');
    }
  };

  const handleShare = async (verse) => {
    try {
      await navigator.share({
        title: `Rig Veda Verse ${verse.number}`,
        text: `${verse.text}\n\n${verse.translation}`,
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback to copy to clipboard
      const text = `${verse.text}\n\n${verse.translation}`;
      await navigator.clipboard.writeText(text);
      alert('Verse copied to clipboard!');
    }
  };

  const handleDownload = async (verse) => {
    try {
      const audioUrl = await downloadAudio(selectedMandala, selectedHymn);
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `mandala_${selectedMandala}_hymn_${selectedHymn}_verse_${verse.number}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(audioUrl);
    } catch (err) {
      console.error('Error downloading audio:', err);
      alert('Failed to download audio. Please try again.');
    }
  };

  const toggleBookmark = (verseId) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(verseId)) {
      newBookmarks.delete(verseId);
    } else {
      newBookmarks.add(verseId);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('verse-bookmarks', JSON.stringify([...newBookmarks]));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      );
    }

    if (!selectedMandala || !selectedHymn) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Info size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Please select a mandala and hymn to view verses</p>
          </div>
        </div>
      );
    }

    const versesToDisplay = searchResults.length > 0 ? searchResults : verses;

    if (versesToDisplay.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Info size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">No verses found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {versesToDisplay.map((verse) => (
          <div key={verse.id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            {/* Verse Header */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Verse {verse.number}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleBookmark(verse.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  {bookmarks.has(verse.id) ? (
                    <BookmarkCheck className="text-blue-500" size={20} />
                  ) : (
                    <Bookmark className="text-gray-400" size={20} />
                  )}
                </button>
                <button
                  onClick={() => handleShare(verse)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Share2 className="text-gray-400" size={20} />
                </button>
                <button
                  onClick={() => handleDownload(verse)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Download className="text-gray-400" size={20} />
                </button>
              </div>
            </div>

            {/* Verse Content */}
            <div className="space-y-3">
              <p className="text-lg font-sanskrit">{verse.text}</p>
              <p className="text-gray-600 italic">{verse.transliteration}</p>
              <p className="text-gray-800">{verse.translation}</p>
            </div>

            {/* Audio Player */}
            <AudioPlayer
              verseId={verse.id}
              isPlaying={activeAudio === verse.id}
              onPlay={() => setActiveAudio(verse.id)}
              onPause={() => setActiveAudio(null)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      {selectedMandala && selectedHymn && !searchResults.length && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Mandala {selectedMandala}, Hymn {selectedHymn}
          </h2>
          <p className="text-gray-600">
            {verses.length} verses
          </p>
        </div>
      )}

      {/* Verses */}
      {renderContent()}
    </div>
  );
};

export default VerseTab;