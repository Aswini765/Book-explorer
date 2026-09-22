import { BookDetails } from "./types";

export interface PresetBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: string;
  data: BookDetails;
}

export const PRESET_BOOKS: PresetBook[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-help, Personal Growth",
    year: "2018",
    data: {
      title: "Atomic Habits",
      author: "James Clear",
      publicationYear: "2018",
      genre: "Self-help, Productivity, Psychology",
      rating: 4.8,
      numberOfPages: 320,
      readingDifficulty: "Beginner",
      estimatedReadingTime: "5 hours",
      coverColor: "from-amber-600 to-red-800",
      shortSummary: "Atomic Habits is an extraordinarily practical guide on how to design systems that make building good habits and breaking bad ones nearly effortless. Grounded in cognitive and behavioral psychology, James Clear argues that small, incremental 1% daily changes compound over time into massive personal transformations. Rather than relying on fleeting willpower or setting abstract, lofty goals, readers are taught to focus on identity-based change and systemic environment design.",
      keyTopicsCovered: [
        "The compounding power of 1% daily improvements",
        "Systems-first thinking vs. Goal-driven failure traps",
        "Identity-based behavior change (who you wish to become)",
        "The Four Laws of Behavior Change (Obvious, Attractive, Easy, Satisfying)",
        "Environment design and removing hidden friction"
      ],
      verdict: {
        verdict: "Read Immediately",
        strengths: "Incredibly actionable with direct, real-world blueprints. Uses highly memorable frameworks (e.g., the Two-Minute Rule, Habit Stacking) and combines scientific research with direct anecdotes.",
        limitations: "Many concepts are synthesized from prior foundational works (such as Charles Duhigg's 'The Power of Habit' or BJ Fogg's research) rather than entirely novel proprietary research.",
        overallValue: "An absolute gold standard for behavioral change. It stands out by translating complex psychological research into direct scripts you can immediately start executing tonight."
      },
      reviews: {
        overallSentiment: "Highly Praised",
        whatReadersLoved: [
          "Extremely practical formatting with clear chapter summaries",
          "The 'Two-Minute Rule' for beating chronic procrastination",
          "Deep shift from setting goals to constructing automated daily processes"
        ],
        commonCriticisms: [
          "Reads like a collection of organized blog posts",
          "Anecdotes are occasionally simplified to neatly fit the rules"
        ],
        positiveReviewHighlight: "This is easily the most practical book I have ever read. It doesn't just explain why habits exist, it gives you a literal manual on how to rebuild your environment and daily behavior.",
        criticalReviewHighlight: "While the advice is solid, readers who are already deeply familiar with cognitive science or books like 'The Power of Habit' won't find many brand-new theories here.",
        balancedReaderTake: "An exceptionally structured, zero-fluff manual. Even if you only implement a fraction of the advice, the compounding return on your focus is massive."
      },
      isFiction: false,
      keyIdeas: [
        {
          title: "Systems Over Goals",
          explanation: "Goals define the results you want to achieve, whereas systems are the processes that lead to those results. Winners and losers frequently share the identical goals; it is their systems that distinguish them.",
          whyItMatters: "Focusing solely on goals creates a temporary 'yo-yo' effect where motivation collapses once the milestone is met.",
          exampleOrApplication: "If you are a writer, your goal is to write a book. Your system is writing 500 words every single morning at 8:00 AM."
        },
        {
          title: "Identity-Based Change",
          explanation: "True behavior change is not about what you want to achieve (outcomes), but who you want to become (identity). Actions naturally flow from your core beliefs about yourself.",
          whyItMatters: "If you try to change habits without changing underlying beliefs, the behavior change is fragile and short-lived.",
          exampleOrApplication: "When offered a cigarette, instead of saying 'No thanks, I'm trying to quit,' say 'No thanks, I'm not a smoker.'"
        },
        {
          title: "The 2-Minute Rule",
          explanation: "When starting a new habit, it should take less than two minutes to do. The goal is to master the art of showing up before optimizing.",
          whyItMatters: "Prevents burnout and mental friction by making the initial barrier to entry practically non-existent.",
          exampleOrApplication: "Instead of 'Do 30 minutes of yoga,' scale it down to 'Roll out my yoga mat.'"
        },
        {
          title: "Habit Stacking",
          explanation: "A strategy where you pair a new habit with an existing established habit that you already perform automatically every single day.",
          whyItMatters: "Uses the established neural pathways of your current routine as an immediate physical trigger for the new behavior.",
          exampleOrApplication: "After I pour my morning coffee (current habit), I will write down three things I am grateful for (new habit)."
        }
      ],
      detailedSummary: {
        title: "The Ultimate Guide to Systemic Habits",
        sections: [
          {
            heading: "Part 1: The Foundations of Behavioral Compounding",
            content: "James Clear explains why small habits make a huge difference. He introduces the concept of behavioral compounding (1% improvements daily lead to being 37 times better in a year) and details the 'Plateau of Latent Potential'—the frustrating delay where habits show no visible progress before a sudden breakthrough."
          },
          {
            heading: "Part 2: The First and Second Laws (Obvious & Attractive)",
            content: "To build habits, you must design a clear environment. Clear teaches readers to make cues 'Obvious' using implementation intentions (Time + Location) and habit stacking. He then introduces 'Attractive' designs: temptation bundling (coupling what you want to do with what you need to do) and leveraging social influences, as we adopt habits of cultures where our desired behavior is the normal behavior."
          },
          {
            heading: "Part 3: The Third and Fourth Laws (Easy & Satisfying)",
            content: "To maintain habits, you must make them 'Easy' by reducing physical and mental friction, mastering the decisive moments of your day, and employing the Two-Minute Rule. Finally, to ensure the habit sticks, make it immediately 'Satisfying'. Use visual tracking (habit trackers) and establish accountability partners so that the immediate consequence of skipping is painful."
          }
        ]
      },
      shareAssets: {
        linkedInPost: "Success isn't a single massive transformation; it's the compounding output of tiny daily choices.\n\nIn 'Atomic Habits', James Clear shares a foundational quote:\n\n\"You do not rise to the level of your goals. You fall to the level of your systems.\"\n\nInstead of aiming for grand achievements, focus on optimizing your daily routine. If you get 1% better every day, that compounds to a 37x improvement in a single year.\n\nWhat is one micro-habit you're building today?",
        instagramCarousel: [
          "Identity-First Habits: Focus on who you want to become, not just what you want to achieve.",
          "The Two-Minute Rule: When starting a new habit, it should take less than 2 minutes to complete.",
          "Habit Stacking: Tie your new habit to something you already do every single day."
        ],
        whatsAppStatus: [
          "🚀 Real change doesn't come from giant leaps, but from 1% daily improvements. Optimize your systems!",
          "💡 'You do not rise to the level of your goals. You fall to the level of your systems.' — James Clear"
        ],
        quotesAndTakeaways: [
          "You do not rise to the level of your goals. You fall to the level of your systems.",
          "Every action you take is a vote for the type of person you wish to become.",
          "Be the designer of your world and not merely the consumer of it."
        ]
      }
    }
  },
  {
    id: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Fiction, Literary Drama",
    year: "1925",
    data: {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      publicationYear: "1925",
      genre: "Classic Fiction, American Literature",
      rating: 4.4,
      numberOfPages: 180,
      readingDifficulty: "Intermediate",
      estimatedReadingTime: "3.5 hours",
      coverColor: "from-emerald-800 to-zinc-905",
      shortSummary: "Set in the roaring twenties on Long Island, F. Scott Fitzgerald's masterpiece is a devastating critique of the American Dream, disillusionment, and social class. Narrated by Nick Carraway, a midwestern transplant, the story follows the mysterious millionaire Jay Gatsby and his obsessive love for the beautiful, wealthy Daisy Buchanan. It is an exquisitely written exploration of romantic obsession, social decay, and the unyielding weight of the past.",
      keyTopicsCovered: [
        "The corruption and artificiality of the American Dream",
        "Class division (Old Money vs. New Money vs. No Money)",
        "Obsessive romanticization of the past",
        "Disillusionment and moral hollowness of the upper class",
        "Memory, nostalgic yearning, and unavoidable tragedy"
      ],
      verdict: {
        verdict: "Read Immediately",
        strengths: "Some of the most beautiful, poetic prose in the history of the English language. Elegant and concise with heavy atmospheric descriptions and highly profound metaphors.",
        limitations: "Certain readers might find the characters unsympathetic or morally vapid, which is indeed Fitzgerald's central thematic critique.",
        overallValue: "A quintessential classic that remains profoundly relevant. It offers deep insights into greed, human obsession, and our collective struggle to escape our personal histories."
      },
      reviews: {
        overallSentiment: "Highly Praised",
        whatReadersLoved: [
          "Breathtakingly gorgeous prose and timeless lyrical style",
          "Rich, layered symbolism (such as the green light and Dr. Eckleburg)",
          "Devastating emotional depth and cultural accuracy of the Jazz Age"
        ],
        commonCriticisms: [
          "The plot is relatively slow-moving in the initial chapters",
          "Most characters are intentionally unlikable and superficial"
        ],
        positiveReviewHighlight: "A hauntingly beautiful tragedy about longing, loss, and the illusions we build. Fitzgerald's command over imagery and rhythm is unparalleled. Every word feels deliberate.",
        criticalReviewHighlight: "While stylistically stunning, the characters are incredibly shallow, selfish, and difficult to care for. It reads more like a critique of terrible rich people than an engaging adventure.",
        balancedReaderTake: "An essential masterpiece of literary art. It is a quick read that packs an immense thematic punch, delivering unforgettable lessons on obsession, class privilege, and nostalgia."
      },
      isFiction: true,
      keyIdeas: [
        {
          title: "The Green Light (Symbolism)",
          explanation: "Located at the end of Daisy's dock, the green light represents Gatsby's hopes and dreams for the future, specifically his obsessive desire to recapture the past and win back Daisy.",
          whyItMatters: "It symbolizes the universal human struggle: reaching out for an unattainable ideal that is already lost in the past.",
          exampleOrApplication: "Jay Gatsby stands on his lawn at night, stretching his arms toward the green light, mistaking a distant signal for a tangible promise of future happiness."
        },
        {
          title: "The Eyes of Dr. T.J. Eckleburg",
          explanation: "A fading billboard overlooking the desolate Valley of Ashes, the massive, spectacled eyes symbolize God looking down on a morally bankrupted American society driven purely by material wealth.",
          whyItMatters: "Highlights the loss of spiritual values and ethical boundaries in a hyper-consumerist and superficial era.",
          exampleOrApplication: "George Wilson looks out at the billboard in his grief, declaring to Myrtle that 'God sees everything' and cannot be fooled by lies."
        },
        {
          title: "The Illusion of Daisy Buchanan",
          explanation: "Daisy is not merely a woman, but a pristine ideal of high society, wealth, and elegance that Gatsby has constructed over five years. The real Daisy cannot possibly live up to Gatsby's colossal expectations.",
          whyItMatters: "Reveals the danger of romanticizing people or periods of our lives, creating expectations that reality is guaranteed to shatter.",
          exampleOrApplication: "Nick notices that during their reunion, Daisy falls short of Gatsby's dream not because of her own faults, but because of the colossal vitality of Gatsby's illusion."
        },
        {
          title: "Old Money vs. New Money (Class)",
          explanation: "The divide between East Egg (inherited aristocracy) and West Egg (recently wealthy). Despite his vast wealth, Gatsby is rejected by old money because of his lack of social lineage and connection.",
          whyItMatters: "Critiques the hypocrisy of class structures that pretend to be based on merit but are built on exclusive, inherited privilege.",
          exampleOrApplication: "Tom Buchanan exposes Gatsby's bootlegging background, re-establishing his social supremacy over Gatsby despite Gatsby's superior wealth and generosity."
        }
      ],
      detailedSummary: {
        title: "The Fall of a Romantic Dreamer",
        sections: [
          {
            heading: "Chapter 1-3: Introduction to Eggs and Extravagance",
            content: "Nick Carraway moves to West Egg, Long Island, next to a colossal mansion owned by the mysterious Jay Gatsby. Nick dines with his cousin Daisy and her arrogant husband Tom in East Egg, discovering Tom's affair. Soon, Nick is invited to one of Gatsby's legendary, lavish weekend parties, where he finally meets the elusive host."
          },
          {
            heading: "Chapter 4-6: The Reunion and Gatsby's Origins",
            content: "Gatsby reveals his past to Nick and requests that Nick arrange a surprise tea meeting with Daisy. When they reunite at Nick's house, Gatsby and Daisy rekindle their romance. Nick slowly uncovers the truth of Gatsby's origins: born James Gatz, a poor farm boy who refashioned himself into a wealthy gentleman solely to be worthy of Daisy."
          },
          {
            heading: "Chapter 7-9: Confrontation and Quiet Tragedy",
            content: "During a boiling hot afternoon in New York, Tom confronts Gatsby about his love for Daisy and his shady bootlegging business. Daisy, overwhelmed, retreats. On the drive back, Daisy (driving Gatsby's car) accidentally strikes and kills Tom's mistress, Myrtle. Seeking revenge, Myrtle's husband Wilson shoots Gatsby in his pool, then kills himself. Nick organizes Gatsby's lonely funeral and decides to return to the Midwest."
          }
        ]
      },
      shareAssets: {
        linkedInPost: "F. Scott Fitzgerald's 'The Great Gatsby' is more than a classic tragedy; it's a profound case study on expectations vs. reality.\n\nGatsby spent five years building a colossal illusion of Daisy. But as Nick Carraway observed, the real person can never match the colossal vitality of the dream.\n\nIn business and life, we often fall in love with an idealized version of a market, a product, or a career goal. \n\nAre you chasing a real, grounded path—or are you reaching for a green light on a dock that has already slipped into the past?",
        instagramCarousel: [
          "The Green Light: Gatsby's symbol of hope and romantic yearning for a past that was already gone.",
          "The Great Divide: East Egg vs. West Egg. How inherited privilege constructs invisible social barriers.",
          "The Illusion: The danger of romanticizing goals beyond their real-world capabilities."
        ],
        whatsAppStatus: [
          "🌊 'So we beat on, boats against the current, borne back ceaselessly into the past.' — F. Scott Fitzgerald",
          "💔 A haunting classic about what happens when our expectations of life exceed reality."
        ],
        quotesAndTakeaways: [
          "So we beat on, boats against the current, borne back ceaselessly into the past.",
          "There are only the pursued, the pursuing, the busy and the tired.",
          "They were careless people, Tom and Daisy—they smashed up things and creatures and then retreated back into their money."
        ]
      }
    }
  },
  {
    id: "the-lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    genre: "Business, Entrepreneurship",
    year: "2011",
    data: {
      title: "The Lean Startup",
      author: "Eric Ries",
      publicationYear: "2011",
      genre: "Business, Entrepreneurship, Management",
      rating: 4.5,
      numberOfPages: 336,
      readingDifficulty: "Intermediate",
      estimatedReadingTime: "5.5 hours",
      coverColor: "from-blue-600 to-indigo-850",
      shortSummary: "The Lean Startup introduces a revolutionary methodology for building new companies and launching new products under conditions of extreme uncertainty. Eric Ries advocates for a scientific approach to management, urging startups to build Minimum Viable Products (MVPs), test their assumptions through continuous experimentation, and rely on validated learning rather than traditional business plans and forecasting.",
      keyTopicsCovered: [
        "Validated learning through scientific experimentation",
        "The Build-Measure-Learn feedback loop",
        "Minimum Viable Products (MVPs) and avoiding waste",
        "Pivoting vs. Persevering based on actionable metrics",
        "Innovation accounting and avoiding vanity metrics"
      ],
      verdict: {
        verdict: "Highly Recommended",
        strengths: "Provides a brilliant, systematic blueprint for reducing startup failure rates. Highly analytical and structures the chaotic process of entrepreneurship into a repeatable science.",
        limitations: "Can be slightly dry or repetitive in its explanations. Many examples are heavily software-focused, making it slightly harder to apply to hardware or deep tech industries.",
        overallValue: "Essential reading for modern entrepreneurs, product managers, and business leaders looking to build products customers actually want without wasting resources."
      },
      reviews: {
        overallSentiment: "Highly Praised",
        whatReadersLoved: [
          "Clear definition and purpose of the Minimum Viable Product (MVP)",
          "Focus on validated learning over guessing or vanity metrics",
          "Actionable structure for deciding when to pivot"
        ],
        commonCriticisms: [
          "The book could easily be summarized in a long essay",
          "Includes too many corporate anecdotes towards the second half"
        ],
        positiveReviewHighlight: "This book completely transformed how I build software. Instead of spending months building a feature no one wants, Ries showed us how to test assumptions instantly.",
        criticalReviewHighlight: "An excellent concept, but highly repetitive. Once you understand the Build-Measure-Learn loop and the MVP, the rest of the book feels like filler.",
        balancedReaderTake: "A highly influential business text. While it could be shorter, its core principles are absolutely mandatory for modern product design and business execution."
      },
      isFiction: false,
      keyIdeas: [
        {
          title: "Build-Measure-Learn",
          explanation: "The fundamental feedback loop of a startup. Startups must minimize the total time it takes to go through this loop: turn ideas into products, measure customer response, and learn whether to pivot or persevere.",
          whyItMatters: "Speeds up development cycles and prevents companies from building products that nobody wants.",
          exampleOrApplication: "Deploying a simple mock landing page to measure click-through interest on a feature before writing a single line of backend code."
        },
        {
          title: "Minimum Viable Product (MVP)",
          explanation: "The simplest version of a product that allows the team to collect the maximum amount of validated learning about customers with the least amount of effort.",
          whyItMatters: "Saves massive engineering resources by testing core value hypotheses immediately with real users.",
          exampleOrApplication: "Dropbox starting with a simple explanatory video demonstration rather than building the complex sync architecture first."
        },
        {
          title: "Vanity Metrics vs. Actionable Metrics",
          explanation: "Vanity metrics (e.g., total registered users, page views) make you feel good but do not reflect real growth. Actionable metrics (e.g., cohort retention, active engagement) show real user behavior.",
          whyItMatters: "Relying on vanity metrics can trick a company into believing it is succeeding while it is actually failing.",
          exampleOrApplication: "Celebrating a million free app downloads (vanity) vs. analyzing why only 2% of those users return on day 7 (actionable)."
        },
        {
          title: "The Pivot",
          explanation: "A structured course correction designed to test a new fundamental hypothesis about the product, strategy, and engine of growth without changing the ultimate vision.",
          whyItMatters: "Allows startups to survive by recognizing when their current path is a dead end and systematically testing alternatives.",
          exampleOrApplication: "Instagram starting as a complex check-in app called Burbn, then pivoting to focus solely on photo sharing."
        }
      ],
      detailedSummary: {
        title: "The Science of Entrepreneurship",
        sections: [
          {
            heading: "Part 1: Vision & Steering",
            content: "Eric Ries defines what a startup is (an institution designed to create products under extreme uncertainty) and introduces the concept of 'Validated Learning'. Instead of measuring progress by shipped code, startups must measure progress by how much they have learned about solving customer problems."
          },
          {
            heading: "Part 2: Steer & Validate",
            content: "Ries deep dives into the mechanics of the Build-Measure-Learn loop. He covers how to establish a baseline of metrics, design effective Minimum Viable Products (MVPs), split-test variations with customers, and conduct a critical review meeting to decide whether to pivot the strategy or persevere."
          },
          {
            heading: "Part 3: Accelerate & Scale",
            content: "Details how to scale the organization. Ries explains the different 'Engines of Growth' (Sticky, Viral, and Paid), introduces the 'Five Whys' root-cause analysis tool, and demonstrates how to cultivate rapid innovation within large, established enterprise organizations."
          }
        ]
      },
      shareAssets: {
        linkedInPost: "Traditional business planning doesn't work under conditions of extreme uncertainty.\n\nIn 'The Lean Startup', Eric Ries argues that startups should be treated as scientific experiments:\n\n\"The only way to win is to learn faster than anyone else.\"\n\nInstead of wasting months building the perfect product in a vacuum, build a Minimum Viable Product (MVP), measure user behavior, and learn whether to pivot or persevere.\n\nHow fast is your feedback loop?",
        instagramCarousel: [
          "Build-Measure-Learn: The core feedback loop of rapid product discovery.",
          "MVP (Minimum Viable Product): Start small to maximize validated learning with minimal effort.",
          "Actionable Metrics: Focus on retention and engagement, not raw hits or registered users."
        ],
        whatsAppStatus: [
          "⚙️ Don't waste time building products nobody wants. Validate your assumptions fast with an MVP!",
          "📉 Vanity metrics lie. Look at retention and user behavior to gauge true growth."
        ],
        quotesAndTakeaways: [
          "The only way to win is to learn faster than anyone else.",
          "We must learn what customers really want, not what they say they want or what we think they should want.",
          "If you cannot fail, you cannot learn."
        ]
      }
    }
  }
];
