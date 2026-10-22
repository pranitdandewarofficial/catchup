// Complete Exam Data Structure
export interface Chapter {
  name: string;
  summary: string;
  keyConcepts: string[];
  mustKnow: string[];
  formulas: string[];
  deleted: string[];
  deletedChapter: boolean;
  weightage: string;
  // Enhanced fields (optional for backward compatibility)
  detailedConcepts?: string[];
  definitions?: string[];
  laws?: string[];
  theorems?: string[];
  derivations?: string[];
  solvedExamples?: string[];
  misconceptions?: string[];
  exceptions?: string[];
  prerequisites?: string[];
  relatedChapters?: string[];
  revisionNotes?: string[];
  practiceQuestions?: string[];
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

// Study System Data Structures
export type MasteryLevel = 'notStarted' | 'learning' | 'practicing' | 'revising' | 'testReady' | 'mastered';

export type MistakeCategory = 'conceptGap' | 'calculationError' | 'formulaError' | 'misreading' | 'timeManagement';

export type TaskType = 'lecture' | 'conceptStudy' | 'problemPractice' | 'revision' | 'mockTest' | 'writtenAnswer';

export type TaskPriority = 'mustDo' | 'shouldDo' | 'bonus';

export interface DailyTask {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  chapter?: string;
  type: TaskType;
  priority: TaskPriority;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  carriedForward: boolean;
}

export interface Goal {
  id: string;
  type: 'iitBombayCSE' | 'hsc95Plus';
  title: string;
  description: string;
  targetDate?: string;
  progress: number; // 0-100
  milestones: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  targetDate?: string;
  completed: boolean;
  completedAt?: string;
  metrics: Record<string, number>;
}

export interface Mistake {
  id: string;
  date: string;
  subject: string;
  chapter: string;
  questionId?: string;
  category: MistakeCategory;
  description: string;
  correctApproach: string;
  reviewed: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

export interface MockTestResult {
  id: string;
  date: string;
  subject: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  timeTaken: number; // minutes
  accuracy: number; // percentage
  chapterPerformance: Record<string, { correct: number; total: number }>;
  weakTopics: string[];
  notes?: string;
}

export interface WeeklyReview {
  id: string;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;
  tasksPlanned: number;
  tasksCompleted: number;
  chaptersLearned: string[];
  chaptersRevised: string[];
  mockTestsTaken: number;
  averageAccuracy: number;
  weakSubjects: string[];
  recurringMistakes: string[];
  revisionBacklog: string[];
  nextWeekPriorities: string[];
}

export const DATA: ExamTrack[] = [
  // JEE MAIN 2026
  {
    id: 'jee',
    label: 'JEE Main 2026',
    tag: 'JEE',
    accent: '#2563eb',
    note: 'Paper 1: Physics + Chemistry + Mathematics',
    groups: [
      {
        subject: 'Physics',
        chapters: [
          {
            name: 'Units and Measurement',
            summary: 'Fundamental and derived units, SI system, dimensions, error analysis, significant figures. Essential for all numerical problems in physics.',
            keyConcepts: ['SI Units', 'Dimensional Analysis', 'Error Analysis', 'Significant Figures', 'Vernier Caliper', 'Screw Gauge'],
            mustKnow: ['Check dimensional consistency of equations', 'Calculate percentage errors', 'Convert units using dimensional analysis', 'Read vernier caliper and screw gauge correctly'],
            formulas: ['Least Count = Pitch/No. of divisions', 'Percentage Error = (Δx/x)×100', '[X] = M^a L^b T^c'],
            deleted: ['Accuracy & precision of instruments'],
            deletedChapter: false,
            weightage: 'Low'
          },
          {
            name: 'Kinematics',
            summary: 'Motion in 1D and 2D, equations of motion, projectile motion, relative velocity. Foundation for mechanics.',
            keyConcepts: ['Equations of Motion', 'Projectile Motion', 'Relative Velocity', 'Uniform Circular Motion'],
            mustKnow: ['v = u + at, s = ut + ½at², v² = u² + 2as', 'Range R = u²sin2θ/g, Max Height H = u²sin²θ/2g', 'Relative velocity: v_AB = v_A - v_B'],
            formulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'R = u²sin2θ/g', 'H = u²sin²θ/2g', 'T = 2usinθ/g'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Laws of Motion',
            summary: 'Newton\'s laws, friction, circular motion, free body diagrams. Core mechanics concepts.',
            keyConcepts: ['Newton\'s Laws', 'Friction', 'Free Body Diagram', 'Circular Motion', 'Constraint Relations'],
            mustKnow: ['F = ma, draw FBD correctly', 'Static friction: f ≤ μ_sN, Kinetic: f = μ_kN', 'Centripetal force: F = mv²/r', 'Tension is same in massless string'],
            formulas: ['F = ma', 'f = μN', 'F_c = mv²/r', 'a = (m₁-m₂)g/(m₁+m₂)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Work, Energy and Power',
            summary: 'Work-energy theorem, conservation of energy, power, collisions. Important for problem solving.',
            keyConcepts: ['Work-Energy Theorem', 'Conservation of Energy', 'Power', 'Collisions', 'Coefficient of Restitution'],
            mustKnow: ['W = F·s·cosθ, KE = ½mv², PE = mgh', 'W_net = ΔKE', 'Elastic: KE conserved, Inelastic: KE not conserved', 'e = (v₂-v₁)/(u₁-u₂)'],
            formulas: ['W = Fscosθ', 'KE = ½mv²', 'PE = mgh', 'P = W/t = Fv', 'e = (v₂-v₁)/(u₁-u₂)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Rotational Motion',
            summary: 'Rigid body dynamics, moment of inertia, torque, angular momentum, rolling motion. Very important for JEE.',
            keyConcepts: ['Moment of Inertia', 'Torque', 'Angular Momentum', 'Rolling Motion', 'Parallel Axis Theorem', 'Perpendicular Axis Theorem'],
            mustKnow: ['τ = Iα, L = Iω', 'I_ring = MR², I_disc = ½MR², I_sphere = ⅖MR²', 'Rolling: v = Rω, a = Rα', 'Parallel axis: I = I_cm + Md²'],
            formulas: ['τ = Iα', 'L = Iω', 'KE_rot = ½Iω²', 'I = Σmr²', 'I = I_cm + Md²'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Very High',
            detailedConcepts: [
              'Rigid Body: A body in which distance between any two particles remains constant',
              'Axis of Rotation: Fixed line about which all particles perform circular motion',
              'Angular Displacement (θ): Angle rotated by body, measured in radians',
              'Angular Velocity (ω): Rate of change of angular displacement, ω = dθ/dt',
              'Angular Acceleration (α): Rate of change of angular velocity, α = dω/dt',
              'Moment of Inertia (I): Rotational analogue of mass, depends on mass distribution',
              'Radius of Gyration (k): Distance from axis where entire mass can be concentrated to give same I, I = Mk²',
              'Torque (τ): Rotational analogue of force, τ = r × F',
              'Angular Momentum (L): Rotational analogue of linear momentum, L = Iω',
              'Rolling Motion: Combination of translational and rotational motion'
            ],
            definitions: [
              'Moment of Inertia: I = Σmᵢrᵢ² where rᵢ is perpendicular distance from axis',
              'Torque: τ = rFsinθ where θ is angle between r and F',
              'Angular Momentum: L = r × p = Iω',
              'Radius of Gyration: k = √(I/M)',
              'Rolling without slipping: v_cm = Rω and a_cm = Rα'
            ],
            laws: [
              'Newton\'s Second Law for Rotation: τ_net = Iα',
              'Conservation of Angular Momentum: If τ_ext = 0, then L = constant',
              'Work-Energy Theorem for Rotation: W_net = ΔKE_rot = ½Iω₂² - ½Iω₁²',
              'Parallel Axis Theorem: I = I_cm + Md²',
              'Perpendicular Axis Theorem: I_z = I_x + I_y (for planar bodies only)'
            ],
            derivations: [
              'Moment of Inertia of Ring: I = ∫dm·R² = MR² (all mass at distance R)',
              'Moment of Inertia of Disc: I = ∫₀ᴿ (2πr·dr·σ)·r² = ½MR²',
              'Moment of Inertia of Solid Sphere: I = ⅖MR²',
              'Rolling KE: KE_total = ½Mv² + ½Iω² = ½Mv²(1 + k²/R²)',
              'Acceleration on incline: a = gsinθ/(1 + k²/R²)'
            ],
            solvedExamples: [
              'Q: Find MI of uniform rod about center. A: I = ML²/12 (integrate dm·x² from -L/2 to L/2)',
              'Q: Disc rolls without slipping. Find velocity of topmost point. A: v_top = v_cm + Rω = 2v_cm',
              'Q: Two discs collide and stick. Find final angular velocity. A: Use conservation of L: I₁ω₁ = (I₁+I₂)ω₂',
              'Q: Find acceleration of cylinder rolling down incline. A: a = gsinθ/(1 + I/MR²) = ⅔gsinθ'
            ],
            misconceptions: [
              'MI depends only on mass - WRONG: It depends on mass distribution (shape and axis)',
              'Rolling means no friction - WRONG: Static friction is essential for rolling without slipping',
              'Angular momentum is always conserved - WRONG: Only when net external torque is zero',
              'Perpendicular axis theorem applies to 3D bodies - WRONG: Only for planar/laminar bodies',
              'Torque and force are same - WRONG: Torque is r × F, depends on point of application'
            ],
            exceptions: [
              'MI of thin rod about end: ML²/3 (not ML²/12)',
              'MI of hollow sphere: ⅔MR² (not ⅖MR²)',
              'MI of cylindrical shell: MR² (not ½MR²)',
              'For non-uniform bodies, must integrate: I = ∫r²dm',
              'Perpendicular axis theorem fails for 3D bodies'
            ],
            prerequisites: ['Laws of Motion', 'Work Energy and Power', 'Center of Mass'],
            relatedChapters: ['Gravitation', 'Oscillations', 'Mechanical Properties of Solids'],
            revisionNotes: [
              'Standard MI values: Ring=MR², Disc=½MR², Sphere=⅖MR², Rod(center)=ML²/12',
              'Rolling condition: v = Rω (no slipping)',
              'Total KE in rolling: ½Mv²(1 + k²/R²)',
              'Conservation of L: I₁ω₁ = I₂ω₂ (when τ_ext = 0)',
              'Torque: τ = rFsinθ = Iα'
            ],
            practiceQuestions: [
              'Calculate MI of uniform circular disc about tangent in its plane',
              'A solid sphere rolls down an incline. Find ratio of translational to rotational KE',
              'Two identical discs rotating in opposite directions are brought in contact. Find final state',
              'Find angular acceleration of a wheel when torque of 10 Nm is applied, I = 2 kg·m²'
            ]
          },
          {
            name: 'Gravitation',
            summary: 'Newton\'s law of gravitation, gravitational potential, escape velocity, satellites, Kepler\'s laws.',
            keyConcepts: ['Universal Gravitation', 'Gravitational Potential', 'Escape Velocity', 'Orbital Velocity', 'Kepler\'s Laws'],
            mustKnow: ['F = GMm/r², g = GM/R²', 'v_escape = √(2gR), v_orbital = √(gR)', 'T² ∝ r³ (Kepler\'s 3rd law)', 'PE = -GMm/r'],
            formulas: ['F = GMm/r²', 'g = GM/R²', 'v_e = √(2GM/R)', 'v_o = √(GM/r)', 'T² = (4π²/GM)r³'],
            deleted: ['Geostationary satellites'],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Properties of Solids and Liquids',
            summary: 'Elasticity, viscosity, surface tension, fluid mechanics. Important practical applications.',
            keyConcepts: ['Elasticity', 'Viscosity', 'Surface Tension', 'Bernoulli\'s Theorem', 'Terminal Velocity'],
            mustKnow: ['Stress = F/A, Strain = ΔL/L, Y = Stress/Strain', 'Stokes: F = 6πηrv', 'Surface tension: T = F/l', 'Bernoulli: P + ½ρv² + ρgh = constant'],
            formulas: ['Y = FL/AΔL', 'F = 6πηrv', 'v_t = 2r²(ρ-σ)g/9η', 'P + ½ρv² + ρgh = const'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Thermodynamics',
            summary: 'Laws of thermodynamics, heat engines, entropy, kinetic theory of gases. Conceptual and numerical.',
            keyConcepts: ['Zeroth Law', 'First Law', 'Second Law', 'Entropy', 'Heat Engines', 'Kinetic Theory'],
            mustKnow: ['ΔU = Q - W', 'η = 1 - T₂/T₁ (Carnot)', 'PV = nRT, KE = 3/2 kT', 'C_P - C_V = R'],
            formulas: ['ΔU = Q - W', 'η = 1 - T₂/T₁', 'PV = nRT', 'C_P - C_V = R', 'KE = 3/2 kT'],
            deleted: ['Carnot engine'],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Kinetic Theory of Gases',
            summary: 'Ideal gas equation, molecular speeds, degrees of freedom, equipartition of energy.',
            keyConcepts: ['Ideal Gas', 'RMS Speed', 'Degrees of Freedom', 'Equipartition', 'Mean Free Path'],
            mustKnow: ['PV = nRT = NkT', 'v_rms = √(3RT/M)', 'KE = f/2 kT per molecule', 'C_V = fR/2, C_P = C_V + R'],
            formulas: ['PV = nRT', 'v_rms = √(3RT/M)', 'v_avg = √(8RT/πM)', 'KE = 3/2 kT'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Oscillations and Waves',
            summary: 'Simple harmonic motion, damped and forced oscillations, wave motion, sound waves, Doppler effect.',
            keyConcepts: ['SHM', 'Damped Oscillation', 'Resonance', 'Wave Equation', 'Superposition', 'Doppler Effect'],
            mustKnow: ['x = Asin(ωt + φ)', 'T = 2π√(m/k), T = 2π√(l/g)', 'v = fλ', 'Doppler: f\' = f(v±v_o)/(v∓v_s)'],
            formulas: ['x = Asin(ωt + φ)', 'T = 2π/ω', 'v = √(T/μ)', 'f\' = f(v±v_o)/(v∓v_s)'],
            deleted: ['Free, forced and damped oscillations', 'Resonance', 'Doppler effect in sound'],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Electrostatics',
            summary: 'Coulomb\'s law, electric field, potential, Gauss\'s law, capacitance. Foundation for electromagnetism.',
            keyConcepts: ['Coulomb\'s Law', 'Electric Field', 'Electric Potential', 'Gauss\'s Law', 'Capacitance'],
            mustKnow: ['F = kq₁q₂/r², E = F/q', 'V = kQ/r, U = kq₁q₂/r', '∮E·dA = q/ε₀', 'C = Q/V, C_parallel plate = ε₀A/d'],
            formulas: ['F = kq₁q₂/r²', 'E = kQ/r²', 'V = kQ/r', 'C = ε₀A/d', 'U = ½CV²'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Current Electricity',
            summary: 'Ohm\'s law, Kirchhoff\'s laws, Wheatstone bridge, potentiometer, electrical energy and power.',
            keyConcepts: ['Ohm\'s Law', 'Kirchhoff\'s Laws', 'Wheatstone Bridge', 'Potentiometer', 'Electrical Power'],
            mustKnow: ['V = IR, P = VI = I²R', 'KVL: ΣV = 0, KCL: ΣI = 0', 'Wheatstone balanced: P/Q = R/S', 'H = I²Rt'],
            formulas: ['V = IR', 'P = VI = I²R', 'H = I²Rt', 'R = ρL/A'],
            deleted: ['Potentiometer', 'Colour code', 'Resistance of different materials'],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Magnetic Effects of Current and Magnetism',
            summary: 'Biot-Savart law, Ampere\'s law, force on moving charge, magnetic dipole, earth\'s magnetism.',
            keyConcepts: ['Biot-Savart Law', 'Ampere\'s Law', 'Lorentz Force', 'Magnetic Dipole', 'Earth\'s Magnetism'],
            mustKnow: ['dB = (μ₀/4π)(Idl×r̂)/r²', 'F = qv×B', 'τ = m×B', 'B_solenoid = μ₀nI'],
            formulas: ['B = μ₀I/2πr', 'F = qvBsinθ', 'τ = NIABsinθ', 'B = μ₀nI'],
            deleted: ['Cyclotron', 'Susceptibility', 'Hysteresis', 'Electromagnets'],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Electromagnetic Induction and Alternating Currents',
            summary: 'Faraday\'s law, Lenz\'s law, self and mutual inductance, AC circuits, transformers.',
            keyConcepts: ['Faraday\'s Law', 'Lenz\'s Law', 'Self Inductance', 'Mutual Inductance', 'AC Circuits', 'Transformers'],
            mustKnow: ['ε = -dΦ/dt', 'L = NΦ/I, M = N₂Φ₁₂/I₁', 'X_L = ωL, X_C = 1/ωC', 'V_rms = V₀/√2'],
            formulas: ['ε = -dΦ/dt', 'U = ½LI²', 'Z = √(R² + (X_L-X_C)²)', 'P = V_rms I_rms cosφ'],
            deleted: ['Quality factor'],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Electromagnetic Waves',
            summary: 'Maxwell\'s equations, electromagnetic spectrum, properties of EM waves.',
            keyConcepts: ['Maxwell\'s Equations', 'EM Spectrum', 'Properties of EM Waves'],
            mustKnow: ['c = 1/√(μ₀ε₀)', 'E and B perpendicular to each other and direction of propagation', 'Energy: u = ½(ε₀E² + B²/μ₀)'],
            formulas: ['c = 1/√(μ₀ε₀)', 'c = fλ'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Low'
          },
          {
            name: 'Optics',
            summary: 'Ray optics (reflection, refraction, lenses, mirrors) and wave optics (interference, diffraction, polarization).',
            keyConcepts: ['Reflection', 'Refraction', 'Lenses', 'Mirrors', 'Interference', 'Diffraction', 'Polarization'],
            mustKnow: ['Mirror: 1/v + 1/u = 1/f', 'Lens: 1/v - 1/u = 1/f', 'Snell\'s: n₁sinθ₁ = n₂sinθ₂', 'YDSE: β = λD/d'],
            formulas: ['1/v + 1/u = 1/f', '1/v - 1/u = 1/f', 'n₁sinθ₁ = n₂sinθ₂', 'β = λD/d', 'P = 1/f'],
            deleted: ['Resolving power of microscopes and telescopes'],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Dual Nature of Matter and Radiation',
            summary: 'Photoelectric effect, matter waves, de Broglie hypothesis, Davisson-Germer experiment.',
            keyConcepts: ['Photoelectric Effect', 'Matter Waves', 'de Broglie Wavelength', 'Davisson-Germer'],
            mustKnow: ['E = hν, p = h/λ', 'KE_max = hν - φ', 'λ = h/p = h/mv', 'λ = 12.27/√V Å for electrons'],
            formulas: ['E = hν', 'KE = hν - φ', 'λ = h/p', 'λ = h/√(2mKE)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Atoms and Nuclei',
            summary: 'Bohr model, hydrogen spectrum, nuclear structure, radioactivity, nuclear fission and fusion.',
            keyConcepts: ['Bohr Model', 'Hydrogen Spectrum', 'Nuclear Structure', 'Radioactivity', 'Fission & Fusion'],
            mustKnow: ['E_n = -13.6/n² eV', 'r_n = 0.529n² Å', '1/λ = R(1/n₁² - 1/n₂²)', 'N = N₀e^(-λt)'],
            formulas: ['E = -13.6Z²/n² eV', 'r = 0.529n²/Z Å', '1/λ = R(1/n₁² - 1/n₂²)', 'T₁/₂ = 0.693/λ'],
            deleted: ['Isotopes, isobars, isotones', 'Radioactive decay law'],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Electronic Devices',
            summary: 'Semiconductors, diodes, transistors, logic gates, applications in electronics.',
            keyConcepts: ['Semiconductors', 'p-n Junction', 'Diodes', 'Transistors', 'Logic Gates'],
            mustKnow: ['n-type: donor impurity, p-type: acceptor', 'Forward bias: low resistance, Reverse: high', 'β = I_C/I_B, α = I_C/I_E', 'Logic gates: AND, OR, NOT, NAND, NOR'],
            formulas: ['I = I₀(e^(eV/kT) - 1)', 'β = I_C/I_B', 'α = β/(1+β)'],
            deleted: ['Transistor as amplifier', 'Oscillator'],
            deletedChapter: false,
            weightage: 'Medium'
          }
        ]
      },
      {
        subject: 'Chemistry',
        chapters: [
          {
            name: 'Some Basic Concepts of Chemistry',
            summary: 'Mole concept, stoichiometry, empirical and molecular formulas, laws of chemical combination.',
            keyConcepts: ['Mole Concept', 'Stoichiometry', 'Laws of Chemical Combination', 'Limiting Reagent'],
            mustKnow: ['1 mole = 6.022×10²³ particles', 'Molarity = moles/volume(L)', 'Limiting reagent determines product amount'],
            formulas: ['n = m/M = N/N_A', 'Molarity = n/V', 'Molality = n/kg solvent'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Atomic Structure',
            summary: 'Quantum numbers, electronic configuration, Bohr model, quantum mechanical model of atom.',
            keyConcepts: ['Quantum Numbers', 'Electronic Configuration', 'Bohr Model', 'Orbitals'],
            mustKnow: ['n, l, m_l, m_s quantum numbers', 'Aufbau, Pauli, Hund rules', 'E_n = -13.6/n² eV for hydrogen'],
            formulas: ['E = -13.6Z²/n² eV', 'λ = h/p', 'mvr = nh/2π'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Chemical Bonding and Molecular Structure',
            summary: 'Ionic and covalent bonds, VSEPR theory, hybridization, molecular orbital theory.',
            keyConcepts: ['Ionic Bond', 'Covalent Bond', 'VSEPR Theory', 'Hybridization', 'MOT'],
            mustKnow: ['VSEPR: LP-LP > LP-BP > BP-BP repulsion', 'sp³: 109.5°, sp²: 120°, sp: 180°', 'Bond order = (Nb-Na)/2'],
            formulas: ['Bond Order = (Nb-Na)/2', 'μ = q×d', '% ionic character = (μ_obs/μ_ionic)×100'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Chemical Thermodynamics',
            summary: 'Laws of thermodynamics, enthalpy, entropy, Gibbs free energy, spontaneity.',
            keyConcepts: ['Enthalpy', 'Entropy', 'Gibbs Free Energy', 'Hess\'s Law', 'Spontaneity'],
            mustKnow: ['ΔG = ΔH - TΔS', 'ΔG < 0: spontaneous', 'ΔG° = -RTlnK'],
            formulas: ['ΔH = ΔU + Δ(PV)', 'ΔG = ΔH - TΔS', 'ΔG° = -RTlnK'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Equilibrium',
            summary: 'Chemical equilibrium, law of mass action, Le Chatelier\'s principle, ionic equilibrium, pH.',
            keyConcepts: ['Chemical Equilibrium', 'Le Chatelier\'s Principle', 'Ionic Equilibrium', 'pH', 'Buffer Solutions'],
            mustKnow: ['K_c = [products]/[reactants]', 'pH = -log[H⁺]', 'Henderson: pH = pK_a + log([salt]/[acid])'],
            formulas: ['K_p = K_c(RT)^Δn', 'pH = -log[H⁺]', 'pH = pK_a + log([A⁻]/[HA])'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Redox Reactions and Electrochemistry',
            summary: 'Oxidation-reduction, balancing redox reactions, electrochemical cells, Nernst equation.',
            keyConcepts: ['Oxidation-Reduction', 'Electrochemical Cells', 'Nernst Equation', 'Conductance'],
            mustKnow: ['E_cell = E_cathode - E_anode', 'Nernst: E = E° - (RT/nF)lnQ', 'ΔG = -nFE'],
            formulas: ['E = E° - (0.0591/n)logQ', 'ΔG = -nFE', 'Λ_m = κ×1000/C'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Chemical Kinetics',
            summary: 'Rate of reaction, order and molecularity, Arrhenius equation, collision theory.',
            keyConcepts: ['Rate Law', 'Order of Reaction', 'Arrhenius Equation', 'Half-life'],
            mustKnow: ['Rate = k[A]^m[B]^n', 't₁/₂ = 0.693/k (first order)', 'k = Ae^(-Ea/RT)'],
            formulas: ['Rate = k[A]^n', 't₁/₂ = 0.693/k', 'ln(k₂/k₁) = Ea/R(1/T₁ - 1/T₂)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Classification of Elements and Periodicity',
            summary: 'Periodic table, periodic trends, atomic and ionic radii, ionization energy, electronegativity.',
            keyConcepts: ['Periodic Table', 'Atomic Radius', 'Ionization Energy', 'Electronegativity', 'Electron Affinity'],
            mustKnow: ['Atomic radius: decreases across period, increases down group', 'IE: increases across period, decreases down group', 'EN: F > O > N > C'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'p-Block Elements',
            summary: 'Group 13-18 elements, important compounds, anomalies of first member, ozone, sulfuric acid.',
            keyConcepts: ['Boron Family', 'Carbon Family', 'Nitrogen Family', 'Oxygen Family', 'Halogens', 'Noble Gases'],
            mustKnow: ['Inert pair effect in heavier elements', 'Oxidation states and their stability', 'Important compounds: HNO₃, H₂SO₄, HCl'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'd and f Block Elements',
            summary: 'Transition metals, inner transition metals, important compounds, KMnO₄, K₂Cr₂O₇.',
            keyConcepts: ['Transition Metals', 'Inner Transition Metals', 'Coloured Ions', 'Magnetic Properties', 'Catalytic Properties'],
            mustKnow: ['Variable oxidation states', 'Coloured ions due to d-d transition', 'Paramagnetic: unpaired electrons'],
            formulas: ['μ = √(n(n+2)) BM'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Coordination Compounds',
            summary: 'Werner\'s theory, IUPAC nomenclature, bonding, isomerism, stability, importance.',
            keyConcepts: ['Werner\'s Theory', 'IUPAC Nomenclature', 'VBT and CFT', 'Isomerism', 'Stability'],
            mustKnow: ['Coordination number and geometry', 'Crystal field splitting: Δ_o and Δ_t', 'Colour and magnetic properties'],
            formulas: ['Δ_t = 4/9 Δ_o'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Organic Chemistry: Some Basic Principles',
            summary: 'IUPAC nomenclature, electronic displacements, reaction mechanisms, purification techniques.',
            keyConcepts: ['IUPAC Nomenclature', 'Inductive Effect', 'Resonance', 'Hyperconjugation', 'Reaction Mechanisms'],
            mustKnow: ['Priority order for functional groups', '+I and -I effects', '+M and -M effects', 'Stability of carbocations and carbanions'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Hydrocarbons',
            summary: 'Alkanes, alkenes, alkynes, aromatic hydrocarbons, preparation and properties.',
            keyConcepts: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic Hydrocarbons', 'Named Reactions'],
            mustKnow: ['Markovnikov and anti-Markovnikov addition', 'Saytzeff rule', 'Electrophilic aromatic substitution'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Haloalkanes and Haloarenes',
            summary: 'Nomenclature, preparation, properties, reaction mechanisms (SN1, SN2, E1, E2).',
            keyConcepts: ['Nucleophilic Substitution', 'Elimination Reactions', 'SN1 vs SN2', 'E1 vs E2'],
            mustKnow: ['SN1: 3° > 2° > 1°, SN2: 1° > 2° > 3°', 'E2: anti-periplanar arrangement', 'Wurtz, Fittig reactions'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Aldehydes, Ketones and Carboxylic Acids',
            summary: 'Nomenclature, preparation, properties, named reactions, acidity of carboxylic acids.',
            keyConcepts: ['Carbonyl Compounds', 'Nucleophilic Addition', 'Named Reactions', 'Acidity'],
            mustKnow: ['Aldol condensation: α-H present', 'Cannizzaro: no α-H', 'Reactivity: aldehydes > ketones', 'Acidity: RCOOH > phenol > alcohol'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Very High'
          },
          {
            name: 'Amines',
            summary: 'Classification, nomenclature, preparation, properties, basicity, diazonium salts.',
            keyConcepts: ['Classification', 'Basicity', 'Diazonium Salts', 'Named Reactions'],
            mustKnow: ['Basicity: 2° > 1° > 3° > NH₃ (in gas phase)', 'Diazonium salts: Sandmeyer, Gattermann reactions', 'Hoffmann bromamide reaction'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Biomolecules',
            summary: 'Carbohydrates, proteins, nucleic acids, vitamins, hormones.',
            keyConcepts: ['Carbohydrates', 'Proteins', 'Nucleic Acids', 'Vitamins'],
            mustKnow: ['Monosaccharides, disaccharides, polysaccharides', 'Amino acids, peptide bonds, protein structure', 'DNA and RNA differences'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          }
        ]
      },
      {
        subject: 'Mathematics',
        chapters: [
          {
            name: 'Sets, Relations and Functions',
            summary: 'Sets, types of sets, operations, relations, functions, types of functions.',
            keyConcepts: ['Sets', 'Relations', 'Functions', 'Domain and Range'],
            mustKnow: ['Union, intersection, complement', 'Reflexive, symmetric, transitive relations', 'One-one, onto functions'],
            formulas: ['n(A∪B) = n(A) + n(B) - n(A∩B)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Complex Numbers and Quadratic Equations',
            summary: 'Complex numbers, algebra of complex numbers, modulus, argument, quadratic equations.',
            keyConcepts: ['Complex Numbers', 'Modulus and Argument', 'Quadratic Equations', 'Nature of Roots'],
            mustKnow: ['z = a + ib, |z| = √(a²+b²)', 'ω, ω² cube roots of unity: 1+ω+ω² = 0', 'Discriminant D = b²-4ac'],
            formulas: ['|z| = √(a²+b²)', 'arg(z) = tan⁻¹(b/a)', 'α+β = -b/a, αβ = c/a'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Matrices and Determinants',
            summary: 'Matrices, operations, transpose, inverse, determinants, properties, applications.',
            keyConcepts: ['Matrices', 'Determinants', 'Inverse', 'System of Equations'],
            mustKnow: ['AB ≠ BA in general', '|AB| = |A||B|', 'A⁻¹ = adj(A)/|A|', 'Cramer\'s rule for 3 variables'],
            formulas: ['|A| = a₁₁(a₂₂a₃₃-a₂₃a₃₂) - ...', 'A⁻¹ = adj(A)/|A|', 'X = A⁻¹B'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Permutations and Combinations',
            summary: 'Fundamental principle of counting, permutations, combinations, binomial theorem.',
            keyConcepts: ['Counting Principle', 'Permutations', 'Combinations', 'Binomial Theorem'],
            mustKnow: ['nPr = n!/(n-r)!', 'nCr = n!/[r!(n-r)!]', 'nCr = nC(n-r)', '(a+b)ⁿ = ΣnCr a^(n-r) b^r'],
            formulas: ['nPr = n!/(n-r)!', 'nCr = n!/[r!(n-r)!]', 'ΣnCr = 2ⁿ'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Binomial Theorem and Its Applications',
            summary: 'Binomial theorem for positive integral indices, general term, middle term, properties.',
            keyConcepts: ['Binomial Theorem', 'General Term', 'Middle Term', 'Properties'],
            mustKnow: ['T(r+1) = nCr a^(n-r) b^r', 'Middle term: T(n/2+1) if n even', 'Sum of coefficients: put x=1'],
            formulas: ['(a+b)ⁿ = ΣnCr a^(n-r) b^r', 'T(r+1) = nCr a^(n-r) b^r'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Sequence and Series',
            summary: 'Arithmetic progression, geometric progression, arithmetic-geometric series, special series.',
            keyConcepts: ['AP', 'GP', 'AGP', 'Special Series'],
            mustKnow: ['AP: a, a+d, a+2d,... S_n = n/2[2a+(n-1)d]', 'GP: a, ar, ar²,... S_n = a(rⁿ-1)/(r-1)', 'Σn = n(n+1)/2, Σn² = n(n+1)(2n+1)/6'],
            formulas: ['S_n = n/2[2a+(n-1)d]', 'S_∞ = a/(1-r) for |r|<1', 'Σn² = n(n+1)(2n+1)/6'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Limits, Continuity and Differentiability',
            summary: 'Limits, continuity, differentiability, rules of differentiation, Rolle\'s and Lagrange\'s theorems.',
            keyConcepts: ['Limits', 'Continuity', 'Differentiability', 'Rules of Differentiation'],
            mustKnow: ['lim(x→0) sinx/x = 1', 'lim(x→0) (1+x)^(1/x) = e', 'f continuous at a: lim(x→a)f(x) = f(a)'],
            formulas: ['d/dx(xⁿ) = nxⁿ⁻¹', 'd/dx(eˣ) = eˣ', 'd/dx(lnx) = 1/x'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Applications of Derivatives',
            summary: 'Rate of change, increasing/decreasing functions, tangents and normals, maxima and minima.',
            keyConcepts: ['Rate of Change', 'Tangents and Normals', 'Increasing/Decreasing', 'Maxima and Minima'],
            mustKnow: ['dy/dx = slope of tangent', 'f\'(x) > 0: increasing, f\'(x) < 0: decreasing', 'f\'(x) = 0, f\'\'(x) < 0: maxima'],
            formulas: ['dy/dx = f\'(x)', 'Equation of tangent: y-y₁ = m(x-x₁)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Integrals',
            summary: 'Integration as anti-derivative, methods of integration, definite integrals, applications.',
            keyConcepts: ['Indefinite Integrals', 'Definite Integrals', 'Methods of Integration', 'Applications'],
            mustKnow: ['∫xⁿdx = x^(n+1)/(n+1) + C', '∫eˣdx = eˣ + C', '∫₁/x dx = ln|x| + C'],
            formulas: ['∫xⁿdx = x^(n+1)/(n+1) + C', '∫ₐᵇf(x)dx = F(b) - F(a)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Differential Equations',
            summary: 'Order and degree, formation, solution of differential equations, variable separable, linear.',
            keyConcepts: ['Order and Degree', 'Formation', 'Solution', 'Linear Differential Equations'],
            mustKnow: ['Order = highest derivative, Degree = power of highest derivative', 'Variable separable: dy/dx = f(x)g(y)', 'Linear: dy/dx + Py = Q, IF = e^∫Pdx'],
            formulas: ['dy/dx + Py = Q', 'y·IF = ∫Q·IF dx + C', 'IF = e^∫Pdx'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Vector Algebra',
            summary: 'Vectors and scalars, addition, multiplication, dot and cross products, applications.',
            keyConcepts: ['Vector Addition', 'Dot Product', 'Cross Product', 'Applications'],
            mustKnow: ['a·b = |a||b|cosθ', 'a×b = |a||b|sinθ n̂', 'a·a = |a|², a×a = 0'],
            formulas: ['a·b = a₁b₁ + a₂b₂ + a₃b₃', 'a×b = |i j k; a₁ a₂ a₃; b₁ b₂ b₃|'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Three Dimensional Geometry',
            summary: 'Direction cosines and ratios, equation of line and plane, angle between them, distance.',
            keyConcepts: ['Direction Cosines', 'Equation of Line', 'Equation of Plane', 'Angle and Distance'],
            mustKnow: ['l² + m² + n² = 1', 'Line: (x-x₁)/a = (y-y₁)/b = (z-z₁)/c', 'Plane: ax+by+cz = d'],
            formulas: ['cosθ = |a₁a₂+b₁b₂+c₁c₂|/√(a₁²+b₁²+c₁²)√(a₂²+b₂²+c₂²)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Probability',
            summary: 'Events, probability, conditional probability, Bayes\' theorem, random variables.',
            keyConcepts: ['Probability', 'Conditional Probability', 'Bayes\' Theorem', 'Random Variables'],
            mustKnow: ['P(A∪B) = P(A) + P(B) - P(A∩B)', 'P(A|B) = P(A∩B)/P(B)', 'Bayes: P(Aᵢ|B) = P(B|Aᵢ)P(Aᵢ)/ΣP(B|Aⱼ)P(Aⱼ)'],
            formulas: ['P(A) = n(A)/n(S)', 'P(A∪B) = P(A) + P(B) - P(A∩B)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Trigonometry',
            summary: 'Trigonometric functions, identities, equations, properties of triangles, inverse trigonometric functions.',
            keyConcepts: ['Trigonometric Functions', 'Identities', 'Equations', 'Inverse Functions'],
            mustKnow: ['sin²θ + cos²θ = 1', 'sin2A = 2sinAcosA', 'cos2A = cos²A - sin²A'],
            formulas: ['sin(A+B) = sinAcosB + cosAsinB', 'cos(A+B) = cosAcosB - sinAsinB'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Mathematical Reasoning',
            summary: 'Statements, logical operations, validity of statements, implications.',
            keyConcepts: ['Statements', 'Logical Operations', 'Validity', 'Implications'],
            mustKnow: ['AND, OR, NOT operations', 'Implication: p→q', 'Contrapositive: ~q→~p'],
            formulas: [],
            deleted: [],
            deletedChapter: true,
            weightage: 'Low'
          }
        ]
      }
    ]
  },
  // HSC Physics
  {
    id: 'hsc-physics',
    label: 'HSC 12th Physics',
    tag: 'HSC-PHY',
    accent: '#ea580c',
    note: 'Maharashtra State Board HSC Science - Physics',
    groups: [
      {
        subject: 'Physics',
        chapters: [
          {
            name: 'Rotational Dynamics',
            summary: 'Circular motion, centripetal force, moment of inertia, torque, angular momentum, rolling motion.',
            keyConcepts: ['Circular Motion', 'Moment of Inertia', 'Torque', 'Angular Momentum', 'Rolling'],
            mustKnow: ['F_c = mv²/r', 'τ = Iα', 'L = Iω', 'v = Rω for rolling'],
            formulas: ['F_c = mv²/r', 'τ = Iα', 'L = Iω', 'KE = ½Iω²'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Mechanical Properties of Fluids',
            summary: 'Fluid statics, dynamics, viscosity, surface tension, Bernoulli\'s theorem, applications.',
            keyConcepts: ['Fluid Statics', 'Viscosity', 'Surface Tension', 'Bernoulli\'s Theorem'],
            mustKnow: ['P = hρg', 'Stokes: F = 6πηrv', 'T = F/l', 'P + ½ρv² + ρgh = constant'],
            formulas: ['P = hρg', 'F = 6πηrv', 'T = F/l', 'v_t = 2r²(ρ-σ)g/9η'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Kinetic Theory of Gases and Radiation',
            summary: 'Ideal gas, kinetic theory, gas laws, radiation, black body radiation, Wien\'s law.',
            keyConcepts: ['Kinetic Theory', 'Gas Laws', 'Radiation', 'Black Body'],
            mustKnow: ['PV = nRT', 'KE = 3/2 kT', 'v_rms = √(3RT/M)', 'λ_max T = constant'],
            formulas: ['PV = nRT', 'KE = 3/2 kT', 'v_rms = √(3RT/M)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Thermodynamics',
            summary: 'Laws of thermodynamics, heat engines, refrigerators, entropy, applications.',
            keyConcepts: ['Laws of Thermodynamics', 'Heat Engines', 'Refrigerators', 'Entropy'],
            mustKnow: ['ΔU = Q - W', 'η = 1 - T₂/T₁', 'COP = T₂/(T₁-T₂)'],
            formulas: ['ΔU = Q - W', 'η = 1 - T₂/T₁'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Oscillations',
            summary: 'Simple harmonic motion, composition of SHM, damped and forced oscillations, resonance.',
            keyConcepts: ['SHM', 'Composition of SHM', 'Damped Oscillations', 'Resonance'],
            mustKnow: ['x = Asin(ωt + φ)', 'T = 2π√(m/k)', 'T = 2π√(l/g)'],
            formulas: ['x = Asin(ωt + φ)', 'T = 2π/ω', 'v_max = Aω'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Superposition of Waves',
            summary: 'Wave motion, superposition, interference, standing waves, beats, Doppler effect.',
            keyConcepts: ['Wave Motion', 'Superposition', 'Interference', 'Beats', 'Doppler Effect'],
            mustKnow: ['y = Asin(ωt - kx)', 'v = fλ', 'Beat frequency = |f₁ - f₂|'],
            formulas: ['y = Asin(ωt - kx)', 'v = fλ', 'f_beat = |f₁ - f₂|'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Wave Optics',
            summary: 'Huygens\' principle, interference, diffraction, polarization, applications.',
            keyConcepts: ['Huygens\' Principle', 'Interference', 'Diffraction', 'Polarization'],
            mustKnow: ['Path difference = d sinθ', 'β = λD/d (YDSE)', 'Malus\' law: I = I₀cos²θ'],
            formulas: ['β = λD/d', 'I = I₀cos²θ'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Electrostatics',
            summary: 'Coulomb\'s law, electric field, potential, capacitance, dielectrics, applications.',
            keyConcepts: ['Coulomb\'s Law', 'Electric Field', 'Potential', 'Capacitance'],
            mustKnow: ['F = kq₁q₂/r²', 'E = kQ/r²', 'V = kQ/r', 'C = ε₀A/d'],
            formulas: ['F = kq₁q₂/r²', 'E = kQ/r²', 'V = kQ/r', 'C = ε₀A/d'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Current Electricity',
            summary: 'Ohm\'s law, Kirchhoff\'s laws, Wheatstone bridge, potentiometer, electrical power.',
            keyConcepts: ['Ohm\'s Law', 'Kirchhoff\'s Laws', 'Wheatstone Bridge', 'Electrical Power'],
            mustKnow: ['V = IR', 'P = VI = I²R', 'KVL: ΣV = 0', 'KCL: ΣI = 0'],
            formulas: ['V = IR', 'P = VI', 'H = I²Rt'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Magnetic Effects of Electric Current',
            summary: 'Biot-Savart law, Ampere\'s law, force on current carrying conductor, moving coil galvanometer.',
            keyConcepts: ['Biot-Savart Law', 'Ampere\'s Law', 'Force on Conductor', 'Galvanometer'],
            mustKnow: ['dB = (μ₀/4π)(Idl×r̂)/r²', 'F = BIl sinθ', 'B = μ₀nI (solenoid)'],
            formulas: ['B = μ₀I/2πr', 'F = BIl sinθ', 'B = μ₀nI'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Magnetism',
            summary: 'Bar magnet, earth\'s magnetism, magnetic properties of materials, hysteresis.',
            keyConcepts: ['Bar Magnet', 'Earth\'s Magnetism', 'Magnetic Materials', 'Hysteresis'],
            mustKnow: ['Magnetic moment: M = m×2l', 'B_H = μ₀M/4πr³', 'Diamagnetic, paramagnetic, ferromagnetic'],
            formulas: ['M = m×2l'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Low'
          },
          {
            name: 'Electromagnetic Induction',
            summary: 'Faraday\'s law, Lenz\'s law, self and mutual inductance, eddy currents, applications.',
            keyConcepts: ['Faraday\'s Law', 'Lenz\'s Law', 'Self Inductance', 'Mutual Inductance'],
            mustKnow: ['ε = -dΦ/dt', 'L = NΦ/I', 'M = N₂Φ₁₂/I₁', 'U = ½LI²'],
            formulas: ['ε = -dΦ/dt', 'U = ½LI²'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'AC Circuits',
            summary: 'AC voltage and current, LC oscillations, LCR series circuit, resonance, power in AC.',
            keyConcepts: ['AC Voltage', 'LC Oscillations', 'LCR Circuit', 'Resonance', 'Power'],
            mustKnow: ['V = V₀sinωt', 'X_L = ωL, X_C = 1/ωC', 'Z = √(R² + (X_L-X_C)²)', 'ω₀ = 1/√(LC)'],
            formulas: ['X_L = ωL', 'X_C = 1/ωC', 'Z = √(R² + (X_L-X_C)²)', 'P = V_rms I_rms cosφ'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Dual Nature of Radiation and Matter',
            summary: 'Photoelectric effect, Einstein\'s equation, matter waves, de Broglie hypothesis, Davisson-Germer.',
            keyConcepts: ['Photoelectric Effect', 'Einstein\'s Equation', 'Matter Waves', 'de Broglie Wavelength'],
            mustKnow: ['E = hν', 'KE_max = hν - φ', 'λ = h/p', 'λ = h/√(2mKE)'],
            formulas: ['E = hν', 'KE = hν - φ', 'λ = h/p'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Structure of Atoms and Nuclei',
            summary: 'Bohr model, hydrogen spectrum, nuclear structure, radioactivity, nuclear fission and fusion.',
            keyConcepts: ['Bohr Model', 'Hydrogen Spectrum', 'Nuclear Structure', 'Radioactivity'],
            mustKnow: ['E_n = -13.6/n² eV', 'r_n = 0.529n² Å', '1/λ = R(1/n₁² - 1/n₂²)', 'N = N₀e^(-λt)'],
            formulas: ['E = -13.6Z²/n² eV', 'r = 0.529n²/Z Å', 'T₁/₂ = 0.693/λ'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Semiconductor Devices',
            summary: 'Semiconductors, p-n junction, diodes, transistors, logic gates, applications.',
            keyConcepts: ['Semiconductors', 'p-n Junction', 'Diodes', 'Transistors', 'Logic Gates'],
            mustKnow: ['n-type: donor, p-type: acceptor', 'Forward bias: low R, Reverse: high R', 'β = I_C/I_B', 'Logic gates: AND, OR, NOT'],
            formulas: ['I = I₀(e^(eV/kT) - 1)', 'β = I_C/I_B'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          }
        ]
      }
    ]
  },
  // HSC Chemistry
  {
    id: 'hsc-chemistry',
    label: 'HSC 12th Chemistry',
    tag: 'HSC-CHEM',
    accent: '#16a34a',
    note: 'Maharashtra State Board HSC Science - Chemistry',
    groups: [
      {
        subject: 'Chemistry',
        chapters: [
          {
            name: 'Solid State',
            summary: 'Classification of solids, crystal lattices, unit cell, density, defects, electrical and magnetic properties.',
            keyConcepts: ['Crystal Lattices', 'Unit Cell', 'Density', 'Defects', 'Electrical Properties'],
            mustKnow: ['SC: Z=1, BCC: Z=2, FCC: Z=4', 'Density = ZM/N_A a³', 'Schottky and Frenkel defects'],
            formulas: ['ρ = ZM/N_A a³'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Solutions',
            summary: 'Types of solutions, concentration, solubility, colligative properties, Raoult\'s law.',
            keyConcepts: ['Types of Solutions', 'Concentration', 'Colligative Properties', 'Raoult\'s Law'],
            mustKnow: ['Molarity = moles/volume(L)', 'ΔT_b = K_b m', 'ΔT_f = K_f m', 'π = CRT'],
            formulas: ['M = n/V', 'ΔT_b = K_b m', 'π = CRT'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Ionic Equilibria',
            summary: 'Acid-base theories, pH, buffer solutions, solubility product, salt hydrolysis.',
            keyConcepts: ['Acid-Base Theories', 'pH', 'Buffer Solutions', 'Solubility Product'],
            mustKnow: ['pH = -log[H⁺]', 'K_a × K_b = K_w', 'K_sp = [A⁺]^a[B⁻]^b', 'Henderson equation'],
            formulas: ['pH = -log[H⁺]', 'K_a × K_b = 10⁻¹⁴', 'pH = pK_a + log([salt]/[acid])'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Chemical Thermodynamics',
            summary: 'System and surroundings, types of processes, internal energy, enthalpy, entropy, Gibbs energy.',
            keyConcepts: ['Internal Energy', 'Enthalpy', 'Entropy', 'Gibbs Energy', 'Hess\'s Law'],
            mustKnow: ['ΔU = q + w', 'ΔH = ΔU + Δ(PV)', 'ΔG = ΔH - TΔS', 'ΔG < 0: spontaneous'],
            formulas: ['ΔU = q + w', 'ΔH = ΔU + PΔV', 'ΔG = ΔH - TΔS'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Electrochemistry',
            summary: 'Electrochemical cells, EMF, Nernst equation, conductivity, batteries, corrosion.',
            keyConcepts: ['Electrochemical Cells', 'EMF', 'Nernst Equation', 'Conductivity', 'Batteries'],
            mustKnow: ['E_cell = E_cathode - E_anode', 'E = E° - (RT/nF)lnQ', 'ΔG = -nFE', 'κ = 1/ρ'],
            formulas: ['E = E° - (0.0591/n)logQ', 'ΔG = -nFE', 'Λ_m = κ×1000/C'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Chemical Kinetics',
            summary: 'Rate of reaction, factors affecting rate, order and molecularity, rate law, Arrhenius equation.',
            keyConcepts: ['Rate of Reaction', 'Order and Molecularity', 'Rate Law', 'Arrhenius Equation'],
            mustKnow: ['Rate = k[A]^m[B]^n', 't₁/₂ = 0.693/k (first order)', 'k = Ae^(-Ea/RT)'],
            formulas: ['Rate = k[A]^n', 't₁/₂ = 0.693/k', 'ln(k₂/k₁) = Ea/R(1/T₁ - 1/T₂)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Elements of Groups 16, 17 and 18',
            summary: 'Oxygen family, halogens, noble gases, important compounds, trends and anomalies.',
            keyConcepts: ['Oxygen Family', 'Halogens', 'Noble Gases', 'Important Compounds'],
            mustKnow: ['Oxygen: O₂, O₃ (ozone)', 'Halogens: F₂, Cl₂, Br₂, I₂', 'Noble gases: He, Ne, Ar, Kr, Xe, Rn'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Transition and Inner Transition Elements',
            summary: 'd-block and f-block elements, properties, compounds, importance, applications.',
            keyConcepts: ['d-block Elements', 'f-block Elements', 'Properties', 'Compounds'],
            mustKnow: ['Variable oxidation states', 'Coloured ions', 'Catalytic properties', 'Magnetic properties'],
            formulas: ['μ = √(n(n+2)) BM'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Coordination Compounds',
            summary: 'Werner\'s theory, IUPAC nomenclature, bonding, isomerism, stability, importance.',
            keyConcepts: ['Werner\'s Theory', 'IUPAC Nomenclature', 'Bonding', 'Isomerism', 'Stability'],
            mustKnow: ['Coordination number', 'Geometry: octahedral, tetrahedral, square planar', 'Crystal field splitting'],
            formulas: ['Δ_t = 4/9 Δ_o'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Halogen Derivatives',
            summary: 'Classification, nomenclature, preparation, properties, reaction mechanisms.',
            keyConcepts: ['Classification', 'Nomenclature', 'Preparation', 'Reactions', 'Mechanisms'],
            mustKnow: ['SN1 and SN2 mechanisms', 'E1 and E2 mechanisms', 'Wurtz reaction'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Alcohols, Phenols and Ethers',
            summary: 'Classification, nomenclature, preparation, properties, reactions, importance.',
            keyConcepts: ['Alcohols', 'Phenols', 'Ethers', 'Reactions'],
            mustKnow: ['Acidity: phenol > alcohol', 'Dehydration of alcohols', 'Williamson synthesis'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Aldehydes, Ketones and Carboxylic Acids',
            summary: 'Carbonyl compounds, nomenclature, preparation, properties, named reactions.',
            keyConcepts: ['Aldehydes', 'Ketones', 'Carboxylic Acids', 'Named Reactions'],
            mustKnow: ['Nucleophilic addition', 'Aldol condensation', 'Cannizzaro reaction', 'Acidity of carboxylic acids'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Very High'
          },
          {
            name: 'Amines',
            summary: 'Classification, nomenclature, preparation, properties, basicity, diazonium salts.',
            keyConcepts: ['Classification', 'Basicity', 'Diazonium Salts', 'Named Reactions'],
            mustKnow: ['Basicity order', 'Diazotization', 'Sandmeyer reaction', 'Hoffmann bromamide'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Biomolecules',
            summary: 'Carbohydrates, proteins, nucleic acids, vitamins, hormones, importance in life.',
            keyConcepts: ['Carbohydrates', 'Proteins', 'Nucleic Acids', 'Vitamins'],
            mustKnow: ['Monosaccharides, disaccharides, polysaccharides', 'Amino acids, peptide bonds', 'DNA and RNA'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Introduction to Polymer Chemistry',
            summary: 'Classification, polymerization, types, properties, importance, applications.',
            keyConcepts: ['Classification', 'Polymerization', 'Types', 'Properties'],
            mustKnow: ['Addition and condensation polymers', 'Natural and synthetic polymers', 'Important polymers'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Low'
          },
          {
            name: 'Green Chemistry and Nanochemistry',
            summary: 'Green chemistry principles, nanochemistry, nanoparticles, applications, importance.',
            keyConcepts: ['Green Chemistry', 'Nanochemistry', 'Nanoparticles', 'Applications'],
            mustKnow: ['12 principles of green chemistry', 'Nanoparticles: 1-100 nm', 'Applications in medicine, electronics'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Low'
          }
        ]
      }
    ]
  },
  // HSC Mathematics
  {
    id: 'hsc-maths',
    label: 'HSC 12th Mathematics',
    tag: 'HSC-MATH',
    accent: '#7c3aed',
    note: 'Maharashtra State Board HSC Science - Mathematics (Part I & II)',
    groups: [
      {
        subject: 'Mathematics Part I',
        chapters: [
          {
            name: 'Mathematical Logic',
            summary: 'Statements, logical connectives, truth tables, algebra of statements, quantifiers.',
            keyConcepts: ['Statements', 'Logical Connectives', 'Truth Tables', 'Quantifiers'],
            mustKnow: ['AND, OR, NOT, IF-THEN', 'Truth values: T, F', 'Tautology, contradiction, contingency'],
            formulas: ['p ∧ q', 'p ∨ q', '~p', 'p → q'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Matrices',
            summary: 'Types of matrices, operations, transpose, inverse, applications, solving equations.',
            keyConcepts: ['Types of Matrices', 'Operations', 'Inverse', 'Applications'],
            mustKnow: ['Addition, multiplication', 'Transpose, symmetric, skew-symmetric', 'A⁻¹ = adj(A)/|A|'],
            formulas: ['A⁻¹ = adj(A)/|A|', 'AX = B => X = A⁻¹B'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Trigonometric Functions',
            summary: 'Measures of angles, trigonometric functions, identities, equations, properties.',
            keyConcepts: ['Trigonometric Functions', 'Identities', 'Equations', 'Properties'],
            mustKnow: ['sin²θ + cos²θ = 1', 'sin2A = 2sinAcosA', 'cos2A = cos²A - sin²A'],
            formulas: ['sin(A+B) = sinAcosB + cosAsinB', 'cos(A+B) = cosAcosB - sinAsinB'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Pair of Straight Lines',
            summary: 'Equation of pair of lines, angle between them, conditions, applications.',
            keyConcepts: ['Pair of Lines', 'Angle Between Lines', 'Conditions'],
            mustKnow: ['ax² + 2hxy + by² = 0', 'tanθ = 2√(h²-ab)/(a+b)', 'Conditions for parallel, perpendicular'],
            formulas: ['ax² + 2hxy + by² = 0', 'tanθ = 2√(h²-ab)/(a+b)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Vectors',
            summary: 'Vectors in 2D and 3D, operations, dot and cross products, applications.',
            keyConcepts: ['Vector Operations', 'Dot Product', 'Cross Product', 'Applications'],
            mustKnow: ['a·b = |a||b|cosθ', 'a×b = |a||b|sinθ n̂', 'Projection of a on b'],
            formulas: ['a·b = a₁b₁ + a₂b₂ + a₃b₃', 'a×b = |i j k; a₁ a₂ a₃; b₁ b₂ b₃|'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Line and Plane',
            summary: 'Equation of line and plane in 3D, angle between them, distance, applications.',
            keyConcepts: ['Equation of Line', 'Equation of Plane', 'Angle', 'Distance'],
            mustKnow: ['Line: (x-x₁)/a = (y-y₁)/b = (z-z₁)/c', 'Plane: ax+by+cz = d', 'Angle between planes'],
            formulas: ['cosθ = |a₁a₂+b₁b₂+c₁c₂|/√(a₁²+b₁²+c₁²)√(a₂²+b₂²+c₂²)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Linear Programming',
            summary: 'Formulation, graphical method, feasible region, optimal solution, applications.',
            keyConcepts: ['Formulation', 'Graphical Method', 'Feasible Region', 'Optimal Solution'],
            mustKnow: ['Objective function', 'Constraints', 'Corner point method'],
            formulas: ['Maximize Z = ax + by subject to constraints'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          }
        ]
      },
      {
        subject: 'Mathematics Part II',
        chapters: [
          {
            name: 'Differentiation',
            summary: 'Derivatives, rules of differentiation, higher order derivatives, applications.',
            keyConcepts: ['Derivatives', 'Rules of Differentiation', 'Higher Order Derivatives'],
            mustKnow: ['d/dx(xⁿ) = nxⁿ⁻¹', 'Chain rule, product rule, quotient rule', 'Implicit differentiation'],
            formulas: ['d/dx(xⁿ) = nxⁿ⁻¹', 'd/dx(eˣ) = eˣ', 'd/dx(lnx) = 1/x'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Applications of Derivatives',
            summary: 'Rate of change, increasing/decreasing functions, tangents, normals, maxima and minima.',
            keyConcepts: ['Rate of Change', 'Increasing/Decreasing', 'Tangents and Normals', 'Maxima and Minima'],
            mustKnow: ['dy/dx = rate of change', 'f\'(x) > 0: increasing', 'f\'(x) = 0, f\'\'(x) < 0: maxima'],
            formulas: ['dy/dx = f\'(x)', 'Equation of tangent: y-y₁ = m(x-x₁)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Indefinite Integration',
            summary: 'Integration as anti-derivative, methods of integration, standard forms.',
            keyConcepts: ['Indefinite Integrals', 'Methods of Integration', 'Standard Forms'],
            mustKnow: ['∫xⁿdx = x^(n+1)/(n+1) + C', 'Substitution, partial fractions, by parts', 'Standard integral formulas'],
            formulas: ['∫xⁿdx = x^(n+1)/(n+1) + C', '∫eˣdx = eˣ + C', '∫1/x dx = ln|x| + C'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Definite Integration',
            summary: 'Definite integrals, properties, evaluation, area under curves.',
            keyConcepts: ['Definite Integrals', 'Properties', 'Evaluation', 'Area'],
            mustKnow: ['∫ₐᵇf(x)dx = F(b) - F(a)', 'Properties of definite integrals', 'Area = ∫ₐᵇ|f(x)|dx'],
            formulas: ['∫ₐᵇf(x)dx = F(b) - F(a)', '∫₋ₐᵃf(x)dx = 2∫₀ᵃf(x)dx if f(-x) = f(x)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Application of Definite Integration',
            summary: 'Area under curves, area between curves, applications in geometry.',
            keyConcepts: ['Area Under Curves', 'Area Between Curves', 'Applications'],
            mustKnow: ['Area = ∫ₐᵇf(x)dx', 'Area between curves = ∫ₐᵇ|f(x)-g(x)|dx'],
            formulas: ['Area = ∫ₐᵇy dx'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Differential Equations',
            summary: 'Order and degree, formation, solution methods, applications.',
            keyConcepts: ['Order and Degree', 'Formation', 'Solution Methods', 'Applications'],
            mustKnow: ['Order = highest derivative', 'Variable separable method', 'Linear differential equations'],
            formulas: ['dy/dx + Py = Q', 'IF = e^∫Pdx', 'y·IF = ∫Q·IF dx + C'],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Probability Distribution',
            summary: 'Random variables, probability distribution, mean, variance, binomial distribution.',
            keyConcepts: ['Random Variables', 'Probability Distribution', 'Mean and Variance', 'Binomial Distribution'],
            mustKnow: ['E(X) = Σxᵢpᵢ', 'Var(X) = E(X²) - [E(X)]²', 'Binomial: P(X=r) = nCr p^r q^(n-r)'],
            formulas: ['E(X) = Σxᵢpᵢ', 'Var(X) = npq', 'P(X=r) = nCr p^r q^(n-r)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Binomial Distribution',
            summary: 'Binomial distribution, conditions, mean, variance, applications.',
            keyConcepts: ['Binomial Distribution', 'Conditions', 'Mean and Variance', 'Applications'],
            mustKnow: ['Conditions: n trials, 2 outcomes, constant p', 'Mean = np, Variance = npq', 'P(X=r) = nCr p^r q^(n-r)'],
            formulas: ['P(X=r) = nCr p^r q^(n-r)', 'Mean = np', 'Variance = npq'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          }
        ]
      }
    ]
  },
  // MAHARASHTRA HSC CS PAPER I
  {
    id: 'hsc-cs1',
    label: 'HSC 12th CS Paper I',
    tag: 'HSC-CS1',
    accent: '#8b5cf6',
    note: 'Maharashtra State Board HSC Science - Computer Science Paper I',
    groups: [
      {
        subject: 'Computer Science',
        chapters: [
          {
            name: 'Introduction to C++',
            summary: 'Fundamentals of C++ programming, data types, operators, control structures, functions. Foundation for object-oriented programming.',
            keyConcepts: ['Data Types', 'Operators', 'Control Structures', 'Functions', 'Arrays', 'Pointers'],
            mustKnow: ['int, float, char, bool data types', 'if-else, switch, for, while, do-while', 'Function declaration and definition', 'Array declaration and initialization', 'Pointer basics and dereferencing'],
            formulas: ['sizeof(data_type)', 'array_size = sizeof(array)/sizeof(element)'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Object-Oriented Programming',
            summary: 'Classes, objects, inheritance, polymorphism, encapsulation, abstraction. Core OOP concepts in C++.',
            keyConcepts: ['Classes and Objects', 'Constructors and Destructors', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
            mustKnow: ['Class definition with data members and member functions', 'Constructor types: default, parameterized, copy', 'Inheritance types: single, multiple, multilevel', 'Function overloading and overriding', 'Access specifiers: public, private, protected'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Very High'
          },
          {
            name: 'Data Structures',
            summary: 'Arrays, linked lists, stacks, queues, trees, graphs. Fundamental data organization and manipulation.',
            keyConcepts: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'],
            mustKnow: ['Array operations: insertion, deletion, traversal', 'Linked list: node structure, insertion, deletion', 'Stack: LIFO, push, pop operations', 'Queue: FIFO, enqueue, dequeue', 'Tree: binary tree, traversal (inorder, preorder, postorder)'],
            formulas: ['Time complexity: O(n) for linear search', 'Space complexity: O(n) for array'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Algorithm Design',
            summary: 'Sorting algorithms, searching algorithms, algorithm complexity, recursion. Problem-solving techniques.',
            keyConcepts: ['Sorting Algorithms', 'Searching Algorithms', 'Recursion', 'Time Complexity', 'Space Complexity'],
            mustKnow: ['Bubble sort, selection sort, insertion sort', 'Quick sort, merge sort', 'Linear search, binary search', 'Recursion: base case and recursive case', 'Big O notation: O(1), O(log n), O(n), O(n²)'],
            formulas: ['Binary search: O(log n)', 'Bubble sort: O(n²)', 'Quick sort: O(n log n) average'],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Database Management',
            summary: 'Database concepts, SQL queries, normalization, ER diagrams. Data storage and retrieval systems.',
            keyConcepts: ['Database Concepts', 'SQL Queries', 'Normalization', 'ER Diagrams', 'Keys'],
            mustKnow: ['SELECT, INSERT, UPDATE, DELETE queries', 'Primary key, foreign key, candidate key', '1NF, 2NF, 3NF normalization', 'Entity-Relationship model', 'JOIN operations: INNER, LEFT, RIGHT'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          }
        ]
      }
    ]
  },
  // MAHARASHTRA HSC CS PAPER II
  {
    id: 'hsc-cs2',
    label: 'HSC 12th CS Paper II',
    tag: 'HSC-CS2',
    accent: '#a855f7',
    note: 'Maharashtra State Board HSC Science - Computer Science Paper II',
    groups: [
      {
        subject: 'Computer Science',
        chapters: [
          {
            name: 'HTML and Web Technologies',
            summary: 'HTML structure, tags, forms, CSS basics, web development fundamentals. Building web pages and applications.',
            keyConcepts: ['HTML Structure', 'HTML Tags', 'Forms', 'CSS Basics', 'Web Development'],
            mustKnow: ['HTML document structure: <!DOCTYPE>, <html>, <head>, <body>', 'Common tags: <p>, <h1>-<h6>, <a>, <img>, <div>, <span>', 'Form elements: <input>, <select>, <textarea>, <button>', 'CSS selectors: element, class, id', 'CSS properties: color, background, font, margin, padding'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'JavaScript Programming',
            summary: 'JavaScript syntax, DOM manipulation, events, functions, objects. Client-side scripting for web interactivity.',
            keyConcepts: ['JavaScript Syntax', 'Variables and Data Types', 'Functions', 'DOM Manipulation', 'Events', 'Objects'],
            mustKnow: ['var, let, const declarations', 'Function declaration and arrow functions', 'document.getElementById(), querySelector()', 'Event listeners: onclick, onchange, onsubmit', 'Object creation and property access'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'High'
          },
          {
            name: 'Networking Concepts',
            summary: 'Network types, protocols, TCP/IP model, internet services, network security. Communication systems.',
            keyConcepts: ['Network Types', 'Protocols', 'TCP/IP Model', 'Internet Services', 'Network Security'],
            mustKnow: ['LAN, MAN, WAN, PAN', 'TCP, IP, HTTP, FTP, SMTP protocols', 'OSI 7-layer model', 'IP addressing: IPv4, IPv6', 'Firewalls, encryption, authentication'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Cyber Security',
            summary: 'Security threats, viruses, malware, encryption, authentication, ethical hacking. Protecting digital assets.',
            keyConcepts: ['Security Threats', 'Viruses and Malware', 'Encryption', 'Authentication', 'Ethical Hacking'],
            mustKnow: ['Types of malware: virus, worm, trojan, ransomware', 'Symmetric and asymmetric encryption', 'Digital signatures and certificates', 'Firewall types: packet filtering, stateful inspection', 'Phishing, spoofing, social engineering'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Medium'
          },
          {
            name: 'Emerging Technologies',
            summary: 'Artificial intelligence, machine learning, cloud computing, IoT, blockchain. Modern technology trends.',
            keyConcepts: ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Internet of Things', 'Blockchain'],
            mustKnow: ['AI: definition, applications, types', 'ML: supervised, unsupervised, reinforcement learning', 'Cloud: IaaS, PaaS, SaaS models', 'IoT: sensors, connectivity, applications', 'Blockchain: distributed ledger, cryptocurrencies'],
            formulas: [],
            deleted: [],
            deletedChapter: false,
            weightage: 'Low'
          }
        ]
      }
    ]
  }
];
