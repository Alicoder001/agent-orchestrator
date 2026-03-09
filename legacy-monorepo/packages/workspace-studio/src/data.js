export const AGENTS = {
  alex: { id: "alex", name: "Alex Chen", title: "CEO", avatar: "AC", color: "#5b6af0", bg: "#eef0ff", department: "leadership" },
  sarah: { id: "sarah", name: "Sarah Park", title: "COO", avatar: "SP", color: "#7c3aed", bg: "#f3eeff", department: "leadership" },
  marcus: { id: "marcus", name: "Marcus Webb", title: "CTO", avatar: "MW", color: "#0891b2", bg: "#e0f7fa", department: "engineering" },
  yuki: { id: "yuki", name: "Yuki Tanaka", title: "Senior Engineer", avatar: "YT", color: "#059669", bg: "#e6faf3", department: "engineering" },
  omar: { id: "omar", name: "Omar Rashid", title: "Frontend Engineer", avatar: "OR", color: "#16a34a", bg: "#edfaf2", department: "engineering" },
  priya: { id: "priya", name: "Priya Nair", title: "Data Scientist", avatar: "PN", color: "#2563eb", bg: "#eff6ff", department: "data" },
  leon: { id: "leon", name: "Leon Muller", title: "ML Engineer", avatar: "LM", color: "#1d4ed8", bg: "#eff6ff", department: "data" },
  zoe: { id: "zoe", name: "Zoe Laurent", title: "Head of Design", avatar: "ZL", color: "#db2777", bg: "#fdf2f8", department: "design" },
  kai: { id: "kai", name: "Kai Okonkwo", title: "Brand Designer", avatar: "KO", color: "#9333ea", bg: "#fdf4ff", department: "design" },
  ines: { id: "ines", name: "Ines Ferreira", title: "DevOps", avatar: "IF", color: "#d97706", bg: "#fffbeb", department: "operations" },
  tom: { id: "tom", name: "Tom Bradley", title: "Product Manager", avatar: "TB", color: "#b45309", bg: "#fef9ee", department: "operations" }
};

export const DEPARTMENTS = [
  { id: "leadership", name: "Leadership", color: "#5b6af0" },
  { id: "engineering", name: "Engineering", color: "#0891b2" },
  { id: "data", name: "Data & ML", color: "#2563eb" },
  { id: "design", name: "Design", color: "#db2777" },
  { id: "operations", name: "Operations", color: "#d97706" }
];

export const ORGANIZATIONS = [
  {
    id: "ai-corp",
    name: "AI Corp",
    industry: "AI Operations",
    projects: [
      {
        id: "orchestrator",
        name: "Unified Orchestrator",
        environment: "Production Design",
        channels: [
          { id: "general", name: "general", members: Object.keys(AGENTS), isChannel: true },
          { id: "engineering", name: "engineering", members: ["marcus", "yuki", "omar", "ines"], isChannel: true },
          { id: "design", name: "design", members: ["zoe", "kai", "omar"], isChannel: true },
          { id: "product", name: "product", members: ["tom", "alex", "sarah", "priya"], isChannel: true }
        ]
      },
      {
        id: "loyalty-os",
        name: "Loyalty OS",
        environment: "Planning",
        channels: [
          { id: "strategy", name: "strategy", members: ["alex", "sarah", "tom"], isChannel: true },
          { id: "launch", name: "launch", members: ["tom", "omar", "zoe", "ines"], isChannel: true }
        ]
      }
    ]
  }
];

export const TEAMS = [
  { id: "exec", label: "Executive Floor", color: "#5b6af0", x: 100, y: 80, w: 360, h: 220, desks: [{ id: "alex", x: 30, y: 70 }, { id: "sarah", x: 200, y: 70 }] },
  { id: "eng", label: "Engineering", color: "#0891b2", x: 560, y: 80, w: 480, h: 220, desks: [{ id: "marcus", x: 20, y: 70 }, { id: "yuki", x: 180, y: 70 }, { id: "omar", x: 340, y: 70 }] },
  { id: "data", label: "Data & ML", color: "#2563eb", x: 100, y: 440, w: 360, h: 220, desks: [{ id: "priya", x: 30, y: 70 }, { id: "leon", x: 200, y: 70 }] },
  { id: "design", label: "Design Studio", color: "#db2777", x: 560, y: 440, w: 360, h: 220, desks: [{ id: "zoe", x: 30, y: 70 }, { id: "kai", x: 200, y: 70 }] },
  { id: "ops", label: "Ops & PM", color: "#d97706", x: 1140, y: 80, w: 240, h: 480, desks: [{ id: "ines", x: 30, y: 70 }, { id: "tom", x: 30, y: 260 }] }
];

export const AGENT_3D_LAYOUT = {
  alex: { position: [-4.2, 0.12, -3.1], color: "#5b6af0", zone: "exec" },
  sarah: { position: [-3.2, 0.12, -3.1], color: "#7c3aed", zone: "exec" },
  marcus: { position: [-3.4, 0.12, -0.8], color: "#0891b2", zone: "eng" },
  yuki: { position: [-2.4, 0.12, -0.8], color: "#059669", zone: "eng" },
  omar: { position: [-1.4, 0.12, -0.8], color: "#16a34a", zone: "eng" },
  priya: { position: [1.8, 0.12, 2], color: "#2563eb", zone: "data" },
  leon: { position: [2.8, 0.12, 2], color: "#1d4ed8", zone: "data" },
  zoe: { position: [4.1, 0.12, -0.8], color: "#db2777", zone: "design" },
  kai: { position: [5.1, 0.12, -0.8], color: "#9333ea", zone: "design" },
  ines: { position: [3.8, 0.12, 3.5], color: "#d97706", zone: "ops" },
  tom: { position: [4.8, 0.12, 3.5], color: "#b45309", zone: "ops" }
};

export function nowTime() {
  return new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

export function agentAbsPos(agentId) {
  for (const team of TEAMS) {
    const desk = team.desks.find((item) => item.id === agentId);
    if (desk) return { x: team.x + desk.x + 44, y: team.y + desk.y + 18 };
  }
  return { x: 400, y: 300 };
}

export function buildAgentReply(agentId, text, channelName) {
  const intro = {
    alex: `Biznes nuqtai nazardan bu ${channelName} oqimida prioritetga o'xshaydi.`,
    sarah: "Buni operatsion tomondan tartibga solish kerak.",
    marcus: "Texnik tarafdan arxitektura va risklarni ko'ryapman.",
    yuki: "Implementatsiya uchun backend oqimi aniq bo'lishi kerak.",
    omar: "UI va interaction tomoni uchun yaxshi asos bor.",
    priya: "Metrika va signal tarafini ham ulaymiz.",
    leon: "Model yoki automation bo'lsa pipeline'ni ajratib olaman.",
    zoe: "Vizual ierarxiya toza, lekin foydalanuvchi oqimi ham muhim.",
    kai: "Brand ohangi va ekran xarakteri saqlanishi kerak.",
    ines: "Infra va deploy oqimi bu bilan birga o'ylanishi kerak.",
    tom: "Men buni roadmap va user impact bo'yicha yig'ib beraman."
  }[agentId];

  const outro = text.toLowerCase().includes("chat")
    ? "Chat panelni asosiy interaction layer sifatida qoldirgan ma'qul."
    : "Buni bosqichma-bosqich olib borish eng to'g'ri yo'l.";

  return `${intro} ${outro}`;
}
