// Exam data structure
export interface Chapter {
  name: string;
  summary: string;
  keyConcepts: string[];
  mustKnow: string[];
  formulas: string[];
  deleted: string[];
  deletedChapter: boolean;
  weightage: string;
}

export interface SubjectGroup {
  subject: string;
  chapters: Chapter[];
}

export interface ExamTrack {
  id: string;
  label: string;
  tag: string;
  accent: string;
  note: string;
  groups: SubjectGroup[];
}

export const DATA: ExamTrack[] = [
  {
    id: 'jee',
    label: 'JEE Main 2026',
    tag: 'JEE',
    accent: '#2563eb',
    note: 'Complete JEE Main preparation with Physics, Chemistry, and Mathematics',
    groups: [
      {
        subject: 'Physics',
        chapters: [
          {
            name: 'Rotational Motion',
            summary: 'Study of rigid body rotation, moment of inertia, torque, and angular momentum',
            keyConcepts: ['Moment of Inertia', 'Torque', 'Angular Momentum', 'Rolling Motion'],
            mustKnow: ['I = Σmr²', 'τ = Iα', 'L = Iω', 'Rolling: v = rω'],
            formulas: ['I = Σmr²', 'τ = Iα', 'L = Iω', 'K.E. = ½Iω²'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Thermodynamics',
            summary: 'Study of heat, work, temperature, and energy transfer',
            keyConcepts: ['Laws of Thermodynamics', 'Entropy', 'Enthalpy', 'Heat Engines'],
            mustKnow: ['First Law: ΔU = Q - W', 'Second Law: Entropy increases', 'Carnot Efficiency'],
            formulas: ['ΔU = Q - W', 'η = 1 - T₂/T₁', 'PV = nRT'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          }
        ]
      },
      {
        subject: 'Chemistry',
        chapters: [
          {
            name: 'Chemical Bonding',
            summary: 'Study of how atoms combine to form molecules',
            keyConcepts: ['Ionic Bond', 'Covalent Bond', 'Hybridization', 'MOT'],
            mustKnow: ['VSEPR Theory', 'Hybridization types', 'Bond order'],
            formulas: ['Bond Order = (Nb - Na)/2'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          }
        ]
      },
      {
        subject: 'Mathematics',
        chapters: [
          {
            name: 'Calculus',
            summary: 'Study of change and motion through derivatives and integrals',
            keyConcepts: ['Limits', 'Derivatives', 'Integration', 'Differential Equations'],
            mustKnow: ['Chain Rule', 'Integration by Parts', 'Fundamental Theorem'],
            formulas: ['d/dx(xⁿ) = nxⁿ⁻¹', '∫xⁿdx = xⁿ⁺¹/(n+1)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Very High'
          }
        ]
      }
    ]
  },
  {
    id: 'hsc-physics',
    label: 'HSC Physics',
    tag: 'HSC-PHY',
    accent: '#ea580c',
    note: 'Maharashtra HSC Physics preparation',
    groups: [
      {
        subject: 'Physics',
        chapters: [
          {
            name: 'Circular Motion',
            summary: 'Motion of objects in circular paths',
            keyConcepts: ['Centripetal Force', 'Angular Velocity', 'Banking of Roads'],
            mustKnow: ['F = mv²/r', 'ω = v/r'],
            formulas: ['F = mv²/r', 'a = v²/r'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          }
        ]
      }
    ]
  },
  {
    id: 'hsc-chemistry',
    label: 'HSC Chemistry',
    tag: 'HSC-CHEM',
    accent: '#16a34a',
    note: 'Maharashtra HSC Chemistry preparation',
    groups: [
      {
        subject: 'Chemistry',
        chapters: [
          {
            name: 'Organic Chemistry',
            summary: 'Study of carbon compounds and their reactions',
            keyConcepts: ['Functional Groups', 'Reaction Mechanisms', 'Isomerism'],
            mustKnow: ['IUPAC Nomenclature', 'Named Reactions'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          }
        ]
      }
    ]
  },
  {
    id: 'hsc-maths',
    label: 'HSC Mathematics',
    tag: 'HSC-MATH',
    accent: '#7c3aed',
    note: 'Maharashtra HSC Mathematics preparation',
    groups: [
      {
        subject: 'Mathematics',
        chapters: [
          {
            name: 'Vectors',
            summary: 'Study of quantities with magnitude and direction',
            keyConcepts: ['Vector Addition', 'Dot Product', 'Cross Product'],
            mustKnow: ['a·b = |a||b|cosθ', 'a×b = |a||b|sinθ n̂'],
            formulas: ['a·b = a₁b₁ + a₂b₂ + a₃b₃'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          }
        ]
      }
    ]
  }
];
