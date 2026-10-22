import { GoogleGenerativeAI } from '@google/generative-ai';

let apiKey = localStorage.getItem('gemini_api_key') || '';
let selectedModel = localStorage.getItem('gemini_model') || 'gemini-3.5-flash';
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

export const GEMINI_MODELS = [
  { id: 'gemini-3.5-pro', name: 'Gemini 3.5 Pro', tier: 'premium' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', tier: 'standard' },
  { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro', tier: 'premium' },
  { id: 'gemini-3.0-flash', name: 'Gemini 3.0 Flash', tier: 'standard' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', tier: 'premium' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tier: 'standard' }
];

export const initializeAI = (key: string, modelId?: string) => {
  try {
    apiKey = key;
    if (modelId) selectedModel = modelId;
    
    localStorage.setItem('gemini_api_key', key);
    localStorage.setItem('gemini_model', selectedModel);
    
    genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel({ model: selectedModel });
    return true;
  } catch (error) {
    console.error('Error initializing AI:', error);
    return false;
  }
};

export const getAIStatus = () => {
  return {
    initialized: model !== null,
    model: selectedModel,
    hasKey: !!apiKey
  };
};

export const getBestModel = () => {
  return selectedModel;
};

export const isAIAvailable = () => {
  return model !== null;
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const FALLBACK_MODELS = ['gemini-3.5-flash', 'gemini-3.0-flash', 'gemini-2.5-flash'];

const generateWithRetry = async (prompt: string): Promise<string> => {
  if (!model) throw new Error('AI not initialized');
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    if (error.status === 503 || error.status === 404) {
      for (const fallbackModelId of FALLBACK_MODELS) {
        if (fallbackModelId === selectedModel) continue;
        try {
          const fallbackModel = genAI!.getGenerativeModel({ model: fallbackModelId });
          const result = await fallbackModel.generateContent(prompt);
          const response = await result.response;
          return response.text();
        } catch (fallbackError) {
          continue;
        }
      }
    }
    throw error;
  }
};

export const askAI = async (question: string, context?: string): Promise<string> => {
  if (!model) {
    return "⚠️ AI not configured. Please add your Gemini API key in Settings.";
  }

  const systemPrompt = `You are CatchUp AI, an expert tutor for JEE Main and HSC Board exams.

RESPONSE FORMAT (STRICT):
- Be concise and direct - NO fluff
- Use markdown formatting: **bold**, *italic*, \`code\`, tables, lists
- For formulas: use LaTeX-style (e.g., $F = ma$, $\\int x dx$)
- Structure: Key concept → Formula → Example → Exam tip
- Maximum 300 words unless solving a complex problem
- Use tables for comparisons
- Highlight important points with **bold**
- End with 1-2 exam tips if relevant

${context ? `Context: ${context}` : ''}

Student Question: ${question}`;

  try {
    return await generateWithRetry(systemPrompt);
  } catch (error: any) {
    if (error.status === 401) {
      return "⚠️ Invalid API key. Please check your Gemini API key in Settings.";
    }
    if (error.status === 429) {
      return "⚠️ API quota exceeded. Please wait and try again.";
    }
    if (error.status === 503) {
      return "⚠️ AI service temporarily overloaded. Please try again later.";
    }
    return `⚠️ Error: ${error.message || 'Unknown error'}`;
  }
};

export const generateQuiz = async (
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 5,
  subject?: string
): Promise<QuizQuestion[] | string> => {
  if (!model) {
    return "⚠️ AI not configured. Please add your Gemini API key in Settings.";
  }

  const subjectContext = subject ? ` for ${subject}` : '';
  const prompt = `Generate ${count} ${difficulty} difficulty multiple choice questions on "${topic}"${subjectContext} for JEE/HSC exam preparation.

IMPORTANT: Return ONLY valid JSON in this exact format, no other text:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation"
  }
]

Rules:
- correctAnswer is 0-indexed (0=A, 1=B, 2=C, 3=D)
- Make questions exam-oriented
- Ensure all 4 options are plausible
- Keep explanations concise
- Return ONLY the JSON array`;

  try {
    const response = await generateWithRetry(prompt);
    
    try {
      let jsonStr = response.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }
      
      const parsed = JSON.parse(jsonStr);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q: any) => ({
          question: q.question || '',
          options: Array.isArray(q.options) ? q.options : [],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || ''
        }));
      }
    } catch (parseError) {
      console.warn('Failed to parse quiz JSON');
    }
    
    return response;
  } catch (error: any) {
    if (error.status === 401) return "⚠️ Invalid API key.";
    if (error.status === 429) return "⚠️ API quota exceeded.";
    if (error.status === 503) return "⚠️ AI service overloaded.";
    return `⚠️ Error: ${error.message || 'Unknown error'}`;
  }
};

export const explainConcept = async (concept: string, level: 'basic' | 'intermediate' | 'advanced' = 'intermediate'): Promise<string> => {
  if (!model) return "AI service is currently unavailable.";

  const prompt = `Explain the concept "${concept}" at ${level} level for a JEE/HSC student.
  
Include:
1. Simple definition
2. Key points to remember
3. Important formulas (if applicable)
4. Common applications
5. Tips for exam
6. Common mistakes to avoid

Keep it concise but comprehensive.`;

  try {
    return await generateWithRetry(prompt);
  } catch (error: any) {
    if (error.status === 503) return "⚠️ AI service temporarily overloaded.";
    return "Failed to generate explanation.";
  }
};

export const solveProblem = async (problem: string, subject: string): Promise<string> => {
  if (!model) return "AI service is currently unavailable.";

  const prompt = `Solve this ${subject} problem step by step:
  
${problem}

Provide:
1. Given information
2. What to find
3. Relevant formulas/concepts
4. Step-by-step solution
5. Final answer with units
6. Verification method

Show all work clearly.`;

  try {
    return await generateWithRetry(prompt);
  } catch (error: any) {
    if (error.status === 503) return "⚠️ AI service temporarily overloaded.";
    return "Failed to solve problem.";
  }
};
