import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Heart, MessageCircle, Repeat, Send, MoreHorizontal, Image as ImageIcon, AlertCircle, Edit2, Sparkles, Bookmark, Loader2 } from 'lucide-react';
import { generatePostImage } from '../services/geminiService';

interface PostCardProps {
  content: string;
  hashtags: string[];
  imagePrompt: string;
  handle: string;
  style?: string;
  onSaveChange?: () => void;
}

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-gradient-to-br from-red-100 to-red-200 text-red-600',
    'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600',
    'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600',
    'bg-gradient-to-br from-green-100 to-green-200 text-green-600',
    'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600',
    'bg-gradient-to-br from-teal-100 to-teal-200 text-teal-600',
    'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-600',
    'bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600',
    'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600',
    'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600',
    'bg-gradient-to-br from-violet-100 to-violet-200 text-violet-600',
    'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600',
    'bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 text-fuchsia-600',
    'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600',
    'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const PostCard: React.FC<PostCardProps> = ({ content, hashtags, imagePrompt, handle, style = "Auto-Match", onSaveChange }) => {
  const [editedContent, setEditedContent] = useState(content);
  
  // Initialize tags string from props. 
  const [tagsString, setTagsString] = useState(hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' '));
  const [isEditingTags, setIsEditingTags] = useState(false);
  
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const userHandle = handle.replace('@', '') || 'creator';
  const avatarColorClass = getAvatarColor(userHandle);

  // Sync state if props change (new generation)
  useEffect(() => {
    setEditedContent(content);
    setTagsString(hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' '));
  }, [content, hashtags]);
  
  // Generate Image Effect
  useEffect(() => {
    let isMounted = true;
    
    const fetchImage = async () => {
        if (!imagePrompt) return;
        
        setIsImageLoading(true);
        setGeneratedImage(null); // Reset prev image
        
        try {
            const base64Data = await generatePostImage(imagePrompt, style);
            if (isMounted && base64Data) {
                setGeneratedImage(`data:image/png;base64,${base64Data}`);
            }
        } catch (e) {
            console.error("Failed to generate image for post card", e);
        } finally {
            if (isMounted) setIsImageLoading(false);
        }
    };

    fetchImage();

    return () => { isMounted = false; };
  }, [imagePrompt, style]);

  // Check if saved state matches localStorage
  useEffect(() => {
    try {
        const savedPosts = JSON.parse(localStorage.getItem('saved_threads_posts') || '[]');
        const exists = savedPosts.some((p: any) => p.content === editedContent);
        setIsSaved(exists);
    } catch (e) {
        console.error("Error checking saved status", e);
    }
  }, [editedContent]);

  // Auto-resize textarea for main content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editedContent]);

  const handleCopy = () => {
    const fullText = `${editedContent}\n\n${tagsString}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveTags = () => {
    setIsEditingTags(false);
  };

  const handleToggleSave = () => {
    try {
        const savedPosts = JSON.parse(localStorage.getItem('saved_threads_posts') || '[]');
        
        if (isSaved) {
            // Remove
            const newPosts = savedPosts.filter((p: any) => p.content !== editedContent);
            localStorage.setItem('saved_threads_posts', JSON.stringify(newPosts));
            setIsSaved(false);
        } else {
            // Add
            const newPost = {
                content: editedContent,
                hashtags: tagsString.split(' ').map(t => t.trim()).filter(Boolean),
                imagePrompt,
                handle: userHandle,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem('saved_threads_posts', JSON.stringify([...savedPosts, newPost]));
            setIsSaved(true);
        }
        
        if (onSaveChange) {
            onSaveChange();
        }
    } catch (e) {
        console.error("Error updating saved posts", e);
    }
  };

  // Calculate total character count (Content + 2 newlines + Hashtags)
  const totalCharCount = editedContent.length + (tagsString.length > 0 ? tagsString.length + 2 : 0);
  const isOverLimit = totalCharCount > 500;

  return (
    <div className="flex flex-col gap-5 group">
      {/* Threads Preview Card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-slate-300 transition-all duration-300 relative transform hover:-translate-y-1">
        <div className="p-5 sm:p-6">
          <div className="flex gap-4">
            {/* Avatar Column */}
            <div className="flex flex-col items-center">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-inner ${avatarColorClass} border-2 border-white`}>
                {userHandle[0].toUpperCase()}
              </div>
              <div className="w-0.5 grow bg-slate-100 mt-3 mb-1 rounded-full"></div>
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-[15px] hover:underline cursor-pointer">{userHandle}</span>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="text-slate-400 text-[15px]">2h</span>
                </div>
                <div className="flex items-center gap-2">
                   {isOverLimit && (
                      <span className="text-xs text-red-500 font-bold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full">
                        <AlertCircle size={10} strokeWidth={3} /> {totalCharCount - 500} over
                      </span>
                   )}
                   <span className={`text-xs ${isOverLimit ? 'text-red-500 font-bold' : 'text-slate-300'}`}>
                     {totalCharCount}/500
                   </span>
                   <div className="flex items-center gap-2 ml-3">
                        <button className="text-slate-400 hover:text-slate-900 transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`p-2 rounded-full transition-all duration-200 shadow-sm ${
                            copied 
                                ? 'bg-green-100 text-green-600 scale-110' 
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white'
                            }`}
                            title="Copy text"
                        >
                            {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                        </button>
                   </div>
                </div>
              </div>

              {/* Editable Text Body */}
              <textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full resize-none bg-transparent border-none p-0 text-[15px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none mb-3 font-normal overflow-hidden selection:bg-indigo-100 selection:text-indigo-900"
                rows={1}
                spellCheck={false}
              />

              {/* Editable Hashtags Section */}
              <div className="mb-4">
                {isEditingTags ? (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <input
                      type="text"
                      value={tagsString}
                      onChange={(e) => setTagsString(e.target.value)}
                      className="w-full text-[15px] text-indigo-600 font-medium bg-slate-50 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none px-2 py-1.5 rounded-t transition-colors"
                      placeholder="#tag1 #tag2"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTags();
                      }}
                    />
                    <button
                      onClick={handleSaveTags}
                      className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
                      title="Save hashtags"
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <div className="group/tags relative flex items-center gap-2 -ml-1.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer w-fit" onClick={() => setIsEditingTags(true)}>
                    <div className="text-[15px] text-indigo-600 font-medium">
                      {tagsString || <span className="text-slate-300 italic text-sm">Add hashtags...</span>}
                    </div>
                    <div className="opacity-0 group-hover/tags:opacity-100 text-slate-400 transition-all scale-90">
                      <Edit2 size={12} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-5 mt-3 -ml-2 w-full">
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all hover:scale-110">
                  <Heart size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all hover:scale-110">
                  <MessageCircle size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all hover:scale-110">
                  <Repeat size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all hover:scale-110">
                  <Send size={20} />
                </button>

                {/* Save/Bookmark Button - Pushed to right */}
                <button 
                  onClick={handleToggleSave}
                  className={`p-2 rounded-full transition-all hover:scale-110 ml-auto ${
                    isSaved 
                      ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={isSaved ? "Remove from saved" : "Save post"}
                >
                  <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Idea Attachment (Visual Component) */}
      <div className="bg-gradient-to-r from-indigo-50 to-white rounded-xl border border-indigo-100 overflow-hidden shadow-sm relative group-hover:shadow-md transition-all">
        {isImageLoading ? (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 gap-3">
                <Loader2 className="animate-spin text-indigo-400" size={32} />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Generating Visual...</span>
            </div>
        ) : generatedImage ? (
            <div className="relative">
                <img src={generatedImage} alt={imagePrompt} className="w-full h-auto object-cover max-h-[500px]" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                    <p className="text-white/90 text-xs font-medium leading-relaxed drop-shadow-sm line-clamp-2">
                        {imagePrompt}
                    </p>
                </div>
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-lg border border-white/20">
                    <Sparkles size={16} />
                </div>
            </div>
        ) : (
             <div className="p-4 flex items-start gap-4">
                <div className="absolute top-0 right-0 p-2 opacity-50">
                    <Sparkles className="text-indigo-200" size={40} strokeWidth={1} />
                </div>
                <div className="bg-white text-indigo-600 p-2.5 rounded-xl shrink-0 shadow-sm border border-indigo-50">
                    <ImageIcon size={20} />
                </div>
                <div className="relative z-10">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        AI Image Concept
                        <span className="h-px w-8 bg-indigo-200"></span>
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        "{imagePrompt}"
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;