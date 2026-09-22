import { supabase } from "../lib/supabase";
import { PRESET_BOOKS, PresetBook } from "../data";
import { BookDetails, SearchSuggestion } from "../types";

/**
 * Transforms a Supabase row into the frontend BookDetails interface
 */
export function mapRowToBookDetails(row: any): BookDetails {
  return {
    title: row.title,
    author: row.author,
    publicationYear: row.publication_year,
    genre: row.genre,
    rating: Number(row.rating) || 0,
    numberOfPages: Number(row.number_of_pages) || 0,
    readingDifficulty: row.reading_difficulty || "Intermediate",
    estimatedReadingTime: row.estimated_reading_time || "",
    coverColor: row.cover_color || "from-zinc-800 to-zinc-950",
    shortSummary: row.short_summary || "",
    isFiction: Boolean(row.is_fiction),
    keyTopicsCovered: Array.isArray(row.key_topics_covered) ? row.key_topics_covered : [],
    verdict: row.verdict || {
      verdict: "Worth Reading",
      strengths: "",
      limitations: "",
      overallValue: ""
    },
    reviews: row.reviews || {
      overallSentiment: "Mostly Positive",
      whatReadersLoved: [],
      commonCriticisms: [],
      positiveReviewHighlight: "",
      criticalReviewHighlight: "",
      balancedReaderTake: ""
    },
    keyIdeas: Array.isArray(row.key_ideas) ? row.key_ideas : [],
    detailedSummary: row.detailed_summary || { title: "", sections: [] },
    shareAssets: row.share_assets || {
      linkedInPost: "",
      instagramCarousel: [],
      whatsAppStatus: [],
      quotesAndTakeaways: []
    }
  };
}

/**
 * Transforms a Supabase row into a PresetBook
 */
export function mapRowToPresetBook(row: any): PresetBook {
  return {
    id: row.slug || row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    year: row.publication_year,
    data: mapRowToBookDetails(row)
  };
}

/**
 * Fetches all available books from Supabase, falling back to local PRESET_BOOKS if offline or empty
 */
export async function fetchPresetBooks(): Promise<PresetBook[]> {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Supabase fetch books warning:", error.message);
      return PRESET_BOOKS;
    }

    if (data && data.length > 0) {
      return data.map(mapRowToPresetBook);
    }
  } catch (err) {
    console.warn("Supabase fetch error, using local presets:", err);
  }

  return PRESET_BOOKS;
}

/**
 * Searches books in Supabase matching the query by title, author, or genre
 */
export async function searchBooksInSupabase(query: string): Promise<SearchSuggestion[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const { data, error } = await supabase
      .from("books")
      .select("title, author, genre, publication_year")
      .or(`title.ilike.%${cleanQuery}%,author.ilike.%${cleanQuery}%,genre.ilike.%${cleanQuery}%`)
      .limit(5);

    if (error) {
      console.warn("Supabase search warning:", error.message);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((b: any) => ({
        title: b.title,
        author: b.author,
        genre: b.genre,
        year: b.publication_year
      }));
    }
  } catch (err) {
    console.warn("Supabase search error:", err);
  }

  return [];
}

/**
 * Finds a book in Supabase by title or slug
 */
export async function findBookByTitleOrSlug(titleOrSlug: string): Promise<BookDetails | null> {
  const query = titleOrSlug.trim().toLowerCase();
  if (!query) return null;

  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .or(`title.ilike.${query},slug.eq.${query}`)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return mapRowToBookDetails(data);
    }
  } catch (err) {
    console.warn("Supabase lookup error:", err);
  }

  // Fallback to local presets
  const localMatch = PRESET_BOOKS.find(
    b => b.title.toLowerCase() === query || b.id.toLowerCase() === query
  );

  return localMatch ? localMatch.data : null;
}
