# CatchUp Vault 📚

Your complete exam preparation companion for JEE Main, JEE Advanced, and Maharashtra HSC / CBSE students.

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![Build](https://img.shields.io/badge/build-passing-green)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### 📖 Comprehensive Content
- **83 Chapters** across JEE and HSC exams
- **3000+ Formulas** organized by subject and topic
- **Detailed Chapter Summaries** with key concepts and must-know points
- **Exam-Specific Content** for JEE Main, JEE Advanced, and HSC

### 🎯 Smart Learning Tools
- **Interactive Flashcards** with 3D flip animations
- **AI-Powered Quiz Generator** for practice questions
- **AI Study Buddy** for instant doubt solving
- **Progress Tracking** with visual statistics
- **Study Streak Counter** to maintain consistency

### 🧪 Interactive Periodic Table
- **All 118 Elements** with complete properties
- **Search and Filter** functionality
- **Element Detail Views** with exam relevance
- **Category-Based Color Coding**

### ☁️ Cloud Sync
- **Firebase Integration** for data persistence
- **Cross-Device Sync** for seamless learning
- **Offline Support** with localStorage
- **Google Sign-In** for secure authentication

### 🎨 Beautiful UI
- **Professional Design** with clean aesthetics
- **Responsive Layout** for all devices
- **Smooth Animations** and transitions
- **Dark/Light Mode** support
- **LaTeX Rendering** for mathematical formulas

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account (for cloud sync)
- Gemini API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/catchup-vault.git

# Navigate to project directory
cd catchup-vault

# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Google Sign-In)
4. Create Firestore Database
5. Copy your Firebase config
6. Update `src/firebase.ts` with your config

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Gemini AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate an API key
3. Open the app and go to Profile → AI Settings
4. Enter your API key
5. Select your preferred model
6. Save settings

## 📁 Project Structure

```
catchup-vault/
├── src/
│   ├── components/
│   │   ├── MarkdownRenderer.tsx    # LaTeX & markdown rendering
│   │   ├── Profile.tsx              # User profile & AI settings
│   │   └── Onboarding.tsx           # User onboarding flow
│   ├── data/
│   │   └── periodicTable.ts         # 118 elements data
│   ├── data.ts                      # Exam & chapter data
│   ├── formulas.ts                  # 3000+ formulas
│   ├── firebase.ts                  # Firebase configuration
│   ├── ai.ts                        # Gemini AI integration
│   ├── App.tsx                      # Main application
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tsconfig.json                    # TypeScript config
├── .gitignore                       # Git ignore rules
├── CHANGELOG.md                     # Version history
├── GIT_WORKFLOW.md                  # Git guide
└── README.md                        # This file
```

## 🎓 Supported Exams

### JEE Main 2026
- **Physics**: 19 chapters
- **Chemistry**: 17 chapters
- **Mathematics**: 15 chapters

### Maharashtra HSC
- **Physics**: 16 chapters
- **Chemistry**: 16 chapters
- **Mathematics**: 15 chapters (Part I + II)

### Coming Soon
- NEET Preparation
- CBSE Board Exams
- GATE Preparation
- More competitive exams

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Backend**: Firebase (Auth, Firestore, Realtime DB)
- **AI**: Google Gemini API
- **Math Rendering**: KaTeX
- **Markdown**: React Markdown

## 📊 Key Statistics

| Metric | Count |
|--------|-------|
| Exam Tracks | 4 |
| Total Chapters | 83 |
| Formulas | 3000+ |
| Periodic Table Elements | 118 |
| AI Models Supported | 6 |
| Flashcard Topics | 37 |

## 🎯 Usage Guide

### Dashboard
- View overall progress statistics
- Track goals (IIT Bombay CSE, HSC 95%+)
- See today's mission
- Quick access to all features

### Formula Wall
- Browse 3000+ formulas by subject
- Search specific formulas
- Filter by topic
- LaTeX rendering for perfect math display

### Flashcards
- Study formulas interactively
- Track mastered cards
- Use keyboard shortcuts
- Shuffle and review

### AI Tutor
- Ask questions about any topic
- Get instant explanations
- Solve problems step-by-step
- Chat history persistence

### AI Quiz Generator
- Generate practice questions
- Select subject and chapter
- Choose difficulty level
- Review answers with explanations

### Periodic Table
- Explore all 118 elements
- View detailed properties
- Check exam relevance
- Search and filter elements

### Profile
- Manage account settings
- Configure AI settings
- Export data
- Reset progress
- View statistics

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Git Workflow

See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for detailed git commands and best practices.

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push -u origin feature/new-feature
```

### Code Style

- Use TypeScript for type safety
- Follow existing component patterns
- Write descriptive commit messages
- Keep components small and focused
- Add comments for complex logic

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Write clear commit messages following conventional commits
- Update documentation for new features
- Add tests for new functionality
- Follow the existing code style
- Be respectful and constructive

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

## 💡 Feature Requests

Have an idea? Open an issue with:
- Feature description
- Use case and benefits
- Possible implementation approach
- Mockups or examples if relevant

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Google Gemini for AI capabilities
- KaTeX for mathematical rendering
- React and Vite teams
- All contributors and users

## 📞 Support

- **Documentation**: Check [CHANGELOG.md](./CHANGELOG.md) and [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- **Issues**: Open a GitHub issue
- **Email**: support@catchupvault.com

## 🗺️ Roadmap

### Q1 2026
- [ ] Add NEET preparation content
- [ ] Implement spaced repetition
- [ ] Add video tutorials integration

### Q2 2026
- [ ] Mobile app (React Native)
- [ ] Offline mode enhancement
- [ ] Community features

### Q3 2026
- [ ] Advanced analytics dashboard
- [ ] Peer learning features
- [ ] Teacher portal

### Q4 2026
- [ ] AI-powered study plans
- [ ] Mock test series
- [ ] Performance predictions

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Made with ❤️ for students, by students**

**Happy Learning! 🚀📚**
