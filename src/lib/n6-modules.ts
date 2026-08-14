export const n6Modules = [
  {
    name: "Structural Steel Design N6",
    topics: [
      "Properties of structural steel sections",
      "Tension members and net area",
      "Compression members and buckling",
      "Beam design and bending stress",
      "Bolted and welded connections",
      "Deflection checks",
    ],
  },
  {
    name: "Building Science N6",
    topics: [
      "Stress, strain and elasticity",
      "Shear force and bending moment diagrams",
      "Reinforced concrete beams",
      "Columns and axial loading",
      "Thermal movement in structures",
      "Fluid pressure on structures",
    ],
  },
  {
    name: "Concrete Technology",
    topics: [
      "Cement types and hydration",
      "Aggregates and grading",
      "Concrete mix design",
      "Workability and slump testing",
      "Curing and strength development",
      "Cube testing and quality control",
    ],
  },
  {
    name: "Soil Mechanics / Geotechnical",
    topics: [
      "Soil classification",
      "Compaction and moisture content",
      "Permeability and seepage",
      "Shear strength of soils",
      "Bearing capacity of foundations",
      "Retaining wall earth pressure",
    ],
  },
  {
    name: "Quantity Surveying / Estimating",
    topics: [
      "Measurement principles",
      "Bills of quantities",
      "Rate build-ups",
      "Concrete and formwork take-off",
      "Reinforcement scheduling",
      "Valuations and progress payments",
    ],
  },
  {
    name: "Construction Management & Safety",
    topics: [
      "Site organisation and layout",
      "Programming and critical path",
      "Toolbox talks and site instructions",
      "Occupational health and safety duties",
      "Quality control on site",
      "Progress reporting",
    ],
  },
] as const;

export type N6Module = (typeof n6Modules)[number];

export const totalTopics = n6Modules.reduce((sum, m) => sum + m.topics.length, 0);

export function topicKey(module: string, topic: string) {
  return `${module}::${topic}`;
}

export const resourceCategories = [
  { label: "Concept explanation", suffix: "explained" },
  { label: "Worked calculations", suffix: "worked example calculation" },
  { label: "Exam revision", suffix: "N6 exam revision" },
  { label: "Past-paper walkthrough", suffix: "past paper solution walkthrough" },
  { label: "Practical construction", suffix: "on site practical construction" },
] as const;

export function youtubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}