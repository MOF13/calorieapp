import { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { getCurrentUser, signUp, signIn } from './lib/auth';
import { getUserProfile } from './lib/db';

type AppView = 'landing' | 'signup' | 'signin' | 'onboarding' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    const user = await getCurrentUser();

    if (user) {
      setUserId(user.id);
      const profile = await getUserProfile(user.id);

      if (profile) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('onboarding');
      }
    } else {
      setCurrentView('landing');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    const { user, error } = await signUp(email, password, name);

    if (error) {
      return { success: false, error };
    }

    if (user) {
      setUserId(user.id);
      setCurrentView('onboarding');
      return { success: true };
    }

    return { success: false, error: 'Failed to create account' };
  };

  const handleSignIn = async (email: string, password: string) => {
    const { user, error } = await signIn(email, password);

    if (error) {
      return { success: false, error };
    }

    if (user) {
      setUserId(user.id);
      const profile = await getUserProfile(user.id);

      if (profile) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('onboarding');
      }

      return { success: true };
    }

    return { success: false, error: 'Failed to sign in' };
  };

  const handleOnboardingComplete = () => {
    setCurrentView('dashboard');
  };

  const handleSignOut = async () => {
    setUserId(null);
    setCurrentView('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-emerald-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (currentView === 'landing') {
    return (
      <LandingPage
        onSignIn={() => setCurrentView('signin')}
        onSignUp={() => setCurrentView('signup')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignUpForm
        onSignUp={handleSignUp}
        onBackToLanding={() => setCurrentView('landing')}
        onSwitchToSignIn={() => setCurrentView('signin')}
      />
    );
  }

  if (currentView === 'signin') {
    return (
      <SignInForm
        onSignIn={handleSignIn}
        onBackToLanding={() => setCurrentView('landing')}
        onSwitchToSignUp={() => setCurrentView('signup')}
      />
    );
  }

  if (currentView === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} userId={userId} />;
  }

  return <Dashboard userId={userId} onSignOut={handleSignOut} />;
}

export default App;
