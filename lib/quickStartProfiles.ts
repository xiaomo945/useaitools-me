/**
 * Quick Start profile definitions.
 *
 * These live outside QuickStart.tsx on purpose. The component is a client
 * component that used to import the whole 548 KB tools.json just to look up
 * 16 tools by id; the server now resolves them and passes them down, so the
 * profile list has to be importable from a server component without dragging
 * the tool dataset (or React) along with it.
 */
export type QuickStartProfile = {
  label: string;
  emoji: string;
  description: string;
  toolIds: number[];
};

export const QUICK_START_PROFILES: Record<string, QuickStartProfile> = {
  creator: {
    label: 'Content Creator',
    emoji: '🎨',
    description: 'Video, image, and audio tools for creators',
    toolIds: [1, 8, 9, 12, 13], // Midjourney, ElevenLabs, Runway ML, Pika Labs, Suno AI
  },
  developer: {
    label: 'Developer',
    emoji: '💻',
    description: 'Code assistants and productivity tools',
    toolIds: [6, 7, 11, 14, 15], // ChatGPT, GitHub Copilot, Cursor, Tabnine, Obsidian Copilot
  },
  student: {
    label: 'Student',
    emoji: '📚',
    description: 'Writing and research tools for learning',
    toolIds: [5, 6, 10, 16, 17], // Notion AI, ChatGPT, Whisper, Jasper, Claude
  },
  marketer: {
    label: 'Marketer',
    emoji: '📊',
    description: 'Marketing copy and social media tools',
    toolIds: [5, 6, 16, 18, 19], // Notion AI, ChatGPT, Jasper, Adobe Firefly, Copy.ai
  },
};

/** Every tool id any profile can reference, deduplicated. */
export const QUICK_START_TOOL_IDS: number[] = [
  ...new Set(Object.values(QUICK_START_PROFILES).flatMap((p) => p.toolIds)),
];
