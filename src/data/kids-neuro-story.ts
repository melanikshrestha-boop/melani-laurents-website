/**
 * Story pages for the interactive kids neuroscience book.
 * Each page is one "turn" of the book when a key is pressed or the screen is tapped.
 */

export type KidsStoryPage = {
  id: string; // unique name for this page
  chapter: string; // short chapter label kids can read
  title: string; // big headline on the page
  story: string; // main story paragraph (plain English)
  fact: string; // tiny real brain fact, still kid-friendly
  emoji: string; // big visual on the page
  bg: string; // soft background color
  accent: string; // accent color for decorations
};

/** Full story: Luna discovers how her brain works, one page at a time. */
export const kidsNeuroStory: KidsStoryPage[] = [
  {
    id: "cover",
    chapter: "The beginning",
    title: "Luna and the Tiny Spark",
    story:
      "Once upon a time, there was a curious kid named Luna. She loved asking questions about everything — especially the squishy, amazing thing inside her head. Press any key (or tap the page) to turn the book…",
    fact: "Your brain is the boss of your body — and it never stops learning.",
    emoji: "📖✨",
    bg: "#fff4e0",
    accent: "#f4a261",
  },
  {
    id: "wonder",
    chapter: "Chapter 1",
    title: "A soft little world",
    story:
      "Luna closed her eyes and imagined she could shrink, shrink, shrink — until she was small enough to step inside her own brain. It was not dark and scary. It was warm, sparkly, and full of little roads of light.",
    fact: "Your brain sits safely inside your skull, like a treasure in a hard box.",
    emoji: "🧠💫",
    bg: "#e8f4ff",
    accent: "#4cc9f0",
  },
  {
    id: "neurons",
    chapter: "Chapter 2",
    title: "Meet the brain cells",
    story:
      "Everywhere Luna looked, she saw friendly star-shaped creatures waving. “We are neurons!” they cheered. “We are the brain’s messengers. There are billions of us — more than stars you can count on a clear night!”",
    fact: "Neurons are special cells that send messages so you can think, move, and feel.",
    emoji: "⭐🧬",
    bg: "#f3e8ff",
    accent: "#9b5de5",
  },
  {
    id: "spark",
    chapter: "Chapter 3",
    title: "The tiny spark",
    story:
      "One neuron winked. “Watch this!” A tiny golden spark zipped down a long arm like a lightning race. “That’s an electric signal,” said the neuron. “Every thought begins with a spark just like me.”",
    fact: "Brain messages travel as tiny bursts of electricity — super fast!",
    emoji: "⚡💛",
    bg: "#fff8e1",
    accent: "#ffd166",
  },
  {
    id: "synapse",
    chapter: "Chapter 4",
    title: "The jump across the gap",
    story:
      "The spark reached a tiny gap between two neurons. It didn’t stop. It jumped! Little chemical messengers floated across like fireflies, waking up the next neuron. “That gap is a synapse,” whispered Luna. “What a clever bridge!”",
    fact: "A synapse is the tiny space where one neuron talks to the next.",
    emoji: "🌉🔮",
    bg: "#e8fff3",
    accent: "#06d6a0",
  },
  {
    id: "senses",
    chapter: "Chapter 5",
    title: "How the world comes in",
    story:
      "Suddenly Luna heard music, smelled cookies, and felt a soft blanket. “Your eyes, ears, nose, tongue, and skin send signals to your brain,” said a neuron guide. “Then your brain turns those signals into the world you know.”",
    fact: "Your senses collect clues; your brain builds the full picture.",
    emoji: "👀👂",
    bg: "#ffe8f0",
    accent: "#ef476f",
  },
  {
    id: "feelings",
    chapter: "Chapter 6",
    title: "Feelings have a home too",
    story:
      "Luna found a cozy room glowing pink and blue. Happy, brave, shy, and excited feelings danced like weather inside her. “Feelings are real brain messages,” said her guide. “They help keep you safe and help you care about others.”",
    fact: "Emotions are part of how your brain understands what matters.",
    emoji: "💗🌈",
    bg: "#ffeaf4",
    accent: "#ff6b9d",
  },
  {
    id: "memory",
    chapter: "Chapter 7",
    title: "The memory library",
    story:
      "Next came a huge library with glowing books. One book said “First bike ride.” Another said “Grandma’s soup.” “When you practice or care about something,” explained a librarian neuron, “we store it carefully so you can find it later.”",
    fact: "Memories get stronger when you sleep, play, and practice.",
    emoji: "📚🔑",
    bg: "#eef2ff",
    accent: "#4361ee",
  },
  {
    id: "pathways",
    chapter: "Chapter 8",
    title: "Practice builds roads",
    story:
      "Luna saw thin paths grow thicker every time someone practiced piano, reading, or kindness. “The more you use a pathway,” said the neurons, “the easier it gets. That is how you learn anything new!”",
    fact: "This is called neuroplasticity — your brain can change and grow with practice.",
    emoji: "🛤️🌱",
    bg: "#e8ffe8",
    accent: "#2a9d8f",
  },
  {
    id: "sleep",
    chapter: "Chapter 9",
    title: "Nighttime brain magic",
    story:
      "The lights dimmed. Soft cleaners floated through, sweeping away the day’s leftover mess. “While you sleep,” they hummed, “we sort memories and rest your busy mind. Sleep is brain superpower fuel.”",
    fact: "Sleep helps your brain remember and feel ready for tomorrow.",
    emoji: "😴🌙",
    bg: "#1b1f3b",
    accent: "#cddafd",
  },
  {
    id: "kindness",
    chapter: "Chapter 10",
    title: "Brains love kindness",
    story:
      "Luna watched sparks leap faster when someone shared, helped, or said something kind. “Being kind is not only good for friends,” smiled her guide. “It helps your brain feel calm and strong too.”",
    fact: "Kindness and connection help brains feel safer and happier.",
    emoji: "🤝💛",
    bg: "#fff0e6",
    accent: "#e76f51",
  },
  {
    id: "you",
    chapter: "The end… or is it?",
    title: "Your brain is amazing",
    story:
      "Luna grew back to kid-size, eyes wide with wonder. “I carry a whole universe in my head,” she whispered. And so do you. Every key you press, every question you ask, every dream you chase — your brain is learning with you.",
    fact: "Scientists still have so much to discover about the brain — maybe you will help!",
    emoji: "🌟👧",
    bg: "#fdf6e3",
    accent: "#e9c46a",
  },
  {
    id: "again",
    chapter: "Play again",
    title: "Ready for another adventure?",
    story:
      "Press any key (or tap the page) to start Luna’s story from the beginning. Or close this book and tell a friend one new thing you learned about the brain today!",
    fact: "Teaching someone else is one of the best ways to remember.",
    emoji: "🔁🧠",
    bg: "#e0f7fa",
    accent: "#00b4d8",
  },
];

export const kidsStoryPageCount = kidsNeuroStory.length;
