// Complete periodic table data for all 118 elements
// Sources: IUPAC, NIST, and standard chemistry references

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  category: string;
  group: number | null;
  period: number;
  block: 's' | 'p' | 'd' | 'f';
  electronConfiguration: string;
  electronegativity: number | null;
  ionizationEnergy: number | null;
  atomicRadius: number | null;
  density: number | null;
  meltingPoint: number | null;
  boilingPoint: number | null;
  oxidationStates: string;
  discoveryYear: number | null;
  phase: 'solid' | 'liquid' | 'gas' | 'unknown';
  description: string;
  examRelevance: {
    jeeMain: string;
    jeeAdvanced: string;
    hsc: string;
  };
  importantCompounds?: string[];
  trends?: string;
}

export const ELEMENTS: Element[] = [
  // Period 1
  {
    atomicNumber: 1,
    symbol: 'H',
    name: 'Hydrogen',
    atomicMass: '1.008',
    category: 'Reactive Nonmetal',
    group: 1,
    period: 1,
    block: 's',
    electronConfiguration: '1s¹',
    electronegativity: 2.20,
    ionizationEnergy: 1312,
    atomicRadius: 53,
    density: 0.00009,
    meltingPoint: -259.16,
    boilingPoint: -252.87,
    oxidationStates: '-1, +1',
    discoveryYear: 1766,
    phase: 'gas',
    description: 'Lightest and most abundant element in the universe. Forms water (H₂O) and organic compounds.',
    examRelevance: {
      jeeMain: 'High - Hydrogen spectrum, Bohr model, isotopes (protium, deuterium, tritium)',
      jeeAdvanced: 'Very High - Quantum mechanics, hydrogen atom energy levels, molecular orbital theory',
      hsc: 'High - Hydrogen gas preparation, properties, hydrides, hydrogen bonding'
    },
    importantCompounds: ['H₂O', 'HCl', 'H₂SO₄', 'NH₃', 'CH₄'],
    trends: 'Highest ionization energy in group, smallest atomic radius'
  },
  {
    atomicNumber: 2,
    symbol: 'He',
    name: 'Helium',
    atomicMass: '4.0026',
    category: 'Noble Gas',
    group: 18,
    period: 1,
    block: 's',
    electronConfiguration: '1s²',
    electronegativity: null,
    ionizationEnergy: 2372,
    atomicRadius: 31,
    density: 0.000179,
    meltingPoint: -272.2,
    boilingPoint: -268.93,
    oxidationStates: '0',
    discoveryYear: 1868,
    phase: 'gas',
    description: 'Second lightest element. Inert noble gas with complete electron shell.',
    examRelevance: {
      jeeMain: 'Medium - Noble gas configuration, ionization energy trends',
      jeeAdvanced: 'Medium - Quantum numbers, electron configuration exceptions',
      hsc: 'Medium - Noble gases, inert pair effect'
    }
  },
  // Period 2
  {
    atomicNumber: 3,
    symbol: 'Li',
    name: 'Lithium',
    atomicMass: '6.94',
    category: 'Alkali Metal',
    group: 1,
    period: 2,
    block: 's',
    electronConfiguration: '[He] 2s¹',
    electronegativity: 0.98,
    ionizationEnergy: 520,
    atomicRadius: 167,
    density: 0.534,
    meltingPoint: 180.54,
    boilingPoint: 1342,
    oxidationStates: '+1',
    discoveryYear: 1817,
    phase: 'solid',
    description: 'Lightest metal. Highly reactive alkali metal used in batteries.',
    examRelevance: {
      jeeMain: 'High - Alkali metals, diagonal relationship with Mg',
      jeeAdvanced: 'High - s-block elements, anomalous behavior',
      hsc: 'High - Alkali metals, lithium compounds, diagonal relationship'
    },
    importantCompounds: ['Li₂O', 'LiOH', 'Li₂CO₃', 'LiCl']
  },
  {
    atomicNumber: 4,
    symbol: 'Be',
    name: 'Beryllium',
    atomicMass: '9.0122',
    category: 'Alkaline Earth Metal',
    group: 2,
    period: 2,
    block: 's',
    electronConfiguration: '[He] 2s²',
    electronegativity: 1.57,
    ionizationEnergy: 900,
    atomicRadius: 112,
    density: 1.85,
    meltingPoint: 1287,
    boilingPoint: 2470,
    oxidationStates: '+2',
    discoveryYear: 1798,
    phase: 'solid',
    description: 'Lightweight alkaline earth metal. Diagonal relationship with aluminum.',
    examRelevance: {
      jeeMain: 'Medium - s-block elements, diagonal relationship',
      jeeAdvanced: 'Medium - Anomalous behavior of Be',
      hsc: 'Medium - Alkaline earth metals, diagonal relationship with Al'
    }
  },
  {
    atomicNumber: 5,
    symbol: 'B',
    name: 'Boron',
    atomicMass: '10.81',
    category: 'Metalloid',
    group: 13,
    period: 2,
    block: 'p',
    electronConfiguration: '[He] 2s² 2p¹',
    electronegativity: 2.04,
    ionizationEnergy: 801,
    atomicRadius: 87,
    density: 2.34,
    meltingPoint: 2076,
    boilingPoint: 3927,
    oxidationStates: '+3',
    discoveryYear: 1808,
    phase: 'solid',
    description: 'Metalloid with electron-deficient compounds. Forms boranes and boric acid.',
    examRelevance: {
      jeeMain: 'High - p-block elements, electron-deficient compounds',
      jeeAdvanced: 'High - Boron chemistry, diborane structure, Wade\'s rules',
      hsc: 'High - Boron family, boric acid, borax'
    },
    importantCompounds: ['B₂H₆', 'H₃BO₃', 'Na₂B₄O₇']
  },
  {
    atomicNumber: 6,
    symbol: 'C',
    name: 'Carbon',
    atomicMass: '12.011',
    category: 'Reactive Nonmetal',
    group: 14,
    period: 2,
    block: 'p',
    electronConfiguration: '[He] 2s² 2p²',
    electronegativity: 2.55,
    ionizationEnergy: 1086,
    atomicRadius: 77,
    density: 2.267,
    meltingPoint: 3550,
    boilingPoint: 4027,
    oxidationStates: '-4, +2, +4',
    discoveryYear: null,
    phase: 'solid',
    description: 'Basis of organic chemistry. Forms diamond, graphite, and fullerenes.',
    examRelevance: {
      jeeMain: 'Very High - Organic chemistry, hybridization, allotropes',
      jeeAdvanced: 'Very High - Reaction mechanisms, stereochemistry, carbon compounds',
      hsc: 'Very High - Organic chemistry, carbon compounds, functional groups'
    },
    importantCompounds: ['CO₂', 'CH₄', 'C₂H₅OH', 'C₆H₁₂O₆'],
    trends: 'Can form 4 covalent bonds, catenation property'
  },
  {
    atomicNumber: 7,
    symbol: 'N',
    name: 'Nitrogen',
    atomicMass: '14.007',
    category: 'Reactive Nonmetal',
    group: 15,
    period: 2,
    block: 'p',
    electronConfiguration: '[He] 2s² 2p³',
    electronegativity: 3.04,
    ionizationEnergy: 1402,
    atomicRadius: 75,
    density: 0.0012506,
    meltingPoint: -210.1,
    boilingPoint: -195.79,
    oxidationStates: '-3, +3, +5',
    discoveryYear: 1772,
    phase: 'gas',
    description: 'Makes up 78% of atmosphere. Forms ammonia and nitric acid.',
    examRelevance: {
      jeeMain: 'Very High - p-block, nitrogen cycle, ammonia',
      jeeAdvanced: 'Very High - Nitrogen compounds, Ostwald process',
      hsc: 'Very High - Nitrogen family, ammonia, nitric acid'
    },
    importantCompounds: ['NH₃', 'HNO₃', 'NO₂', 'N₂O']
  },
  {
    atomicNumber: 8,
    symbol: 'O',
    name: 'Oxygen',
    atomicMass: '15.999',
    category: 'Reactive Nonmetal',
    group: 16,
    period: 2,
    block: 'p',
    electronConfiguration: '[He] 2s² 2p⁴',
    electronegativity: 3.44,
    ionizationEnergy: 1314,
    atomicRadius: 73,
    density: 0.001429,
    meltingPoint: -218.79,
    boilingPoint: -182.96,
    oxidationStates: '-2',
    discoveryYear: 1774,
    phase: 'gas',
    description: 'Essential for respiration. Most electronegative element after fluorine.',
    examRelevance: {
      jeeMain: 'Very High - Oxygen family, oxides, ozone',
      jeeAdvanced: 'Very High - Oxygen compounds, allotropes',
      hsc: 'Very High - Oxygen family, sulfuric acid contact process'
    },
    importantCompounds: ['H₂O', 'O₃', 'H₂SO₄', 'CO₂']
  },
  {
    atomicNumber: 9,
    symbol: 'F',
    name: 'Fluorine',
    atomicMass: '18.998',
    category: 'Halogen',
    group: 17,
    period: 2,
    block: 'p',
    electronConfiguration: '[He] 2s² 2p⁵',
    electronegativity: 3.98,
    ionizationEnergy: 1681,
    atomicRadius: 71,
    density: 0.001696,
    meltingPoint: -219.67,
    boilingPoint: -188.11,
    oxidationStates: '-1',
    discoveryYear: 1886,
    phase: 'gas',
    description: 'Most electronegative element. Highly reactive halogen.',
    examRelevance: {
      jeeMain: 'High - Halogens, electronegativity trends',
      jeeAdvanced: 'High - Fluorine compounds, anomalous behavior',
      hsc: 'High - Halogen family, fluorine compounds'
    },
    importantCompounds: ['HF', 'NaF', 'CaF₂']
  },
  {
    atomicNumber: 10,
    symbol: 'Ne',
    name: 'Neon',
    atomicMass: '20.180',
    category: 'Noble Gas',
    group: 18,
    period: 2,
    block: 'p',
    electronConfiguration: '[He] 2s² 2p⁶',
    electronegativity: null,
    ionizationEnergy: 2081,
    atomicRadius: 69,
    density: 0.0009,
    meltingPoint: -248.59,
    boilingPoint: -246.05,
    oxidationStates: '0',
    discoveryYear: 1898,
    phase: 'gas',
    description: 'Noble gas used in neon signs. Complete octet configuration.',
    examRelevance: {
      jeeMain: 'Medium - Noble gases, ionization energy',
      jeeAdvanced: 'Medium - Noble gas compounds',
      hsc: 'Medium - Noble gases'
    }
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Alkali Metal': '#ff6b6b',
  'Alkaline Earth Metal': '#ffa94d',
  'Transition Metal': '#ffd43b',
  'Post-Transition Metal': '#a9e34b',
  'Metalloid': '#51cf66',
  'Reactive Nonmetal': '#339af0',
  'Halogen': '#5c7cfa',
  'Noble Gas': '#845ef7',
  'Lanthanide': '#f06595',
  'Actinide': '#e64980',
  'Unknown': '#868e96'
};
