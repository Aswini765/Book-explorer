export interface KeyIdea {
  title: string;
  explanation: string;
  whyItMatters: string;
  exampleOrApplication: string;
}

export interface DetailedSection {
  heading: string;
  content: string;
}

export interface DetailedSummary {
  title: string;
  sections: DetailedSection[];
}

export interface ShareAssets {
  linkedInPost: string;
  instagramCarousel: string[]; // multiple slides
  whatsAppStatus: string[]; // multiple parts
  quotesAndTakeaways: string[];
}

export interface BookReviews {
  overallSentiment: string;
  whatReadersLoved: string[];
  commonCriticisms: string[];
  positiveReviewHighlight: string;
  criticalReviewHighlight: string;
  balancedReaderTake: string;
}

export interface BookVerdict {
  verdict: "Read Immediately" | "Highly Recommended" | "Worth Reading" | "Read Later" | "Skip";
  strengths: string;
  limitations: string;
  overallValue: string;
}

export interface BookDetails {
  title: string;
  author: string;
  publicationYear: string;
  genre: string;
  rating: number; // e.g. 4.6
  numberOfPages: number;
  readingDifficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedReadingTime: string;
  coverColor: string; // generated tailwind gradient/color e.g. "from-amber-600 to-red-700"
  
  shortSummary: string; // 2-3 paragraphs of introduction
  keyTopicsCovered: string[];
  verdict: BookVerdict;
  reviews: BookReviews;
  isFiction: boolean;
  keyIdeas: KeyIdea[];
  detailedSummary: DetailedSummary;
  shareAssets: ShareAssets;
}

export interface SearchSuggestion {
  title: string;
  author: string;
  genre: string;
  year: string;
}
