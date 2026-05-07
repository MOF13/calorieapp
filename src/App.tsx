import { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { getCurrentUser, signUp, signIn } from './lib/auth';
import { getUserProfile } from './lib/db';
import { DashboardSkeleton } from './components/dashboard/DashboardSkeleton';

type AppView = 'landing' | 'signup' | 'signin' | 'onboarding' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const user = await getCurrentUser();

      if (user) {
        setUserId(user.id);
        const profile = await getUserProfile(user.id);

        if (profile) {
          setUserProfile(profile);
          setCurrentView('dashboard');
        } else {
          setCurrentView('onboarding');
        }
      } else {
        setCurrentView('landing');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      setCurrentView('landing');
    } finally {
      setIsLoading(false);
    }
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
        setUserProfile(profile);
        setCurrentView('dashboard');
      } else {
        setCurrentView('onboarding');
      }

      return { success: true };
    }

    return { success: false, error: 'Failed to sign in' };
  };

  const handleOnboardingComplete = async () => {
    if (userId) {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
      setCurrentView('dashboard');
    }
  };

  const handleSignOut = async () => {
    setUserId(null);
    setUserProfile(null);
    setCurrentView('landing');
  };

  if (isLoading) {
    return <DashboardSkeleton />;
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

  return (
    <Dashboard 
      userId={userId} 
      userProfile={userProfile} 
      onSignOut={handleSignOut} 
      onProfileUpdate={setUserProfile} 
    />
  );
}

export default App;
