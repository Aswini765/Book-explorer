import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  MessageSquare, 
  Layers, 
  FileText, 
  Share2, 
  Search, 
  Copy, 
  Check, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Loader2, 
  ExternalLink,
  BookMarked,
  Clock,
  Gauge,
  HelpCircle,
  TrendingUp,
  Award,
  Heart,
  Quote
} from "lucide-react";
import { PRESET_BOOKS, PresetBook } from "./data";
import { BookDetails, SearchSuggestion, KeyIdea, DetailedSection } from "./types";
import { fetchPresetBooks, searchBooksInSupabase, findBookByTitleOrSlug } from "./services/bookService";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Available Preset Books (initialized with local, enriched from Supabase)
  const [presetBooks, setPresetBooks] = useState<PresetBook[]>(PRESET_BOOKS);

  // Loaded Book Details
  const [activeBook, setActiveBook] = useState<BookDetails>(PRESET_BOOKS[0].data);
  const [citations, setCitations] = useState<{ title: string; url: string }[]>([]);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "ideas" | "summary" | "share">("overview");
  
  // UI States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIdeaIdx, setExpandedIdeaIdx] = useState<number | null>(0); // First expanded by default
  const [searchStatus, setSearchStatus] = useState("Looking up reviews...");
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch books from Supabase on initial mount
  useEffect(() => {
    let isMounted = true;
    fetchPresetBooks().then((books) => {
      if (isMounted && books && books.length > 0) {
        setPresetBooks(books);
        // If current active book is default, set to the first book from Supabase
        setActiveBook((prev) => (prev.title === PRESET_BOOKS[0].data.title ? books[0].data : prev));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Suggestions Fetcher
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      // Show preset suggestions by default when input is focused but short
      const defaultPresets = presetBooks.map(b => ({
        title: b.data.title,
        author: b.data.author,
        genre: b.data.genre,
        year: b.data.publicationYear
      }));
      setSuggestions(defaultPresets);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // First filter local/loaded presets to show instantly
        const localMatches = presetBooks.filter(b => 
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          b.author.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(b => ({
          title: b.data.title,
          author: b.data.author,
          genre: b.data.genre,
          year: b.data.publicationYear
        }));

        // Concurrently query Supabase and backend suggestions API
        const [supabaseMatches, apiData] = await Promise.all([
          searchBooksInSupabase(searchQuery),
          fetch(`/api/suggestions?query=${encodeURIComponent(searchQuery)}`)
            .then(res => (res.ok ? (res.json() as Promise<SearchSuggestion[]>) : []))
            .catch(() => [] as SearchSuggestion[])
        ]);

        // Merge lists and deduplicate by title
        const seen = new Set<string>();
        const combined: SearchSuggestion[] = [];

        for (const item of [...localMatches, ...supabaseMatches, ...apiData]) {
          const lower = item.title.toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            combined.push(item);
          }
        }

        setSuggestions(combined.slice(0, 5));
      } catch (err) {
        console.error("Suggestions fetch error:", err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, presetBooks]);

  // Main book analysis fetcher
  const handleAnalyzeBook = async (title: string, author?: string) => {
    setLoading(true);
    setError(null);
    setShowSuggestions(false);
    
    // Smooth status transitions
    const statuses = [
      "Gathering community reviews...",
      "Analyzing general sentiment...",
      "Extracting core concepts & takeaways...",
      "Compiling structured summary...",
      "Assembling shareable social summaries..."
    ];
    let statusIdx = 0;
    setSearchStatus(statuses[0]);
    const interval = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      setSearchStatus(statuses[statusIdx]);
    }, 2200);

    try {
      // 1. First check if it matches an in-memory or loaded preset
      const matchedPreset = presetBooks.find(b => b.title.toLowerCase() === title.toLowerCase());
      if (matchedPreset) {
        setTimeout(() => {
          setActiveBook(matchedPreset.data);
          setCitations([]);
          setLoading(false);
          setActiveTab("overview");
          clearInterval(interval);
        }, 1200);
        return;
      }

      // 2. Next check if it exists in Supabase
      const supabaseBook = await findBookByTitleOrSlug(title);
      if (supabaseBook) {
        setTimeout(() => {
          setActiveBook(supabaseBook);
          setCitations([]);
          setLoading(false);
          setActiveTab("overview");
          clearInterval(interval);
        }, 1200);
        return;
      }

      // 3. Fall back to AI Analysis endpoint
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "The explorer had trouble analyzing this book. Please try another.");
      }

      const resData = await response.json();
      setActiveBook(resData.data);
      setCitations(resData.sources || []);
      setActiveTab("overview");
    } catch (err: any) {
      setError(err.message || "An unexpected issue occurred.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSuggestionClick = (s: SearchSuggestion) => {
    setSearchQuery(s.title);
    handleAnalyzeBook(s.title, s.author);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleAnalyzeBook(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-zinc-900/40 to-transparent pointer-events-none z-0" />

      {/* Main Top Header */}
      <header className="border-b border-zinc-900 bg-[#07070a]/80 backdrop-blur-md sticky top-0 z-40 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => {
              setSearchQuery("");
              setActiveBook(presetBooks[0].data);
              setActiveTab("overview");
            }}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
              <BookOpen className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-zinc-500 font-mono block uppercase">Interactive Companion</span>
              <h1 className="text-base font-medium tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Book Explorer
              </h1>
            </div>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-850">
              CONSUMER_EDITION
            </span>
          </div>
        </div>
      </header>

      {/* Main content body */}
      <main className="flex-grow max-w-5xl w-full mx-auto p-4 md:p-8 z-10 flex flex-col gap-8">
        
        {/* Simple Minimalist Home Search Section */}
        <section className="bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
              What book would you like to explore?
            </h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Get an instant high-quality summary, main themes, verified reader opinions, and easy social digests.
            </p>
          </div>

          <div className="max-w-xl mx-auto relative" ref={suggestionsRef}>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search books..."
                  className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder-zinc-500 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none transition-all"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
              </div>
              <button 
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-medium text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore</span>
              </button>
            </form>

            {/* Suggestions Autocomplete List */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#0c0c11] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-zinc-900">
                <div className="p-2 text-[10px] text-zinc-500 font-mono tracking-wider bg-zinc-900/30">
                  SUGGESTIONS
                </div>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full text-left p-3 hover:bg-zinc-900/60 transition-colors flex justify-between items-center gap-4 group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors truncate">
                        {s.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {s.author}
                      </div>
                    </div>
                    <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800 shrink-0 font-mono">
                      {s.genre || "Book"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Loading / Analytical State */}
        {loading && (
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[380px] shadow-2xl relative">
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none opacity-40" />
            
            <div className="w-14 h-14 rounded-full border-2 border-emerald-500/15 border-t-emerald-500 animate-spin flex items-center justify-center mb-6">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>

            <h3 className="text-lg font-light tracking-tight text-white mb-1.5">
              Analyzing book...
            </h3>
            <p className="text-xs font-mono text-emerald-400 animate-pulse tracking-wide">
              {searchStatus}
            </p>
          </div>
        )}

        {/* Loaded Book Result Displays */}
        {!loading && activeBook && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Error Message if any */}
            {error && (
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 text-xs text-rose-300 flex items-start gap-2.5">
                <span className="text-lg leading-none">⚠️</span>
                <div>
                  <h4 className="font-bold">Lookup Unsuccessful</h4>
                  <p className="mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Quick Header Banner / Snapshot Metadata */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <div className="flex gap-4 items-center">
                {/* Embedded Premium Visual Cover Card */}
                <div className={`w-16 h-24 bg-gradient-to-br ${activeBook.coverColor || 'from-zinc-800 to-zinc-950'} rounded-lg shadow-xl border border-white/5 flex flex-col justify-between p-2 relative overflow-hidden shrink-0`}>
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-black/15" />
                  <div className="text-[7px] text-white/30 tracking-widest font-mono truncate">COVER</div>
                  <div className="text-[8px] font-bold text-white leading-tight line-clamp-3 pl-1.5">
                    {activeBook.title}
                  </div>
                  <div className="text-[7px] text-white/50 pl-1.5 truncate">
                    {activeBook.author}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded font-mono">
                      {activeBook.genre}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {activeBook.publicationYear}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-light text-white tracking-tight">
                    {activeBook.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    by <span className="text-zinc-200 font-medium">{activeBook.author}</span>
                  </p>
                </div>
              </div>

              {/* Header metrics */}
              <div className="flex gap-4 items-center self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-zinc-900 pt-4 sm:pt-0">
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-0.5">Rating Score</div>
                  <div className="flex items-center gap-1 text-white">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-mono text-sm font-bold text-emerald-400">{activeBook.rating}</span>
                    <span className="text-[10px] text-zinc-600">/5</span>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-zinc-800 hidden sm:block" />
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-0.5">Verdict</div>
                  <span className={`text-xs font-bold tracking-wider uppercase ${
                    activeBook.verdict.verdict === "Read Immediately" || activeBook.verdict.verdict === "Highly Recommended"
                      ? "text-emerald-400"
                      : activeBook.verdict.verdict === "Worth Reading"
                      ? "text-amber-400"
                      : "text-zinc-400"
                  }`}>
                    {activeBook.verdict.verdict}
                  </span>
                </div>
              </div>
            </div>

            {/* Structured Navigation with strictly 5 tabs */}
            <div className="flex border-b border-zinc-900 overflow-x-auto gap-2 pb-px scrollbar-none">
              {[
                { id: "overview", label: "Overview", icon: BookOpen },
                { id: "reviews", label: "Reviews", icon: MessageSquare },
                { id: "ideas", label: activeBook.isFiction ? "Themes & Symbols" : "Key Ideas", icon: Layers },
                { id: "summary", label: "Detailed Summary", icon: FileText },
                { id: "share", label: "Share", icon: Share2 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" 
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB OUTLET CONTENT */}
            <div className="space-y-6">

              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 flex items-center gap-3">
                      <BookMarked className="w-5 h-5 text-zinc-500" />
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">Pages</span>
                        <span className="text-xs font-medium text-zinc-200">
                          {activeBook.numberOfPages ? `${activeBook.numberOfPages} pages` : "Information not available."}
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 flex items-center gap-3">
                      <Gauge className="w-5 h-5 text-zinc-500" />
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">Difficulty</span>
                        <span className="text-xs font-medium text-zinc-200">
                          {activeBook.readingDifficulty || "Information not available."}
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-zinc-500" />
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">Est. Reading Time</span>
                        <span className="text-xs font-medium text-zinc-200">
                          {activeBook.estimatedReadingTime || "Information not available."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2-3 Paragraph Summary */}
                  <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-400 mb-3 font-mono font-bold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Brief Synopsis
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                      {activeBook.shortSummary}
                    </p>
                  </div>

                  {/* Key Topics Covered */}
                  <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-400 mb-4 font-mono font-bold">
                      Key Topics Covered
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {activeBook.keyTopicsCovered.map((topic, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-zinc-900 text-zinc-300 border border-zinc-800 px-3.5 py-1.5 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verdict & Balanced Evaluation */}
                  <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-400 mb-4 font-mono font-bold">
                      Evaluating the Value
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 space-y-1">
                        <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> Strengths
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-[11px]">
                          {activeBook.verdict.strengths}
                        </p>
                      </div>

                      <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 space-y-1">
                        <div className="text-rose-400 font-semibold flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 rotate-180" /> Limitations
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-[11px]">
                          {activeBook.verdict.limitations}
                        </p>
                      </div>

                      <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-850 space-y-1">
                        <div className="text-zinc-300 font-semibold flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" /> Overall Value
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-[11px]">
                          {activeBook.verdict.overallValue}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grounded Source Citations */}
                  {citations.length > 0 && (
                    <div className="bg-zinc-950/20 border border-zinc-900 p-4 rounded-xl text-[11px] text-zinc-500">
                      <span className="font-mono block mb-2">VERIFICATION SOURCES:</span>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {citations.map((cite, idx) => (
                          <a 
                            key={idx} 
                            href={cite.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-zinc-400 hover:text-emerald-400 flex items-center gap-1 underline underline-offset-2"
                          >
                            <span>{cite.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Sentiment Metric Row */}
                  <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                        Overall Reader Sentiment
                      </h4>
                      <p className="text-xl font-light text-white tracking-tight">
                        {activeBook.reviews.overallSentiment || "Mostly Positive"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-bold">
                        ★ {activeBook.rating} Average
                      </span>
                    </div>
                  </div>

                  {/* loved vs criticisms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                      <h4 className="text-xs font-semibold text-emerald-400 mb-3 tracking-wide">
                        What Readers Loved
                      </h4>
                      <ul className="space-y-2.5">
                        {activeBook.reviews.whatReadersLoved.map((loved, idx) => (
                          <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{loved}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-500/5 p-5 rounded-2xl border border-rose-500/10">
                      <h4 className="text-xs font-semibold text-rose-400 mb-3 tracking-wide">
                        Common Criticisms
                      </h4>
                      <ul className="space-y-2.5">
                        {activeBook.reviews.commonCriticisms.map((crit, idx) => (
                          <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-950/50 p-5 rounded-2xl border border-zinc-900 space-y-2">
                      <div className="text-[10px] text-emerald-500 font-mono uppercase font-bold">
                        Representative Positive Review
                      </div>
                      <p className="text-xs text-zinc-300 italic leading-relaxed">
                        &ldquo;{activeBook.reviews.positiveReviewHighlight}&rdquo;
                      </p>
                    </div>

                    <div className="bg-zinc-950/50 p-5 rounded-2xl border border-zinc-900 space-y-2">
                      <div className="text-[10px] text-rose-400 font-mono uppercase font-bold">
                        Representative Critical Review
                      </div>
                      <p className="text-xs text-zinc-300 italic leading-relaxed">
                        &ldquo;{activeBook.reviews.criticalReviewHighlight}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Balanced Reader Take */}
                  <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-400 mb-2 font-mono font-bold">
                      Balanced Reader Take
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {activeBook.reviews.balancedReaderTake}
                    </p>
                  </div>

                </div>
              )}

              {/* KEY IDEAS TAB */}
              {activeTab === "ideas" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="mb-2">
                    <h3 className="text-sm font-light text-white">
                      {activeBook.isFiction 
                        ? "Major themes, character dynamics, and literary symbolism" 
                        : "Fundamental insights, frameworks, and actionable concepts"}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {activeBook.keyIdeas.map((idea, idx) => {
                      const isExpanded = expandedIdeaIdx === idx;
                      return (
                        <div 
                          key={idx} 
                          className="bg-zinc-950/50 border border-zinc-900 rounded-xl overflow-hidden transition-all duration-200"
                        >
                          <button
                            onClick={() => setExpandedIdeaIdx(isExpanded ? null : idx)}
                            className="w-full text-left p-4 flex justify-between items-center gap-4 hover:bg-zinc-900/20 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                                0{idx + 1}
                              </span>
                              <h4 className="text-xs font-semibold text-zinc-200 tracking-tight">
                                {idea.title}
                              </h4>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="p-4 pt-1 border-t border-zinc-900/60 text-xs space-y-3.5 bg-zinc-950/80">
                              <div>
                                <span className="text-[10px] uppercase text-zinc-500 font-mono block mb-1">Concept Explanation</span>
                                <p className="text-zinc-300 leading-relaxed">
                                  {idea.explanation}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-850">
                                  <span className="text-[10px] uppercase text-zinc-400 font-semibold block mb-1">Why It Matters</span>
                                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                                    {idea.whyItMatters}
                                  </p>
                                </div>

                                <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-850">
                                  <span className="text-[10px] uppercase text-zinc-400 font-semibold block mb-1">
                                    {activeBook.isFiction ? "Illustration / Scenario" : "Real-World Application"}
                                  </span>
                                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                                    {idea.exampleOrApplication}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DETAILED SUMMARY TAB */}
              {activeTab === "summary" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900">
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {activeBook.detailedSummary.title || "Comprehensive Book Summary"}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mb-6">
                      A detailed breakdown of key chapters, narrative arcs, or framework parts.
                    </p>

                    <div className="space-y-6">
                      {activeBook.detailedSummary.sections.map((section, idx) => (
                        <div 
                          key={idx} 
                          className="border-l-2 border-emerald-500/20 hover:border-emerald-500 pl-4 py-1.5 transition-colors"
                        >
                          <h4 className="text-xs font-semibold text-white mb-2">
                            {section.heading}
                          </h4>
                          <p className="text-xs text-zinc-450 leading-relaxed whitespace-pre-line">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SHARE TAB */}
              {activeTab === "share" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Quotes Block */}
                  {activeBook.shareAssets.quotesAndTakeaways && activeBook.shareAssets.quotesAndTakeaways.length > 0 && (
                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900">
                      <h4 className="text-xs uppercase tracking-wider text-zinc-400 mb-4 font-mono font-bold flex items-center gap-1.5">
                        <Quote className="w-4 h-4 text-emerald-400" /> Key Sticky Quotes & Takeaways
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeBook.shareAssets.quotesAndTakeaways.map((quote, idx) => (
                          <div 
                            key={idx} 
                            className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 relative pl-9 text-xs group"
                          >
                            <Quote className="w-4 h-4 text-emerald-500/20 absolute left-3.5 top-4" />
                            <p className="italic text-zinc-300 leading-relaxed">
                              &ldquo;{quote}&rdquo;
                            </p>
                            <button
                              onClick={() => copyText(quote, `quote-${idx}`)}
                              className="absolute top-2 right-2 text-zinc-500 hover:text-white p-1 rounded transition-colors bg-zinc-950/60 opacity-0 group-hover:opacity-100 cursor-pointer"
                              title="Copy Quote"
                            >
                              {copiedId === `quote-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* social feeds templates */}
                  <div className="space-y-4">
                    
                    {/* LinkedIn */}
                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900 space-y-3 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-[#0a66c2] flex items-center gap-1.5">
                          LinkedIn Professional Digest
                        </span>
                        <button
                          onClick={() => copyText(activeBook.shareAssets.linkedInPost, "linkedin")}
                          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
                        >
                          {copiedId === "linkedin" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy post</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 whitespace-pre-line font-mono select-all">
                        {activeBook.shareAssets.linkedInPost}
                      </p>
                    </div>

                    {/* Instagram Slides */}
                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                          Instagram Carousel Slides
                        </span>
                        <button
                          onClick={() => copyText(activeBook.shareAssets.instagramCarousel.join("\n\n"), "instagram")}
                          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
                        >
                          {copiedId === "instagram" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy all slides</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {activeBook.shareAssets.instagramCarousel.map((slide, idx) => (
                          <div key={idx} className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 flex flex-col justify-between min-h-[110px]">
                            <span className="text-[10px] text-zinc-500 font-mono font-bold">SLIDE {idx + 1}</span>
                            <p className="text-xs text-zinc-300 mt-2 font-light">
                              {slide}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                          WhatsApp Status Series
                        </span>
                        <button
                          onClick={() => copyText(activeBook.shareAssets.whatsAppStatus.join("\n\n---\n\n"), "whatsapp")}
                          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
                        >
                          {copiedId === "whatsapp" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy updates</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="space-y-3 text-xs text-zinc-300">
                        {activeBook.shareAssets.whatsAppStatus.map((status, idx) => (
                          <div key={idx} className="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-900 font-mono">
                            <span className="text-[9px] text-zinc-500 block mb-1">PART {idx + 1}</span>
                            {status}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Clean Premium Footer */}
      <footer className="border-t border-zinc-900/60 bg-[#07070a] py-6 text-center text-[11px] text-zinc-500 font-mono mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Book Explorer. All rights reserved.</p>
          <div className="flex gap-6">
            <span>CONSUMER_EDITION</span>
            <span>SYSTEM_LIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
