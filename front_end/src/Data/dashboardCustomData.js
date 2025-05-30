// Custom dashboard data for charts and table (frontend only, not in main mockData)
export const hiredCandidatesLineData = [
  {
    id: "John",
    color: "#4caf50",
    data: [
      { x: "Jan", y: 10 }, { x: "Feb", y: 13 }, { x: "Mar", y: 8 },
      { x: "Apr", y: 15 }, { x: "May", y: 20 }, { x: "Jun", y: 18 },
      { x: "Jul", y: 25 }, { x: "Aug", y: 22 }, { x: "Sep", y: 19 },
      { x: "Oct", y: 24 }, { x: "Nov", y: 21 }, { x: "Dec", y: 17 },
    ],
  },
  {
    id: "Alex",
    color: "#2196f3",
    data: [
      { x: "Jan", y: 12 }, { x: "Feb", y: 9 }, { x: "Mar", y: 14 },
      { x: "Apr", y: 17 }, { x: "May", y: 11 }, { x: "Jun", y: 15 },
      { x: "Jul", y: 19 }, { x: "Aug", y: 20 }, { x: "Sep", y: 18 },
      { x: "Oct", y: 16 }, { x: "Nov", y: 23 }, { x: "Dec", y: 20 },
    ],
  },
  {
    id: "Serhii",
    color: "#e53935",
    data: [
      { x: "Jan", y: 8 }, { x: "Feb", y: 11 }, { x: "Mar", y: 13 },
      { x: "Apr", y: 10 }, { x: "May", y: 14 }, { x: "Jun", y: 17 },
      { x: "Jul", y: 15 }, { x: "Aug", y: 18 }, { x: "Sep", y: 16 },
      { x: "Oct", y: 14 }, { x: "Nov", y: 12 }, { x: "Dec", y: 13 },
    ],
  },
];

export const candidatesPerMonthBarData = [
  { month: "Jan", Barista: 12, Cleaner: 8, Welder: 5, Electrician: 7, "Physical Worker": 10, Driver: 6 },
  { month: "Feb", Barista: 15, Cleaner: 10, Welder: 7, Electrician: 8, "Physical Worker": 12, Driver: 9 },
  { month: "Mar", Barista: 10, Cleaner: 12, Welder: 9, Electrician: 6, "Physical Worker": 11, Driver: 8 },
  { month: "Apr", Barista: 14, Cleaner: 9, Welder: 8, Electrician: 10, "Physical Worker": 13, Driver: 7 },
  { month: "May", Barista: 17, Cleaner: 11, Welder: 10, Electrician: 12, "Physical Worker": 15, Driver: 10 },
  { month: "Jun", Barista: 13, Cleaner: 14, Welder: 12, Electrician: 11, "Physical Worker": 14, Driver: 12 },
  { month: "Jul", Barista: 16, Cleaner: 13, Welder: 11, Electrician: 13, "Physical Worker": 16, Driver: 11 },
  { month: "Aug", Barista: 18, Cleaner: 15, Welder: 13, Electrician: 14, "Physical Worker": 18, Driver: 13 },
  { month: "Sep", Barista: 14, Cleaner: 12, Welder: 10, Electrician: 12, "Physical Worker": 13, Driver: 10 },
  { month: "Oct", Barista: 15, Cleaner: 13, Welder: 12, Electrician: 13, "Physical Worker": 15, Driver: 12 },
  { month: "Nov", Barista: 13, Cleaner: 11, Welder: 9, Electrician: 10, "Physical Worker": 12, Driver: 8 },
  { month: "Dec", Barista: 12, Cleaner: 10, Welder: 8, Electrician: 9, "Physical Worker": 11, Driver: 7 },
];

export const recentCandidates = [
  { txId: "01e4dsa", user: "John Doe", date: "2025-01-15", phone: "(123)456-7890" },
  { txId: "0315dsaa", user: "Alex Johnson", date: "2025-01-20", phone: "(234)567-8901" },
  { txId: "51034szv", user: "Serhii Bondarenko", date: "2025-02-05", phone: "(345)678-9012" },
  { txId: "0a123sb", user: "Maria Ivanova", date: "2025-02-10", phone: "(456)789-0123" },
  { txId: "120s51a", user: "Oksana Petrenko", date: "2025-03-01", phone: "(567)890-1234" },
];
