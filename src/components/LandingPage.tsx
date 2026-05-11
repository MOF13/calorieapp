import { Utensils, Target, TrendingDown, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Utensils className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">CalorieTracker</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onSignIn}
                className="text-gray-700 hover:text-emerald-600"
              >
                Sign In
              </Button>
              <Button
                onClick={onSignUp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Hit Your Goals with
                <span className="text-emerald-600"> Simple</span> Calorie Tracking
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop guessing. Start seeing results. Track your calories and macros in seconds,
                get personalized nutrition goals, and finally achieve the body you want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={onSignUp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6"
                >
                  Start Tracking Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onSignIn}
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-lg px-8 py-6"
                >
                  Sign In
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Free forever
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Goals</h3>
                <p className="text-gray-600">
                  Get custom calorie and macro targets based on your age, weight, activity level, and goals.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Logging</h3>
                <p className="text-gray-600">
                  Log your meals in seconds. No complicated interfaces or endless scrolling through food databases.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600">
                  Visual progress tracking shows you exactly where you stand with your daily nutrition targets.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Why CalorieTracker Works
            </h2>
            <p className="text-xl text-emerald-50 mb-12">
              Most people fail at tracking because it's too complicated. We made it dead simple.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">No Overwhelm</h4>
                  <p className="text-emerald-50">
                    Simple interface that focuses on what matters: calories and macros.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Science-Based Goals</h4>
                  <p className="text-emerald-50">
                    Calculations based on proven metabolic formulas and your personal data.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Actually Free</h4>
                  <p className="text-emerald-50">
                    No hidden fees, no premium tiers. All features available to everyone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Your Data is Private</h4>
                  <p className="text-emerald-50">
                    We don't sell your data. Ever. Your health journey is yours alone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands who are hitting their goals with simple, effective calorie tracking.
            </p>
            <Button
              size="lg"
              onClick={onSignUp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-12 py-6"
            >
              Start Your Free Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Takes less than 2 minutes to set up
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Utensils className="w-6 h-6 text-emerald-500" />
            <span className="text-lg font-bold text-white">CalorieTracker</span>
          </div>
          <p className="text-sm">
            © 2025 CalorieTracker. Your journey to better health starts here.
          </p>
        </div>
      </footer>
    </div>
  );
}
