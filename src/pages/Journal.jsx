import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Book, Edit3, Download, Search, Calendar, SentimentSad, SentimentVerySatisfied } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMood } from '../context/MoodContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { moodAyatMap } from '../data/ayat';

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const printRef = useRef();
  const { journal } = useApp();
  const { moods } = useMood();

  const moodsForJournal = Array.from(new Set(moods.map(m => m.mood)));

  const filteredEntries = journal.filter(entry =>
    entry.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.mood?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const element = printRef.current;
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 10;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save('jaguar-journal.pdf');
  };

  const addEntry = () => {
    if (newEntry.trim()) {
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('id-ID'),
        mood: selectedMood,
        note: newEntry,
        ayatSuggested: moodAyatMap[selectedMood]?.[0],
      };
      // Dispatch to context handled by parent
      setEntries(prev => [entry, ...prev]);
      setNewEntry('');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-50 via-neutral-50 to-stone-100">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-heading font-bold text-center mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent"
        >
          Resilience Journal
        </motion.h1>
        <p className="text-xl text-neutral-600 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          Catatan pribadi + ayat inspiratif + ekspor PDF
        </p>

        {/* New Entry */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-neutral-200"
        >
          <div className="flex gap-4 items-start mb-6">
            <Book className="w-12 h-12 text-primary-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Entri Baru</h3>
              <div className="flex gap-3 mb-4">
                <select 
                  value={selectedMood} 
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="flex-1 p-4 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 font-semibold text-lg"
                >
                  <option value="">Pilih mood hari ini</option>
                  {moodsForJournal.map(mood => (
                    <option key={mood} value={mood}>{mood.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Apa yang ingin kamu catat hari ini? Tantangan, syukur, atau pelajaran dari ayat..."
                className="w-full p-6 border-2 border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 resize-vertical min-h-[120px] text-lg font-medium leading-relaxed"
                rows="4"
              />
              <div className="flex gap-4 mt-6">
                <motion.button
                  onClick={addEntry}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-primary-500/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <Edit3 className="w-5 h-5 inline mr-2" />
                  Tambah Entri
                </motion.button>
                <motion.button
                  onClick={exportPDF}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-emerald-500/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  PDF
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-primary-100">
            <Calendar className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-neutral-900">{journal.length}</div>
            <p className="text-neutral-600 font-medium">Total Entri</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-accent-100">
            <SentimentVerySatisfied className="w-16 h-16 text-accent-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-neutral-900">{journal.filter(e => e.mood === 'happy').length}</div>
            <p className="text-neutral-600 font-medium">Mood Positif</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-red-100">
            <SentimentSad className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-neutral-900">{journal.filter(e => e.mood === 'sad').length}</div>
            <p className="text-neutral-600 font-medium">Refleksi Sulit</p>
          </div>
        </div>

        {/* Entries List */}
        <motion.div 
          ref={printRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex gap-4 items-center mb-8">
            <Search className="w-6 h-6 text-neutral-500" />
            <input
              type="text"
              placeholder="Cari entri (mood/kata kunci)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-4 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 text-lg"
            />
          </div>
          {filteredEntries.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Book className="w-24 h-24 text-neutral-400 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-neutral-500 mb-2">Belum ada entri journal</h3>
              <p className="text-neutral-400">Mulai dengan menulis refleksi pertamamu</p>
            </motion.div>
          ) : (
            filteredEntries.map((entry) => (
              <motion.div 
                key={entry.id}
                className="bg-white rounded-3xl shadow-xl p-8 border border-neutral-200 hover:shadow-2xl transition-all hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex gap-4 items-start mb-4">
                  <div className={`px-4 py-2 rounded-xl font-bold text-white text-sm ${entry.mood === 'happy' ? 'bg-emerald-500' : entry.mood === 'sad' ? 'bg-red-500' : 'bg-primary-500'}`}>
                    {entry.mood?.toUpperCase()}
                  </div>
                  <div className="text-sm text-neutral-500 font-medium">
                    {entry.date}
                  </div>
                </div>
                <p className="text-xl leading-relaxed mb-6 text-neutral-800 font-medium">{entry.note}</p>
                {entry.ayatSuggested && (
                  <div className="arabic text-2xl font-bold mb-4 text-right p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl">
                    {entry.ayatSuggested.arabic}
                  </div>
                )}
                <div className="flex gap-3 opacity-75">
                  <span className="text-sm text-neutral-500">Ayat: {entry.ayatSuggested?.surah}</span>
                  <Share2 className="w-4 h-4" />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}

