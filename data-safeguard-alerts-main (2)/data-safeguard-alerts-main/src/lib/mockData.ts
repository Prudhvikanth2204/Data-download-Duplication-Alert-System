import { AlertType } from "@/context/AlertContext";
import React from 'react';

export interface Stat {
  label: string;
  value: string;
  delta: string;
  icon: React.ReactNode;
  deltaType?: "increase" | "decrease";
}

export interface StatData {
  title: string;
  value: string;
  change: string;
  status: "increase" | "decrease";
  isGoodWhenIncreasing: boolean;
}

export interface AppUsage {
  id: string;
  appName: string;
  timeSpent: number;
  category: string;
}

export interface UsageData {
  date: string;
  productive: number;
  neutral: number;
  nonproductive: number;
}

export interface UsageChartData {
  name: string;
  "Productive Time": number;
  "Unproductive Time": number;
}

export interface FileRecord {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  downloadDate: Date;
  downloadedBy: string;
  checksum: string;
  isDuplicate?: boolean;
  downloadId?: number; // Add downloadId for browser extension integration
}

export function transformAppUsageToChartFormat(appUsageData: AppUsage[]): UsageData[] {
  const categoryGroups: Record<string, number> = {};
  
  appUsageData.forEach(app => {
    if (!categoryGroups[app.category]) {
      categoryGroups[app.category] = 0;
    }
    categoryGroups[app.category] += app.timeSpent;
  });
  
  const today = new Date().toISOString().split('T')[0];
  
  return [{
    date: today,
    productive: categoryGroups['Development'] || categoryGroups['Design'] || categoryGroups['productive'] || 0,
    neutral: categoryGroups['Communication'] || categoryGroups['Browsing'] || categoryGroups['neutral'] || 0,
    nonproductive: categoryGroups['Entertainment'] || categoryGroups['non-productive'] || 0
  }];
}

export const MOCK_STATS: Stat[] = [
  {
    label: "Total Downloads",
    value: "45,789",
    delta: "+3.2%",
    icon: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "lucide lucide-download",
    }, React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), React.createElement("polyline", { points: "7 10 12 15 17 10" }), React.createElement("line", { x1: "12", x2: "12", y1: "15", y2: "3" })),
    deltaType: "increase",
  },
  {
    label: "Duplicate Files",
    value: "1,256",
    delta: "-1.4%",
    icon: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "lucide lucide-copy-check",
    }, React.createElement("rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }), React.createElement("path", { d: "M4 16c-1.5 0-3-1-3-2V4c0-1.5 1-3 2-3h10c1 0 3 1 3 2" }), React.createElement("polyline", { points: "15 8 22 2 17 3" })),
    deltaType: "decrease",
  },
  {
    label: "Total Storage Used",
    value: "3.5 TB",
    delta: "+5.1%",
    icon: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "lucide lucide-database",
    }, React.createElement("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }), React.createElement("path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }), React.createElement("path", { d: "M3 12A9 3 0 0 1 21 12" })),
    deltaType: "increase",
  },
  {
    label: "Average Session Time",
    value: "47m 23s",
    delta: "+2.8%",
    icon: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "lucide lucide-clock",
    }, React.createElement("circle", { cx: "12", cy: "12", r: "10" }), React.createElement("polyline", { points: "12 6 12 12 16 14" })),
    deltaType: "increase",
  },
];

export const MOCK_APP_USAGE: AppUsage[] = [
  {
    id: "1",
    appName: "Visual Studio Code",
    timeSpent: 185,
    category: "Development",
  },
  {
    id: "2",
    appName: "Figma",
    timeSpent: 120,
    category: "Design",
  },
  {
    id: "3",
    appName: "Slack",
    timeSpent: 90,
    category: "Communication",
  },
  {
    id: "4",
    appName: "Chrome",
    timeSpent: 210,
    category: "Browsing",
  },
  {
    id: "5",
    appName: "Spotify",
    timeSpent: 60,
    category: "Entertainment",
  },
];

export const MOCK_USAGE_DATA: UsageData[] = [
  {
    date: "2025-04-12",
    productive: 240,
    neutral: 120,
    nonproductive: 90
  },
  {
    date: "2025-04-13",
    productive: 300,
    neutral: 90,
    nonproductive: 60
  },
  {
    date: "2025-04-14",
    productive: 280,
    neutral: 110,
    nonproductive: 70
  },
  {
    date: "2025-04-15",
    productive: 220,
    neutral: 140,
    nonproductive: 100
  },
  {
    date: "2025-04-16",
    productive: 190,
    neutral: 160,
    nonproductive: 120
  },
  {
    date: "2025-04-17",
    productive: 100,
    neutral: 150,
    nonproductive: 250
  },
  {
    date: "2025-04-18",
    productive: 150,
    neutral: 120,
    nonproductive: 200
  }
];

export const MOCK_USAGE_CHART_DATA: UsageChartData[] = [
  {
    name: "Monday",
    "Productive Time": 240,
    "Unproductive Time": 120,
  },
  {
    name: "Tuesday",
    "Productive Time": 300,
    "Unproductive Time": 90,
  },
  {
    name: "Wednesday",
    "Productive Time": 280,
    "Unproductive Time": 110,
  },
  {
    name: "Thursday",
    "Productive Time": 220,
    "Unproductive Time": 140,
  },
  {
    name: "Friday",
    "Productive Time": 190,
    "Unproductive Time": 160,
  },
  {
    name: "Saturday",
    "Productive Time": 100,
    "Unproductive Time": 250,
  },
  {
    name: "Sunday",
    "Productive Time": 150,
    "Unproductive Time": 200,
  },
];

export const MOCK_FILES: FileRecord[] = [
  {
    id: "1",
    fileName: "Document-2024.pdf",
    fileSize: "2.2 MB",
    fileType: "PDF",
    downloadDate: new Date("2024-03-15T14:30:00"),
    downloadedBy: "Jane Smith",
    checksum: "a1b2c3d4e5f678901234567890abcdef",
    isDuplicate: false,
  },
  {
    id: "2",
    fileName: "Image-2024.jpg",
    fileSize: "1.5 MB",
    fileType: "JPG",
    downloadDate: new Date("2024-03-14T16:45:00"),
    downloadedBy: "John Doe",
    checksum: "fedcba09876543210fedcba0987654321",
    isDuplicate: true,
  },
  {
    id: "3",
    fileName: "Spreadsheet-2024.xlsx",
    fileSize: "3.1 MB",
    fileType: "XLSX",
    downloadDate: new Date("2024-03-13T09:15:00"),
    downloadedBy: "Alice Johnson",
    checksum: "0123456789abcdef0123456789abcdef",
    isDuplicate: false,
  },
  {
    id: "4",
    fileName: "Presentation-2024.pptx",
    fileSize: "4.8 MB",
    fileType: "PPTX",
    downloadDate: new Date("2024-03-12T11:00:00"),
    downloadedBy: "Bob Williams",
    checksum: "9876543210fedcba9876543210fedcba",
    isDuplicate: false,
  },
  {
    id: "5",
    fileName: "Archive-2024.zip",
    fileSize: "6.3 MB",
    fileType: "ZIP",
    downloadDate: new Date("2024-03-11T13:20:00"),
    downloadedBy: "Eve Brown",
    checksum: "abcdef0123456789abcdef0123456789",
    isDuplicate: false,
  },
  {
    id: "6",
    fileName: "TextFile-2024.txt",
    fileSize: "0.2 MB",
    fileType: "TXT",
    downloadDate: new Date("2024-03-10T15:55:00"),
    downloadedBy: "Charlie Green",
    checksum: "67890abcdef0123456789abcdef012345",
    isDuplicate: false,
  },
  {
    id: "7",
    fileName: "AudioFile-2024.mp3",
    fileSize: "5.7 MB",
    fileType: "MP3",
    downloadDate: new Date("2024-03-09T18:30:00"),
    downloadedBy: "Dana White",
    checksum: "c3d4e5f678901234567890abcdefa1b2",
    isDuplicate: false,
  },
  {
    id: "8",
    fileName: "VideoFile-2024.mp4",
    fileSize: "8.9 MB",
    fileType: "MP4",
    downloadDate: new Date("2024-03-08T20:00:00"),
    downloadedBy: "Frank Black",
    checksum: "5f678901234567890abcdefa1b2c3d4e",
    isDuplicate: false,
  },
  {
    id: "9",
    fileName: "Executable-2024.exe",
    fileSize: "7.4 MB",
    fileType: "EXE",
    downloadDate: new Date("2024-03-07T08:45:00"),
    downloadedBy: "Grace Grey",
    checksum: "890abcdef0123456789abcdef01234567",
    isDuplicate: false,
  },
  {
    id: "10",
    fileName: "CodeFile-2024.py",
    fileSize: "0.9 MB",
    fileType: "PY",
    downloadDate: new Date("2024-03-06T10:30:00"),
    downloadedBy: "Harry Purple",
    checksum: "def0123456789abcdef0123456789abc",
    isDuplicate: false,
  },
];
