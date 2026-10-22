import { useState, useEffect } from 'react';
import { 
  saveUserProfile, 
  loadUserProfile, 
  deleteAccount, 
  exportUserData,
  resetQuizHistory,
  resetFlashcardProgress,
  resetChapterCompletion,
  resetStudyStats,
  resetAllProgress,
  signOutUser
} from '../firebase';
import { initializeAI, getAIStatus, GEMINI_MODELS } from '../ai';

interface ProfileProps {
  user: any;
  onClose: () => void;
  onLogout: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function Profile({ user, onClose, onLogout, showToast }: ProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetMenu, setShowResetMenu] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    examPreferences: [] as string[]
  });

  // AI Settings state
  const [aiApiKey, setAiApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [aiModel, setAiModel] = useState(localStorage.getItem('gemini_model') || 'gemini-3.5-flash');
  const [aiStatus, setAiStatus] = useState(getAIStatus());

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = loadUserProfile(user.uid, (data) => {
      if (data) {
        setProfile(data);
        setFormData({
          displayName: data.displayName || user.displayName || '',
          examPreferences: data.examPreferences || []
        });
      } else {
        const defaultProfile = {
          displayName: user.displayName || 'User',
          email: user.email || '',
          photoURL: user.photoURL || '',
          examPreferences: [],
          joinedDate: user.metadata?.creationTime || new Date().toISOString(),
          theme: 'system',
          notifications: {
            email: true,
            push: true,
            studyReminders: true
          }
        };
        setProfile(defaultProfile);
        setFormData({
          displayName: defaultProfile.displayName,
          examPreferences: []
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!profile) return;
    const changed = 
      formData.displayName !== profile.displayName ||
      JSON.stringify(formData.examPreferences) !== JSON.stringify(profile.examPreferences);
    setHasChanges(changed);
  }, [formData, profile]);

  const handleSave = async () => {
    if (!user || !profile) return;
    
    setSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        displayName: formData.displayName,
        examPreferences: formData.examPreferences
      };
      
      await saveUserProfile(user.uid, updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      setHasChanges(false);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setFormData({
      displayName: profile.displayName,
      examPreferences: profile.examPreferences
    });
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleExportData = async () => {
    if (!user) return;
    
    try {
      showToast('Exporting data...', 'info');
      const data = await exportUserData(user.uid);
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `catchup-vault-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Data exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export data', 'error');
    }
  };

  const handleReset = async (type: string) => {
    if (!user) return;
    
    const confirmMessage = {
      quiz: 'Reset all quiz history? This cannot be undone.',
      flashcards: 'Reset all flashcard progress? This cannot be undone.',
      chapters: 'Reset all chapter completion? This cannot be undone.',
      stats: 'Reset all study statistics? This cannot be undone.',
      all: 'Reset ALL learning progress? This will clear everything and cannot be undone.'
    };
    
    if (!confirm(confirmMessage[type as keyof typeof confirmMessage])) return;
    
    try {
      switch (type) {
        case 'quiz':
          await resetQuizHistory(user.uid);
          showToast('Quiz history reset', 'success');
          break;
        case 'flashcards':
          await resetFlashcardProgress(user.uid);
          showToast('Flashcard progress reset', 'success');
          break;
        case 'chapters':
          await resetChapterCompletion(user.uid);
          showToast('Chapter completion reset', 'success');
          break;
        case 'stats':
          await resetStudyStats(user.uid);
          showToast('Study statistics reset', 'success');
          break;
        case 'all':
          await resetAllProgress(user.uid);
          showToast('All progress reset', 'success');
          break;
      }
      setShowResetMenu(false);
    } catch (error) {
      showToast('Failed to reset data', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (!confirm('Are you absolutely sure you want to delete your account? This will permanently delete all your data and cannot be undone.')) {
      setShowDeleteConfirm(false);
      return;
    }
    
    try {
      await deleteAccount(user.uid);
      showToast('Account deleted successfully', 'success');
      setTimeout(() => {
        onLogout();
      }, 1500);
    } catch (error: any) {
      showToast(`Failed to delete account: ${error.message}`, 'error');
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      showToast('Logged out successfully', 'success');
      onLogout();
    } catch (error) {
      showToast('Failed to logout', 'error');
    }
  };

  const toggleExamPreference = (examId: string) => {
    setFormData(prev => ({
      ...prev,
      examPreferences: prev.examPreferences.includes(examId)
        ? prev.examPreferences.filter(e => e !== examId)
        : [...prev.examPreferences, examId]
    }));
  };

  const handleSaveAISettings = () => {
    if (!aiApiKey.trim()) {
      showToast('Please enter an API key', 'error');
      return;
    }

    const success = initializeAI(aiApiKey, aiModel);
    if (success) {
      setAiStatus(getAIStatus());
      showToast('AI settings saved successfully', 'success');
      setShowAISettings(false);
    } else {
      showToast('Failed to initialize AI. Please check your API key.', 'error');
    }
  };

  const handleTestAIConnection = async () => {
    if (!aiStatus.initialized) {
      showToast('AI not configured. Please save settings first.', 'error');
      return;
    }

    showToast('Testing connection...', 'info');
    
    try {
      const { askAI } = await import('../ai');
      const response = await askAI('Hello, this is a test message. Please respond with "Connection successful!"');
      
      if (response.includes('Connection successful') || response.length > 0) {
        showToast('AI connection successful!', 'success');
      } else {
        showToast('AI connection failed. Please check your API key.', 'error');
      }
    } catch (error) {
      showToast('AI connection test failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <section>
            <div className="flex items-start gap-6 mb-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(profile?.displayName || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {profile?.displayName || 'User'}
                    </h3>
                    <p className="text-gray-600 mb-2">{profile?.email || user?.email}</p>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(profile?.joinedDate || user?.metadata?.creationTime || Date.now()).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Exam Preferences */}
            {isEditing && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Exam Preferences
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['JEE', 'NEET', 'HSC', 'SSC', 'GATE', 'CAT'].map(exam => (
                    <button
                      key={exam}
                      onClick={() => toggleExamPreference(exam)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                        formData.examPreferences.includes(exam)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </section>

          {/* AI Settings Section */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AI Configuration</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowAISettings(!showAISettings)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">⚙️ AI Settings</div>
                <div className="text-sm text-gray-500">Configure API key, model, and preferences</div>
              </button>

              {showAISettings && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gemini API Key
                    </label>
                    <input
                      type="password"
                      value={aiApiKey}
                      onChange={(e) => setAiApiKey(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your Gemini API key"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your API key from{' '}
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Google AI Studio
                      </a>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {GEMINI_MODELS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.tier})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAISettings}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save AI Settings
                    </button>
                    <button
                      onClick={handleTestAIConnection}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Test Connection
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Status:</strong> {aiStatus.initialized ? `Connected to ${aiStatus.model}` : 'Not configured'}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const status = getAIStatus();
                  showToast(
                    status.initialized 
                      ? `AI Connected: ${status.model}` 
                      : 'AI not configured. Add API key in Settings.',
                    status.initialized ? 'success' : 'info'
                  );
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">🔌 Connection Status</div>
                <div className="text-sm text-gray-500">
                  {aiStatus.initialized ? `Connected to ${aiStatus.model}` : 'Not configured'}
                </div>
              </button>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {Object.keys(localStorage).filter(k => k.startsWith('catchup:activity:')).length}
                </div>
                <div className="text-sm text-blue-600">Chapters Completed</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {JSON.parse(localStorage.getItem('catchup:flashcards:known') || '[]').length}
                </div>
                <div className="text-sm text-green-600">Flashcards Mastered</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {JSON.parse(localStorage.getItem('catchup:quiz:scores') || '[]').length}
                </div>
                <div className="text-sm text-purple-600">Quizzes Taken</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-orange-700 mb-1">
                  {Math.max(0, ...JSON.parse(localStorage.getItem('catchup:quiz:scores') || '[0]').map((s: any) => s.score || 0))}
                </div>
                <div className="text-sm text-orange-600">Best Quiz Score</div>
              </div>
            </div>
          </section>

          {/* Data Management Section */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Data Management</h3>
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">📥 Export Data</div>
                <div className="text-sm text-gray-500">Download all your data as JSON</div>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowResetMenu(!showResetMenu)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900">🔄 Reset Progress</div>
                  <div className="text-sm text-gray-500">Clear specific or all learning data</div>
                </button>

                {showResetMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleReset('quiz')}
                      className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                    >
                      <div className="font-medium text-gray-900">Reset Quiz History</div>
                      <div className="text-sm text-gray-500">Clear all quiz attempts and scores</div>
                    </button>
                    <button
                      onClick={() => handleReset('flashcards')}
                      className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                    >
                      <div className="font-medium text-gray-900">Reset Flashcard Progress</div>
                      <div className="text-sm text-gray-500">Clear all flashcard mastery data</div>
                    </button>
                    <button
                      onClick={() => handleReset('chapters')}
                      className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                    >
                      <div className="font-medium text-gray-900">Reset Chapter Completion</div>
                      <div className="text-sm text-gray-500">Mark all chapters as incomplete</div>
                    </button>
                    <button
                      onClick={() => handleReset('stats')}
                      className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                    >
                      <div className="font-medium text-gray-900">Reset Study Statistics</div>
                      <div className="text-sm text-gray-500">Clear all learning analytics</div>
                    </button>
                    <button
                      onClick={() => handleReset('all')}
                      className="w-full px-4 py-3 hover:bg-red-50 transition-colors text-left text-red-700"
                    >
                      <div className="font-medium">Reset All Progress</div>
                      <div className="text-sm text-red-600">Clear everything (cannot be undone)</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">🚪 Logout</div>
                <div className="text-sm text-gray-500">Sign out of your account</div>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
              >
                <div className="font-medium text-red-700">🗑️ Delete Account</div>
                <div className="text-sm text-red-600">Permanently delete your account and all data</div>
              </button>
            </div>
          </section>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
              </div>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All your data, progress, and settings will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unsaved Changes Warning */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="text-xl">⚠️</div>
              <div>
                <div className="font-medium text-yellow-900 mb-1">Unsaved Changes</div>
                <div className="text-sm text-yellow-700">
                  You have unsaved changes. Don't forget to save your profile.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
