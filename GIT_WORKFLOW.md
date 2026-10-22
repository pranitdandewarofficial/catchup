# Git Workflow Guide for CatchUp Vault

## 🚀 Quick Start

### Initial Setup (First Time)
```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "feat: initial release of CatchUp Vault"

# Add remote repository (if you have one)
git remote add origin https://github.com/yourusername/catchup-vault.git

# Push to remote
git push -u origin main
```

---

## 📝 Daily Workflow

### 1. Start Your Day
```bash
# Pull latest changes
git pull origin main

# Check status
git status
```

### 2. Make Changes
```bash
# Work on your feature/fix
# ... make changes ...

# Check what changed
git status
git diff
```

### 3. Commit Your Changes
```bash
# Add specific files
git add src/App.tsx src/components/Profile.tsx

# Or add all changes
git add .

# Commit with descriptive message
git commit -m "feat: add AI settings to profile"
```

### 4. Push to Remote
```bash
# Push your commits
git push origin main
```

---

## 🌿 Branch Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch for features

### Feature Branches
```bash
# Create feature branch
git checkout -b feature/periodic-table

# Work on feature
# ... make changes ...

# Commit
git commit -m "feat: add interactive periodic table"

# Push feature branch
git push -u origin feature/periodic-table

# Create pull request on GitHub

# After merge, delete branch
git branch -d feature/periodic-table
```

### Bug Fix Branches
```bash
# Create bugfix branch
git checkout -b fix/flashcard-rendering

# Fix the bug
# ... make changes ...

# Commit
git commit -m "fix: resolve flashcard 3D flip bug"

# Push
git push -u origin fix/flashcard-rendering
```

---

## 💬 Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

#### Feature
```bash
git commit -m "feat(auth): add Google Sign-In

- Implement Firebase Google authentication
- Add user profile creation on first login
- Store user preferences in Firestore

Closes #12"
```

#### Bug Fix
```bash
git commit -m "fix(flashcards): resolve 3D flip rendering issue

- Add explicit transform properties to card faces
- Fix backface-visibility for Safari
- Add proper container height

Fixes #45"
```

#### Documentation
```bash
git commit -m "docs: update README with setup instructions

- Add installation steps
- Include Firebase configuration guide
- Add screenshots"
```

#### Refactor
```bash
git commit -m "refactor(profile): extract AI settings component

- Create separate AISettings component
- Improve code organization
- Add proper TypeScript types"
```

---

## 🔍 Useful Git Commands

### Viewing History
```bash
# See commit history
git log

# See compact history
git log --oneline

# See history with graph
git log --oneline --graph --all

# See specific file history
git log --follow src/App.tsx
```

### Undoing Changes
```bash
# Undo staged changes
git reset HEAD <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a specific commit
git revert <commit-hash>
```

### Stashing
```bash
# Stash current changes
git stash

# Stash with message
git stash save "work in progress on feature"

# List stashes
git stash list

# Apply stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Comparing
```bash
# See changes not yet staged
git diff

# See changes already staged
git diff --cached

# Compare branches
git diff main..develop

# Compare commits
git diff <commit1> <commit2>
```

### Tags
```bash
# Create tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Version 1.0.0 release"

# Push tags
git push origin --tags

# List tags
git tag
```

---

## 🔄 Merging Strategies

### Fast-Forward Merge
```bash
git checkout main
git merge feature/new-feature
```

### Merge Commit
```bash
git checkout main
git merge --no-ff feature/new-feature
```

### Squash Merge
```bash
git checkout main
git merge --squash feature/new-feature
git commit -m "feat: add new feature"
```

### Rebase
```bash
# Rebase feature branch onto main
git checkout feature/new-feature
git rebase main

# Continue after resolving conflicts
git rebase --continue

# Push rebased branch
git push --force-with-lease origin feature/new-feature
```

---

## 🚨 Handling Conflicts

### When Conflict Occurs
```bash
# See conflicting files
git status

# Open files and resolve conflicts
# Look for <<<<<<< HEAD markers

# After resolving
git add <resolved-files>
git commit -m "merge: resolve conflicts"
```

### Abort Merge
```bash
git merge --abort
```

### Abort Rebase
```bash
git rebase --abort
```

---

## 📊 Git Status Shortcuts

```bash
# Short status
git status -s

# Show branch
git branch

# Show all branches
git branch -a

# Delete branch
git branch -d branch-name

# Force delete branch
git branch -D branch-name
```

---

## 🎯 Best Practices

### ✅ Do
- Write clear, descriptive commit messages
- Commit small, logical changes
- Use branches for features and fixes
- Pull before pushing
- Review changes before committing
- Write tests for new features
- Update documentation

### ❌ Don't
- Commit sensitive data (API keys, passwords)
- Make huge commits with unrelated changes
- Force push to main branch
- Ignore merge conflicts
- Commit broken code
- Skip commit messages

---

## 🔐 Security

### Never Commit
- API keys
- Passwords
- Database credentials
- Private keys
- `.env` files (already in .gitignore)

### Use Environment Variables
```bash
# .env.local (not committed)
GEMINI_API_KEY=your_key_here
FIREBASE_CONFIG=your_config_here
```

---

## 📦 Release Workflow

### Creating a Release
```bash
# Update version in package.json
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# This automatically creates a commit and tag

# Push commit and tag
git push origin main
git push origin --tags
```

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Tag created
- [ ] Release notes written

---

## 🤝 Collaboration

### Working with Team
```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Work and commit
git add .
git commit -m "feat: add my feature"

# Push feature branch
git push -u origin feature/my-feature

# Create pull request on GitHub

# After review and merge
git checkout main
git pull origin main
git branch -d feature/my-feature
```

### Code Review
- Always create pull requests
- Request reviews from team members
- Address all comments
- Squash commits if needed
- Update CHANGELOG.md

---

## 📚 Git Aliases (Optional)

Add to `~/.gitconfig`:
```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --all
    last = log -1 HEAD
    unstage = reset HEAD --
```

Usage:
```bash
git st          # instead of git status
git co main     # instead of git checkout main
git lg          # beautiful log
```

---

## 🆘 Troubleshooting

### Detached HEAD
```bash
git checkout main
```

### Lost Commits
```bash
# Find lost commits
git reflog

# Recover commit
git checkout -b recovery-branch <commit-hash>
```

### Wrong Commit Message
```bash
# Amend last commit message
git commit --amend -m "new message"
```

### Undo Last Commit
```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

---

## 📖 Resources

- [Git Official Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Learn Git Branching](https://learngitbranching.js.org/)

---

## 🎓 Git Commands Cheat Sheet

```bash
# Setup
git init
git clone <url>

# Basic
git status
git add <file>
git commit -m "message"
git push
git pull

# Branches
git branch
git checkout -b <branch>
git merge <branch>

# History
git log
git diff
git show <commit>

# Undo
git reset
git revert
git checkout -- <file>

# Remote
git remote add <name> <url>
git remote -v
git fetch
git push -u origin <branch>
```

---

**Remember:** Git is your friend! Commit often, write good messages, and don't be afraid to experiment with branches.

Happy coding! 🚀
