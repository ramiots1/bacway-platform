export type ContributionStatus = 'pending' | 'accepted' | 'rejected'
export type Division =
  | 'Mathematics'
  | 'Science'
  | 'Technical Mathematics'
  | 'Management & Economics'
  | 'Foreign Languages'
  | 'Literature & Philosophy'
  | 'Experimental Sciences'

export interface Contribution {
  id: string
  name: string
  email: string
  bacYear: number
  score: number
  division: Division
  driveLink: string
  description: string
  submittedAt: string
  status: ContributionStatus
  rejectionReason?: string
}

export interface Letter {
  id: string
  name: string
  email: string
  bacYear: number
  score: number
  division: Division
  content: string
  submittedAt: string
  status: ContributionStatus
  rejectionReason?: string
}

export interface User {
  id: string
  name: string
  email: string
  joinedAt: string
  role: 'visitor' | 'contributor'
  contributions: number
}

export interface Notification {
  id: string
  type: 'new_contribution' | 'new_letter' | 'system'
  message: string
  time: string
  read: boolean
}

export const DIVISIONS: Division[] = [
  'Mathematics',
  'Science',
  'Technical Mathematics',
  'Management & Economics',
  'Foreign Languages',
  'Literature & Philosophy',
  'Experimental Sciences',
]

export const mockUsers: User[] = [
  { id: '1', name: 'Nesrine Belkacem', email: 'nesrine@example.com', joinedAt: '2025-09-05', role: 'contributor', contributions: 1 },
  { id: '2', name: 'Yacine Boudjemaa', email: 'yacine@example.com', joinedAt: '2025-10-12', role: 'contributor', contributions: 2 },
  { id: '3', name: 'Amina Ferhat', email: 'amina@example.com', joinedAt: '2025-11-01', role: 'contributor', contributions: 1 },
  { id: '4', name: 'Rami Otsmane', email: 'rami@esi.dz', joinedAt: '2026-01-15', role: 'contributor', contributions: 1 },
  { id: '5', name: 'Lina Haddad', email: 'lina@example.com', joinedAt: '2026-02-20', role: 'visitor', contributions: 0 },
  { id: '6', name: 'Karima Messaoudi', email: 'karima@example.com', joinedAt: '2026-03-01', role: 'visitor', contributions: 0 },
  { id: '7', name: 'Sofiane Benbrahim', email: 'sofiane@example.com', joinedAt: '2026-03-10', role: 'visitor', contributions: 0 },
]

export const mockContributions: Contribution[] = [
  {
    id: 'c1', name: 'Nesrine Belkacem', email: 'nesrine@example.com',
    bacYear: 2025, score: 15.5, division: 'Management & Economics',
    driveLink: 'https://drive.google.com/drive/folders/example1',
    description: 'Complete revision notes for Management & Economics including all chapters and past exam papers with model solutions. Covers macro/microeconomics, accounting, and management fundamentals.',
    submittedAt: '2025-09-05', status: 'pending',
  },
  {
    id: 'c2', name: 'Yacine Boudjemaa', email: 'yacine@example.com',
    bacYear: 2024, score: 17.2, division: 'Mathematics',
    driveLink: 'https://drive.google.com/drive/folders/example2',
    description: 'Full mathematics resource pack: exercises with detailed solutions, cheat sheets, and strategic exam tips. Covers algebra, calculus, probability, and geometry.',
    submittedAt: '2025-10-01', status: 'accepted',
  },
  {
    id: 'c3', name: 'Amina Ferhat', email: 'amina@example.com',
    bacYear: 2024, score: 16.0, division: 'Science',
    driveLink: 'https://drive.google.com/drive/folders/example3',
    description: 'Physics and chemistry revision notes, with laboratory practical guides and common exam question patterns.',
    submittedAt: '2025-10-15', status: 'accepted',
  },
  {
    id: 'c4', name: 'Rami Otsmane', email: 'rami@esi.dz',
    bacYear: 2022, score: 20, division: 'Technical Mathematics',
    driveLink: 'https://drive.google.com/drive/folders/example4',
    description: 'Technical math bible — everything you need to score 20. Includes all past BAC papers from 2015–2022 with perfect solutions and time-management strategies.',
    submittedAt: '2026-03-27', status: 'pending',
  },
  {
    id: 'c5', name: 'Lina Haddad', email: 'lina@example.com',
    bacYear: 2023, score: 14.0, division: 'Literature & Philosophy',
    driveLink: 'https://drive.google.com/drive/folders/example5',
    description: 'Some notes.',
    submittedAt: '2026-02-10', status: 'rejected',
    rejectionReason: 'The uploaded files were incomplete and the description was too vague. Please re-submit with a full set of notes and a clear description of the content covered.',
  },
  {
    id: 'c6', name: 'Yacine Boudjemaa', email: 'yacine@example.com',
    bacYear: 2024, score: 17.2, division: 'Mathematics',
    driveLink: 'https://drive.google.com/drive/folders/example6',
    description: 'Additional advanced exercises for mathematics, focusing on integration and complex numbers.',
    submittedAt: '2025-11-20', status: 'accepted',
  },
]

export const mockLetters: Letter[] = [
  {
    id: 'l1', name: 'Nesrine Belkacem', email: 'nesrine@example.com',
    bacYear: 2025, score: 15.5, division: 'Management & Economics',
    content: `Chère future bachelière, cher futur bachelier,

Je m'appelle Nesrine et j'ai passé mon BAC en 2025 avec une moyenne de 15,5 en Management & Économie. Je veux partager avec vous ma méthode de révision qui m'a permis d'atteindre ce résultat.

La clé de ma réussite a été l'organisation : j'ai créé un planning de révision dès le mois de janvier, en allouant 2 heures par matière chaque jour. J'ai également formé un groupe d'étude avec des amis, ce qui nous a permis de nous corriger mutuellement.

Mon conseil principal : ne laissez pas l'économie pour la fin. C'est une matière qui nécessite beaucoup de pratique et de mémorisation des définitions.

Bonne chance à tous !`,
    submittedAt: '2025-09-05', status: 'pending',
  },
  {
    id: 'l2', name: 'Yacine Boudjemaa', email: 'yacine@example.com',
    bacYear: 2024, score: 17.2, division: 'Mathematics',
    content: `My journey to achieving 17.2 in Mathematics at the BAC was not easy, but it was incredibly rewarding. Here is what worked for me.

First, I never skipped a single day of practice. Mathematics is like a muscle — you need to exercise it every day. Even if it was just 30 minutes, I made sure to solve problems daily.

Second, I focused on understanding the "why" behind every formula rather than memorizing it blindly. This meant that even if I forgot a formula during the exam, I could re-derive it.

Third, past papers are your best friend. I solved every single BAC paper from the past 10 years. This gave me a clear picture of what to expect and helped me manage my time during the exam.

I hope these tips help you. You can do it!`,
    submittedAt: '2025-10-01', status: 'accepted',
  },
  {
    id: 'l3', name: 'Amina Ferhat', email: 'amina@example.com',
    bacYear: 2024, score: 16.0, division: 'Science',
    content: `To all science stream students preparing for the BAC: believe in yourself and trust the process.

My score of 16 in Science came from a balanced approach. I divided my revision into three phases: understanding (Jan–Feb), practice (Mar–Apr), and simulation (May). During simulation phase, I would set a timer and solve past papers under real exam conditions.

For physics, diagrams are everything. For chemistry, write out reactions by hand repeatedly. For math, group similar problem types and solve them in batches.

Most importantly: take care of your health. Sleep 7–8 hours, eat well, and take short breaks. Your brain needs rest to consolidate knowledge.`,
    submittedAt: '2025-10-15', status: 'accepted',
  },
  {
    id: 'l4', name: 'Rami Otsmane', email: 'rami@esi.dz',
    bacYear: 2022, score: 20, division: 'Technical Mathematics',
    content: `Getting a perfect 20 in Technical Mathematics was the result of 3 years of consistent work, not just one year of cramming.

I started solving BAC-level problems in 9th grade. By the time I reached the terminal year, the exam felt familiar, almost routine.

My top strategies:
1. Master the fundamentals completely — no gaps allowed
2. Time yourself on every exercise; speed matters as much as accuracy
3. Check your work systematically — I developed a personal checklist for each problem type
4. Teach concepts to others — it reveals your weak spots instantly

The night before the exam, I did not study at all. I slept early, woke up refreshed, and walked in with full confidence.

You have everything it takes. Now prove it.`,
    submittedAt: '2026-03-27', status: 'pending',
  },
  {
    id: 'l5', name: 'Lina Haddad', email: 'lina@example.com',
    bacYear: 2023, score: 14.0, division: 'Literature & Philosophy',
    content: `Good luck everyone`,
    submittedAt: '2026-02-10', status: 'rejected',
    rejectionReason: 'The letter is far too brief and does not contain useful, actionable advice for BAC candidates. We expect at least 3–4 paragraphs sharing genuine experience and study tips. Please re-submit with more substance.',
  },
]

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'new_contribution', message: 'Rami Otsmane submitted a new contribution (Technical Mathematics)', time: '2026-03-27', read: false },
  { id: 'n2', type: 'new_letter', message: 'Rami Otsmane submitted a new experience letter', time: '2026-03-27', read: false },
  { id: 'n3', type: 'new_contribution', message: 'Nesrine Belkacem submitted a new contribution (Management & Economics)', time: '2025-09-05', read: true },
  { id: 'n4', type: 'system', message: 'BACWAY Admin panel initialized successfully', time: '2025-09-01', read: true },
]

export const submissionsOverTime = [
  { month: 'Oct', contributions: 2, letters: 1 },
  { month: 'Nov', contributions: 5, letters: 3 },
  { month: 'Dec', contributions: 3, letters: 2 },
  { month: 'Jan', contributions: 8, letters: 5 },
  { month: 'Feb', contributions: 6, letters: 4 },
  { month: 'Mar', contributions: 12, letters: 7 },
]
