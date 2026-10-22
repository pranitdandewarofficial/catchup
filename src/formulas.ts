// Formula data structure for flashcards
export interface FormulaCategory {
  category: string;
  topic: string;
  formulas: string[];
}

export interface FormulaSubject {
  subject: string;
  accent: string;
  categories: FormulaCategory[];
}

export const FORMULAS: FormulaSubject[] = [
  {
    subject: 'Physics',
    accent: '#2563eb',
    categories: [
      {
        category: 'Mechanics',
        topic: 'Rotational Motion',
        formulas: [
          'I = Σmr²',
          'τ = Iα',
          'L = Iω',
          'K.E._rot = ½Iω²',
          'v = rω (rolling without slipping)'
        ]
      },
      {
        category: 'Thermodynamics',
        topic: 'Laws of Thermodynamics',
        formulas: [
          'ΔU = Q - W (First Law)',
          'η = 1 - T₂/T₁ (Carnot Efficiency)',
          'PV = nRT (Ideal Gas)',
          'ΔS ≥ 0 (Second Law)'
        ]
      }
    ]
  },
  {
    subject: 'Chemistry',
    accent: '#16a34a',
    categories: [
      {
        category: 'Physical Chemistry',
        topic: 'Chemical Bonding',
        formulas: [
          'Bond Order = (Nb - Na)/2',
          'μ = √(n(n+2)) BM (Magnetic Moment)',
          ' lattice energy ∝ (q₁q₂)/r'
        ]
      }
    ]
  },
  {
    subject: 'Mathematics',
    accent: '#7c3aed',
    categories: [
      {
        category: 'Calculus',
        topic: 'Differentiation',
        formulas: [
          'd/dx(xⁿ) = nxⁿ⁻¹',
          'd/dx(eˣ) = eˣ',
          'd/dx(ln x) = 1/x',
          'd/dx(sin x) = cos x',
          'd/dx(cos x) = -sin x'
        ]
      },
      {
        category: 'Calculus',
        topic: 'Integration',
        formulas: [
          '∫xⁿdx = xⁿ⁺¹/(n+1) + C',
          '∫eˣdx = eˣ + C',
          '∫(1/x)dx = ln|x| + C',
          '∫sin x dx = -cos x + C',
          '∫cos x dx = sin x + C'
        ]
      }
    ]
  }
];
