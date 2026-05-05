import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, ThumbsUp, MessageSquare, Share2, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

const mockPosts = [
  {
    id: 1,
    author: 'Abdullah S.',
    avatar: 'A',
    date: '2 jam lalu',
    content: 'Alhamdulillah hari ini mood naik setelah baca QS Al-Insyirah. Ada yang punya pengalaman sama?',
    likes: 12,
    comments: 3,
    votes: 5,
    mood: 'happy',
  },
  {
    id: 2,
    author: 'Fatimah K.',
    avatar: 'F',
    date: '1 hari lalu',
    content: 'Saat stress kuliah, ayat tawakkal QS Al-Baqarah sangat menenangkan. Sharing pengalaman kalian yuk!',
    likes: 28,
    comments: 8,
    votes: 12,
    mood: 'calm',
  },
  {
    id: 3,
    author: 'Ustadz Kamal',
    avatar: 'U',
    date: '3 hari lalu',
    content: 'Resilience mental melalui Quran: konsistensi sabr adalah kunci. Badge Sabr unlocked! 💪',
    likes: 45,
    comments: 15,
    votes: 22,
    mood: 'motivated',
  },
];

export default function Community() {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(mockPosts);
  const [tab, setTab] = useState('forum');
  const { updateCommunity } = useApp();

  const addPost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: 'Kamu',
        avatar: 'K',
        date: 'Baru saja',
        content: newPost,
        likes: 0,
        comments: 0,
        votes: 0,
        mood: 'neutral',
      };
      setPosts([post, ...posts]);
      setNewPost('');
      updateCommunity({ notifications: [{ message: 'Post baru dibagikan!' }] });
    }
  };

  const likePost = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const votePost = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-heading font-bold text-center mb-8 bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent"
        >
          Komunitas Qur'ani
        </motion.h1>
        <p className="text-xl text-neutral-600 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          Bagikan refleksi ayat | Voting terbaik | Kolaborasi kampus
        </p>

        {/* Tabs */}
        <div className="flex bg-white rounded-3xl shadow-xl p-1 mb-12 overflow-hidden">
          {['forum', 'ide', 'event'].map((t) => (
            <motion.button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-4 px-6 font-bold text-lg transition-all relative ${
                tab === t 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'text-neutral-600 hover:text-indigo-600'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {t === 'forum' && <MessageCircle className="w-6 h-6 inline mr-2" />}
              {t === 'ide' && <Award className="w-6 h-6 inline mr-2" />}
              {t === 'event' && <Users className="w-6 h-6 inline mr-2" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* New Post */}
        {tab === 'forum' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-indigo-100"
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
              Bagikan Refleksi
            </h3>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Bagikan pengalaman ayat favoritmu hari ini, mood tracker result, atau refleksi resilience..."
              className="w-full p-6 border-2 border-neutral-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 resize-vertical min-h-[120px] text-lg font-medium"
              rows="3"
            />
            <motion.button
              onClick={addPost}
              className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl hover:shadow-indigo-500/40 transition-all text-lg"
              whileHover={{ scale: 1.02 }}
            >
              <Share2 className="w-6 h-6 inline mr-3" />
              Posting ke Komunitas
            </motion.button>
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-100 hover:shadow-2xl transition-all hover:-translate-y-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-xl text-neutral-900 truncate">{post.author}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      post.mood === 'happy' ? 'bg-emerald-100 text-emerald-800' :
                      post.mood === 'calm' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {post.mood}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500">{post.date}</p>
                </div>
              </div>

              <p className="text-lg leading-relaxed mb-8 text-neutral-800 font-medium">{post.content}</p>

              <div className="flex items-center gap-8 text-sm">
                <motion.button
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 font-semibold transition-all p-3 -m-3 rounded-2xl hover:bg-indigo-50"
                  whileTap={{ scale: 0.98 }}
                >
                  <ThumbsUp className="w-5 h-5" />
                  {post.likes} Like
                </motion.button>
                <button className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 font-semibold transition-all p-3 -m-3 rounded-2xl hover:bg-indigo-50">
                  <MessageCircle className="w-5 h-5" />
                  {post.comments} Komentar
                </button>
                {tab === 'forum' && (
                  <motion.button
                    onClick={() => votePost(post.id)}
                    className="ml-auto flex items-center gap-2 text-neutral-600 hover:text-amber-600 font-semibold transition-all p-3 -m-3 rounded-2xl hover:bg-amber-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Star className="w-5 h-5" />
                    Vote ({post.votes})
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <motion.div 
            className="text-center py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Users className="w-32 h-32 text-neutral-300 mx-auto mb-8 opacity-50" />
            <h3 className="text-3xl font-bold text-neutral-500 mb-4">Belum ada postingan</h3>
            <p className="text-xl text-neutral-400 mb-8 max-w-md mx-auto">Jadilah yang pertama berbagi refleksi ayatmu!</p>
            <motion.button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold px-12 py-5 rounded-3xl shadow-2xl hover:shadow-indigo-500/40 transition-all text-lg"
              whileHover={{ scale: 1.02 }}
              onClick={() => setTab('forum')}
            >
              Mulai Posting
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

