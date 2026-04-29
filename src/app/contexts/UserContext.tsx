import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserSettings {
  theme: 'light' | 'dark';
  autoSave: boolean;
  wiringStyle: 'curved' | 'straight';
  gridSnap: boolean;
  soundEffects: boolean;
  notifications: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface ExperimentProgress {
  id: string;
  title: string;
  completedSteps: number[];
  totalSteps: number;
  isValidated: boolean;
  lastModified: string;
  timeSpent: number; // in seconds
  attemptCount: number;
}

interface LabReport {
  id: string;
  experimentId: string;
  experimentTitle: string;
  generatedAt: string;
  score: number;
  vivaAnswers: { question: string; answer: string }[];
  circuitDiagram?: string; // base64 image
  analysisResults: {
    cycleEfficiency: number;
    powerConsumption: string;
    busStatus: string;
  };
}

interface UserData {
  name: string;
  email: string;
  enrollmentId: string;
  rollNumber: string;
  institution: string;
  avatar?: string;
  role?: string;
  settings: UserSettings;
  achievements: Achievement[];
  experimentsProgress: Record<string, ExperimentProgress>;
  labReports: LabReport[];
  totalTimeSpent: number;
  joinedAt: string;
}

interface UserContextType {
  userData: UserData;
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateUserData: (data: Partial<UserData>) => void;
  unlockAchievement: (achievementId: string) => void;
  updateExperimentProgress: (expId: string, progress: Partial<ExperimentProgress>) => void;
  addLabReport: (report: LabReport) => void;
  resetAllData: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'light',
  autoSave: true,
  wiringStyle: 'curved',
  gridSnap: false,
  soundEffects: true,
  notifications: true,
};

const defaultAchievements: Achievement[] = [
  { id: 'first_experiment', title: 'First Steps', description: 'Complete your first experiment', icon: '🎯', progress: 0, maxProgress: 1 },
  { id: 'forward_track', title: 'Forward Thinker', description: 'Complete all Forward Track experiments', icon: '🚀', progress: 0, maxProgress: 4 },
  { id: 'reverse_track', title: 'Reverse Engineer', description: 'Complete all Reverse Track experiments', icon: '🔄', progress: 0, maxProgress: 4 },
  { id: 'ultimate_converter', title: 'Ultimate Converter', description: 'Complete the μP to μC Converter Lab', icon: '⚡', progress: 0, maxProgress: 1 },
  { id: 'wiring_master', title: 'Wiring Master', description: 'Create 100 wire connections', icon: '🔌', progress: 0, maxProgress: 100 },
  { id: 'speed_demon', title: 'Speed Demon', description: 'Complete an experiment in under 10 minutes', icon: '⚡', progress: 0, maxProgress: 1 },
  { id: 'perfectionist', title: 'Perfectionist', description: 'Get 100% validation on 5 experiments', icon: '💎', progress: 0, maxProgress: 5 },
  { id: 'code_warrior', title: 'Code Warrior', description: 'Write assembly code for all experiments', icon: '💻', progress: 0, maxProgress: 9 },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete an experiment after midnight', icon: '🦉', progress: 0, maxProgress: 1 },
  { id: 'marathon', title: 'Marathon Runner', description: 'Spend 10 hours total in the lab', icon: '🏃', progress: 0, maxProgress: 36000 },
];

const defaultUserData: UserData = {
  name: 'Shivam Patel',
  email: 'shivam.patel@university.edu',
  enrollmentId: 'EE2024-8086',
  rollNumber: 'EE2024-8086',
  institution: 'MIT Electronics Lab',
  role: 'Student',
  avatar: 'https://raw.githubusercontent.com/shubuexe/pt-assets/main/WhatsApp%20Image%202026-03-16%20at%2000.10.11.jpeg',
  settings: defaultSettings,
  achievements: defaultAchievements,
  experimentsProgress: {
    'F1': {
      id: 'F1',
      title: 'External Memory Interfacing',
      completedSteps: [0, 1, 2],
      totalSteps: 4,
      isValidated: false,
      lastModified: new Date().toISOString(),
      timeSpent: 1200,
      attemptCount: 3,
    },
    'F2': {
      id: 'F2',
      title: 'I/O Expansion via 8255 PPI',
      completedSteps: [0, 1, 2, 3],
      totalSteps: 4,
      isValidated: true,
      lastModified: new Date(Date.now() - 86400000).toISOString(),
      timeSpent: 1800,
      attemptCount: 2,
    },
    'U1': {
      id: 'U1',
      title: 'μP to μC Ultimate Converter Lab',
      completedSteps: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      totalSteps: 9,
      isValidated: true,
      lastModified: new Date(Date.now() - 172800000).toISOString(),
      timeSpent: 3600,
      attemptCount: 1,
    },
  },
  labReports: [
    {
      id: 'RPT-001',
      experimentId: 'F2',
      experimentTitle: 'I/O Expansion via 8255 PPI',
      generatedAt: new Date(Date.now() - 86400000).toISOString(),
      score: 95,
      vivaAnswers: [
        { question: 'What is the purpose of the 8255 PPI?', answer: 'Provides programmable parallel I/O ports' },
        { question: 'How many I/O pins does the 8255 have?', answer: '24 pins organized as 3 ports (A, B, C)' },
        { question: 'What are the operating modes?', answer: 'Mode 0, Mode 1, and Mode 2' },
      ],
      analysisResults: {
        cycleEfficiency: 92,
        powerConsumption: '1.2W',
        busStatus: 'Active',
      },
    },
    {
      id: 'RPT-002',
      experimentId: 'U1',
      experimentTitle: 'μP to μC Ultimate Converter Lab',
      generatedAt: new Date(Date.now() - 172800000).toISOString(),
      score: 100,
      vivaAnswers: [
        { question: 'What components convert a μP to μC?', answer: '8086, SRAM, EPROM, Decoder, PPI, Timer, USART, PIC, Clock Generator' },
        { question: 'Why use external memory?', answer: 'Microprocessors require external RAM and ROM for operation' },
        { question: 'Role of 8284 Clock Generator?', answer: 'Provides stable clock signal and reset logic' },
      ],
      analysisResults: {
        cycleEfficiency: 98,
        powerConsumption: '2.5W',
        busStatus: 'Optimal',
      },
    },
  ],
  totalTimeSpent: 6600,
  joinedAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('bridge-86-51-user-data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        
        // Auto-migration: Update avatar if it's still using old Unsplash URL
        if (parsedData.avatar && parsedData.avatar.includes('unsplash.com')) {
          parsedData.avatar = 'https://raw.githubusercontent.com/shubuexe/pt-assets/main/WhatsApp%20Image%202026-03-16%20at%2000.10.11.jpeg';
        }
        
        // Auto-migration: Update name if it's still using old names
        if (parsedData.name === 'Alex Chen' || parsedData.name === 'John Doe') {
          parsedData.name = 'Shivam Patel';
          parsedData.email = 'shivam.patel@university.edu';
        }
        
        return parsedData;
      } catch {
        return defaultUserData;
      }
    }
    return defaultUserData;
  });

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('bridge-86-51-user-data', JSON.stringify(userData));
  }, [userData]);

  const updateSettings = (settings: Partial<UserSettings>) => {
    setUserData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({
      ...prev,
      ...data
    }));
  };

  const unlockAchievement = (achievementId: string) => {
    setUserData(prev => ({
      ...prev,
      achievements: prev.achievements.map(ach =>
        ach.id === achievementId && !ach.unlockedAt
          ? { ...ach, unlockedAt: new Date().toISOString(), progress: ach.maxProgress }
          : ach
      )
    }));
  };

  const updateExperimentProgress = (expId: string, progress: Partial<ExperimentProgress>) => {
    setUserData(prev => ({
      ...prev,
      experimentsProgress: {
        ...prev.experimentsProgress,
        [expId]: {
          ...(prev.experimentsProgress[expId] || {
            id: expId,
            title: '',
            completedSteps: [],
            totalSteps: 0,
            isValidated: false,
            lastModified: new Date().toISOString(),
            timeSpent: 0,
            attemptCount: 0,
          }),
          ...progress,
          lastModified: new Date().toISOString(),
        }
      }
    }));
  };

  const addLabReport = (report: LabReport) => {
    setUserData(prev => ({
      ...prev,
      labReports: [report, ...prev.labReports]
    }));
  };

  const resetAllData = () => {
    setUserData(defaultUserData);
    localStorage.removeItem('bridge-86-51-user-data');
  };

  return (
    <UserContext.Provider value={{
      userData,
      updateSettings,
      updateUserData,
      unlockAchievement,
      updateExperimentProgress,
      addLabReport,
      resetAllData,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}