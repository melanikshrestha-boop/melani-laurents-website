/**
 * Full story for the interactive kids neuroscience book.
 * Every keyboard press (or tap) turns one page of Luna’s adventure.
 */

export type KidsStoryPage = {
  id: string; // machine name for art + night mode
  chapter: string; // “Chapter 3” style label
  title: string; // big title on the right page
  lines: string[]; // story lines that fade in one by one
  fact: string; // true brain fact in kid words
  factTitle: string; // short label on the fact sticker
  bgFrom: string; // gradient start color behind the book
  bgTo: string; // gradient end color
  accent: string; // gold / pink / purple accents
  ink: string; // main text color
  night?: boolean; // dark sky chapter
  scene: // which custom drawing to show
    | "cover"
    | "shrink"
    | "neurons"
    | "spark"
    | "synapse"
    | "senses"
    | "feelings"
    | "memory"
    | "pathways"
    | "sleep"
    | "kindness"
    | "hero"
    | "again";
};

/** Luna’s whole adventure — longer, warmer, more “story” than a list of facts. */
export const kidsNeuroStory: KidsStoryPage[] = [
  {
    id: "cover",
    chapter: "Open me",
    title: "Luna and the Tiny Spark",
    lines: [
      "This is a magic brain book.",
      "Every time you press a key — any key at all — the page turns.",
      "Ready? Press something on the keyboard… or tap the book.",
    ],
    fact: "Your brain is learning right now, just by reading this.",
    factTitle: "Secret start",
    bgFrom: "#2a1f4d",
    bgTo: "#ff8fab",
    accent: "#ffd166",
    ink: "#fff8f0",
    scene: "cover",
  },
  {
    id: "wonder",
    chapter: "Chapter 1",
    title: "The girl who asked why",
    lines: [
      "Luna asked a thousand whys a day.",
      "Why is the sky blue? Why do hugs feel warm? Why do dreams feel so real?",
      "One night she asked the biggest why of all: “Why do I have a brain?”",
      "The air shimmered… and a tiny golden spark answered.",
    ],
    fact: "Kids ask more questions than almost anyone — and that grows the brain.",
    factTitle: "Curious minds",
    bgFrom: "#1d3557",
    bgTo: "#a8dadc",
    accent: "#f4a261",
    ink: "#f8f4ef",
    scene: "shrink",
  },
  {
    id: "enter",
    chapter: "Chapter 2",
    title: "Smaller than a whisper",
    lines: [
      "“Hold on,” giggled the spark. Luna shrank… and shrank… and shrank.",
      "She landed on a soft glowing path inside her own head.",
      "It wasn’t scary. It was a city of light — warm, buzzing, alive.",
      "“Welcome,” said the spark, “to the place where all your thoughts are born.”",
    ],
    fact: "Your brain is protected by your skull, like treasure in a strong box.",
    factTitle: "Safe home",
    bgFrom: "#3d348b",
    bgTo: "#7678ed",
    accent: "#f7b801",
    ink: "#fff8ff",
    scene: "shrink",
  },
  {
    id: "neurons",
    chapter: "Chapter 3",
    title: "The star people",
    lines: [
      "Everywhere Luna looked, star-shaped friends waved from their posts.",
      "“We are neurons!” they sang. “Brain cells! Messengers! Team Think!”",
      "There were billions of them — more than stars Luna could count outside.",
      "Each one waited for a job: a word, a step, a laugh, a memory.",
    ],
    fact: "Neurons talk so you can move, feel, remember, and invent ideas.",
    factTitle: "Brain cells",
    bgFrom: "#5a189a",
    bgTo: "#c77dff",
    accent: "#ffe66d",
    ink: "#fff7ff",
    scene: "neurons",
  },
  {
    id: "spark",
    chapter: "Chapter 4",
    title: "Zip! goes the spark",
    lines: [
      "One neuron winked. “Want to see a thought start?”",
      "A golden spark raced down a long arm like a tiny lightning race.",
      "Whoosh — past branches, past bridges, faster than a blink.",
      "“That’s electricity,” whispered the spark. “Your ideas are electric.”",
    ],
    fact: "Brain messages travel as tiny bursts of electricity — super fast!",
    factTitle: "Electric ideas",
    bgFrom: "#3a0ca3",
    bgTo: "#f72585",
    accent: "#ffd60a",
    ink: "#fff8e7",
    scene: "spark",
  },
  {
    id: "synapse",
    chapter: "Chapter 5",
    title: "The brave little jump",
    lines: [
      "The spark reached a tiny gap between two neurons.",
      "It didn’t fall. It jumped — like a firefly leaping a river.",
      "Soft chemical messengers floated across and woke the next neuron.",
      "“That gap is a synapse,” said Luna. “A tiny bridge for talking.”",
    ],
    fact: "A synapse is the space where one brain cell talks to the next.",
    factTitle: "Tiny bridges",
    bgFrom: "#0077b6",
    bgTo: "#90e0ef",
    accent: "#06d6a0",
    ink: "#06283d",
    scene: "synapse",
  },
  {
    id: "senses",
    chapter: "Chapter 6",
    title: "Five doors to the world",
    lines: [
      "Suddenly: cookie smell. Soft music. A warm blanket. Bright color.",
      "“Your eyes, ears, nose, tongue, and skin are doors,” said a guide neuron.",
      "“They send clues. Your brain builds the whole picture — the whole world.”",
      "Luna spun around. “So I’m not just looking… my brain is painting!”",
    ],
    fact: "Your senses collect clues; your brain builds what you experience.",
    factTitle: "Senses",
    bgFrom: "#ff6b6b",
    bgTo: "#ffe66d",
    accent: "#4ecdc4",
    ink: "#2b2118",
    scene: "senses",
  },
  {
    id: "feelings",
    chapter: "Chapter 7",
    title: "The weather inside",
    lines: [
      "They entered a room of pink storms and blue calm skies.",
      "Happy, brave, shy, and excited danced like weather.",
      "“Feelings are real brain messages,” said the guide gently.",
      "“They keep you safe. They help you care. They are part of being you.”",
    ],
    fact: "Emotions help your brain know what matters and what to do next.",
    factTitle: "Feelings",
    bgFrom: "#ff85a1",
    bgTo: "#ffc2d1",
    accent: "#c9184a",
    ink: "#4a1942",
    scene: "feelings",
  },
  {
    id: "memory",
    chapter: "Chapter 8",
    title: "The glowing library",
    lines: [
      "Next: a library with books that glowed when Luna touched them.",
      "One said First Bike Ride. Another said Grandma’s Soup.",
      "“When you care, practice, or play,” said the librarian neuron,",
      "“we file the memory carefully — so you can find it tomorrow.”",
    ],
    fact: "Memories get stronger when you sleep, play, and practice.",
    factTitle: "Memory",
    bgFrom: "#14213d",
    bgTo: "#4361ee",
    accent: "#fca311",
    ink: "#edf2f4",
    scene: "memory",
  },
  {
    id: "pathways",
    chapter: "Chapter 9",
    title: "Roads that grow",
    lines: [
      "Luna watched thin silver paths thicken into bright highways.",
      "Piano practice. Reading. Kind words. Each one built a stronger road.",
      "“The more you use a path,” cheered the neurons, “the easier it gets!”",
      "Luna grinned. “So my brain can change? Forever?” “Yes,” they said. “Always.”",
    ],
    fact: "Neuroplasticity means your brain can grow new skills with practice.",
    factTitle: "Practice power",
    bgFrom: "#1b4332",
    bgTo: "#95d5b2",
    accent: "#d8f3dc",
    ink: "#081c15",
    scene: "pathways",
  },
  {
    id: "sleep",
    chapter: "Chapter 10",
    title: "Nighttime helpers",
    lines: [
      "The lights dimmed. Soft cleaners floated like sleepy clouds.",
      "They swept leftover day-mess and sorted the day’s best memories.",
      "“Sleep is not nothing,” they hummed. “Sleep is brain superpower fuel.”",
      "Luna yawned… and the spark tucked a star-blanket around her thoughts.",
    ],
    fact: "Sleep helps your brain remember and feel ready for tomorrow.",
    factTitle: "Sleep magic",
    bgFrom: "#0b1026",
    bgTo: "#312e81",
    accent: "#c7d2fe",
    ink: "#eef2ff",
    night: true,
    scene: "sleep",
  },
  {
    id: "kindness",
    chapter: "Chapter 11",
    title: "Sparks of kindness",
    lines: [
      "When someone shared a toy, sparks leapt farther and brighter.",
      "When someone said “You can do it,” whole neighborhoods of neurons lit up.",
      "“Kindness is brain medicine,” smiled the guide.",
      "“It helps friends — and it helps your own mind feel safe and strong.”",
    ],
    fact: "Connection and kindness help brains feel safer and happier.",
    factTitle: "Kind brains",
    bgFrom: "#9d0208",
    bgTo: "#faa307",
    accent: "#ffba08",
    ink: "#fff3e0",
    scene: "kindness",
  },
  {
    id: "you",
    chapter: "Chapter 12",
    title: "A universe in your head",
    lines: [
      "Luna grew back to kid-size, eyes full of stars.",
      "“I carry a whole universe in my head,” she whispered.",
      "And so do you — every question, dream, and brave try.",
      "Your brain is still writing its story. You hold the pen.",
    ],
    fact: "Scientists still have so much to learn — maybe you will help someday.",
    factTitle: "You",
    bgFrom: "#240046",
    bgTo: "#ff9e00",
    accent: "#ffd60a",
    ink: "#fff8e7",
    scene: "hero",
  },
  {
    id: "again",
    chapter: "The end · again",
    title: "Turn the key once more",
    lines: [
      "Press any key to begin Luna’s adventure from the first page.",
      "Or tell a friend one new brain thing you learned today.",
      "Teaching someone else is a superpower too.",
      "The spark is waiting… whenever you’re ready.",
    ],
    fact: "Sharing what you learn helps your memory grow even stronger.",
    factTitle: "Play again",
    bgFrom: "#023e8a",
    bgTo: "#48cae4",
    accent: "#90e0ef",
    ink: "#caf0f8",
    scene: "again",
  },
];

export const kidsStoryPageCount = kidsNeuroStory.length;
