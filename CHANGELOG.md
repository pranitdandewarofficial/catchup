# Changelog

All notable changes to CatchUp Vault will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Add more exam tracks (NEET, CBSE, GATE)
- Implement spaced repetition algorithm for flashcards
- Add video links for complex topics
- Enhance formula database with derivations
- Add interactive diagrams and visualizations

---

## [3.0.0] - 2026-01-XX

### Added
- **Complete Content Restoration**
  - Restored all 83 chapters across 4 exam tracks
  - Restored 3000+ formulas database
  - Complete chapter details with summaries, key concepts, and must-know points
  
- **Dashboard Improvements**
  - Goals tracking section (IIT Bombay CSE, HSC 95%+ Target)
  - Today's Mission feature
  - Real-time progress statistics
  
- **Profile Enhancements**
  - AI Settings integration
  - API key management
  - Model selection (6 Gemini models)
  - Connection testing
  - Data export functionality
  - Reset progress options
  
- **Git Setup**
  - .gitignore file
  - CHANGELOG.md for tracking changes
  - Git workflow documentation

### Fixed
- Flashcard 3D flip rendering bug
- AI quiz JSON parsing issues
- LaTeX rendering in markdown
- Profile AI settings integration

### Changed
- Improved dashboard layout
- Enhanced profile UI
- Better navigation structure

---

## [2.5.0] - 2026-01-XX

### Added
- **Interactive Periodic Table**
  - All 118 elements with complete data
  - Search and filter functionality
  - Element detail views
  - Exam relevance for JEE/HSC
  
- **AI Quiz Engine Improvements**
  - Subject and chapter selection
  - Difficulty levels
  - Question count options
  - Detailed results screen
  - Answer review functionality
  
- **Flashcards Enhancements**
  - 3D flip animations
  - Progress tracking
  - Keyboard shortcuts
  - Hint system
  - Difficulty labels

### Fixed
- Periodic table responsive layout
- Quiz scoring accuracy
- Flashcard navigation

---

## [2.0.0] - 2026-01-XX

### Added
- **Public Website**
  - Landing page with hero section
  - Features overview
  - About page
  - Contact form
  - Newsletter subscription
  - Feature suggestions
  - Privacy policy and terms
  
- **Authentication System**
  - Google Sign-In only
  - Email/password authentication
  - Password reset flow
  - Email verification
  
- **Routing System**
  - Hash-based routing
  - 13 public routes
  - Protected routes for authenticated users
  - Automatic redirects

### Removed
- Email/password authentication (kept Google only)
- Public marketing website (later restored in cleanup)

### Fixed
- Authentication flow
- Route protection
- Form validation

---

## [1.5.0] - 2026-01-XX

### Added
- **AI Integration**
  - Gemini AI tutor
  - AI quiz generator
  - AI settings in profile
  - Multiple model support
  - Fallback system for API errors
  
- **Advanced Features**
  - Markdown rendering with LaTeX
  - Copy button for AI responses
  - Chat history persistence
  - Toast notifications
  
- **UI Improvements**
  - Professional landing page
  - Clean authentication flow
  - Improved footer design

### Fixed
- AI API error handling
- LaTeX rendering issues
- Chat persistence

---

## [1.0.0] - 2026-01-XX

### Added
- **Core Application**
  - Exam data structure for JEE and HSC
  - Chapter tracking system
  - Progress persistence
  - Firebase integration
  
- **Features**
  - Dashboard with statistics
  - Exam-wise progress tracking
  - Chapter completion marking
  - Study streak counter
  - Cloud sync via Firebase
  
- **Components**
  - Onboarding flow
  - Profile management
  - Settings modal
  - Toast notifications
  
- **Styling**
  - Professional white theme
  - Responsive design
  - Smooth animations
  - Accessibility features

### Technical
- React + TypeScript setup
- Vite build system
- Tailwind CSS
- Firebase (Auth, Firestore, Realtime DB)
- KaTeX for LaTeX rendering
- React Markdown for content

---

## [0.1.0] - 2026-01-XX

### Added
- Initial project setup
- Basic folder structure
- Package dependencies
- Build configuration

---

## Git Commands Reference

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: CatchUp Vault v1.0.0"
```

### Daily Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push origin main
```

### Branch Management
```bash
# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature
```

### Common Commit Messages
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, no code change
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Example Commits
```bash
git commit -m "feat: add interactive periodic table"
git commit -m "fix: resolve flashcard rendering bug"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor: improve dashboard layout"
git commit -m "chore: update dependencies"
```

---

## Version History Summary

| Version | Date | Major Changes |
|---------|------|---------------|
| 3.0.0 | 2026-01 | Content restoration, dashboard improvements, profile enhancements |
| 2.5.0 | 2026-01 | Periodic table, quiz engine, flashcard improvements |
| 2.0.0 | 2026-01 | Public website, authentication, routing |
| 1.5.0 | 2026-01 | AI integration, markdown rendering, UI improvements |
| 1.0.0 | 2026-01 | Core application, Firebase integration, basic features |
| 0.1.0 | 2026-01 | Initial setup |

---

**Note:** This changelog tracks all major changes. For detailed commit history, use `git log`.
