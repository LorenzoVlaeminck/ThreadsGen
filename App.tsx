import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Github, Twitter, Cpu, LayoutTemplate, Zap, Bookmark, Trash2 } from 'lucide-react';
import InputForm from './components/InputForm';
import PostCard from './components/PostCard';
import { generateThreadsPosts } from './services/geminiService';
import { GeneratedResponse, LoadingState } from './types';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [generatedData, setGeneratedData] = useState<GeneratedResponse | null>(null);
  const [currentHandle, setCurrentHandle] = useState('');
  const [currentStyle, setCurrentStyle] = useState('Auto-Match (AI)');
  const [error, setError] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [showAllSaved, setShowAllSaved] = useState(false);

  const loadSavedPosts = () => {
    try {
        const posts = JSON.parse(localStorage.getItem('saved_threads_posts') || '[]');
        // Sort by newest first
        posts.sort((a: any, b: any) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime());
        setSavedPosts(posts);
    } catch (e) {
        console.error("Failed to load saved posts", e);
    }
  };

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const handleDeleteSaved = (contentToDelete: string) => {
    const newPosts = savedPosts.filter(p => p.content !== contentToDelete);
    localStorage.setItem('saved_threads_posts', JSON.stringify(newPosts));
    setSavedPosts(newPosts);
  };

  const handleGenerate = async (offer: string, tone: string, audience: string, handle: string, style: string) => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setGeneratedData(null);
    setCurrentHandle(handle);
    setCurrentStyle(style);

    try {
      const data = await generateThreadsPosts(offer, tone, audience, style);
      setGeneratedData(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setError("Failed to generate posts. The AI might be taking a break. Try again!");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const getThemeBlobs = (style: string) => {
    switch(style) {
        case 'Neon Cyberpunk':
            return (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-400/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
                    <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-cyan-400/30 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-violet-400/30 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                </>
            );
        case 'Minimalist':
            return (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-200/40 rounded-full blur-[120px] opacity-70"></div>
                    <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-gray-200/40 rounded-full blur-[120px] opacity-70"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-slate-300/30 rounded-full blur-[120px] opacity-70"></div>
                </>
            );
        case 'Corporate':
             return (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
                    <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-slate-300/40 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                </>
            );
        case 'Organic':
             return (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
                    <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-teal-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-green-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                </>
            );
        case 'Luxury':
             return (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-200/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
                    <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-yellow-100/30 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                </>
            );
        default: // Auto-Match or default
             return (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
                    <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
                </>
            );
    }
  }

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans relative overflow-x-hidden transition-colors duration-1000 ease-in-out">
      
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-1000 ease-in-out">
        {getThemeBlobs(currentStyle)}
      </div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white p-1.5 rounded-lg transform group-hover:-rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                <LayoutTemplate size={22} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Threads<span className="text-indigo-600">Gen</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
                <Github size={20} />
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
               <Sparkles size={14} className="text-indigo-500 fill-indigo-100" />
               <span>GenAI Powered Content Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Craft Viral <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">Threads</span><br className="hidden md:block"/> in Seconds.
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              Stop staring at a blank screen. Generate engaging, audience-tailored posts with matching image concepts instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Input */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8">
              <InputForm onGenerate={handleGenerate} loadingState={loadingState} />
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                        <Zap size={16} />
                    </div>
                    Pro Tips
                </h3>
                <ul className="text-sm text-slate-600 space-y-3">
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                        <span><strong>Be Specific:</strong> Instead of "fitness", try "home workouts for busy dads".</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                        <span><strong>Add Constraints:</strong> "Include a numbered list" or "Use emojis sparingly".</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0"></div>
                        <span><strong>Experiment with Tone:</strong> "Controversial" often drives more engagement.</span>
                    </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="lg:col-span-7 min-h-[600px] flex flex-col gap-10">
              {/* Generated Content Section */}
              <div>
                  {loadingState === LoadingState.IDLE && (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200/80 rounded-3xl bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors duration-500 mb-8">
                      <div className="w-24 h-24 bg-gradient-to-tr from-slate-100 to-white rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <Cpu size={40} className="text-slate-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-700 mb-3">Your Feed Awaits</h3>
                      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Configure your post settings on the left and watch your content calendar fill up automatically.
                      </p>
                    </div>
                  )}

                  {loadingState === LoadingState.ERROR && (
                    <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 mb-8 flex items-start gap-4 shadow-sm">
                      <div className="bg-red-100 p-2.5 rounded-full shrink-0">
                        <Sparkles size={20} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1 text-lg">Generation Failed</h3>
                        <p className="text-sm opacity-90 leading-relaxed">{error}</p>
                      </div>
                    </div>
                  )}

                  {loadingState === LoadingState.SUCCESS && generatedData && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="flex items-center justify-between px-2 pb-4 border-b border-slate-200/60">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Your Drafts
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        </h2>
                        <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm">
                            {generatedData.posts.length} variants ready
                        </span>
                      </div>
                      
                      <div className="grid gap-8">
                        {generatedData.posts.map((post, index) => (
                          <PostCard
                            key={index}
                            content={post.content}
                            hashtags={post.hashtags}
                            imagePrompt={post.imagePrompt}
                            handle={currentHandle || '@you'}
                            style={currentStyle}
                            onSaveChange={loadSavedPosts}
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Saved Posts Section */}
              {savedPosts.length > 0 && (
                <div className="pt-8 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2.5">
                            <span className="bg-indigo-100 p-1.5 rounded-md text-indigo-600">
                                <Bookmark size={16} />
                            </span>
                            Recently Saved
                        </h3>
                        {savedPosts.length > 3 && (
                            <button 
                                onClick={() => setShowAllSaved(!showAllSaved)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                            >
                                {showAllSaved ? 'Show Less' : 'View All Saved'}
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {(showAllSaved ? savedPosts : savedPosts.slice(0, 4)).map((post, i) => (
                            <div key={i} className="group relative bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-sm text-slate-900">@{post.handle}</span>
                                    <button 
                                        onClick={() => handleDeleteSaved(post.content)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                        title="Remove from saved"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-3">
                                    {post.content}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="text-indigo-500 text-xs font-medium truncate max-w-[80%]">
                                        {post.hashtags?.map((tag: string) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ')}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                        {post.savedAt && new Date(post.savedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-md border-t border-slate-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                 <div className="bg-slate-900 text-white p-1 rounded-md">
                    <LayoutTemplate size={16} />
                </div>
                <span className="font-bold text-sm text-slate-900">ThreadsGen</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
                &copy; {new Date().getFullYear()} AI Threads Generator. Built with Google Gemini.
            </p>
            <div className="flex gap-6 text-slate-400">
                <Twitter size={18} className="hover:text-black cursor-pointer transition-colors" />
                <Github size={18} className="hover:text-black cursor-pointer transition-colors" />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;