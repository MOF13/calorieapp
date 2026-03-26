import { Utensils, TrendingUp, Target, ChartBar as BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackgroundPaths } from '@/components/ui/background-paths';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden flex flex-col w-full">
      <BackgroundPaths />

      <div className="relative z-10 flex-1 flex flex-col w-full">
        <div className="w-full px-3 py-6 sm:px-6 sm:py-12 flex-1 flex flex-col justify-center">
          <div className="text-center space-y-4 sm:space-y-6 max-w-full">
            <div className="inline-flex items-center justify-center w-13 h-13 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mx-auto">
              <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>

            <div className="space-y-3 sm:space-y-5">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight px-0">
                Hit Your Goals with{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Simple
                </span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Calorie Tracking
              </h1>

              <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-1">
                Stop guessing. Start seeing results. Track your calories and macros in seconds,
                get personalized nutrition goals, and finally achieve the body you want.
              </p>
            </div>

            <div className="pt-1 flex flex-col items-center gap-2">
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 sm:px-10 py-5 sm:py-6 text-sm sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                Start Tracking Free →
              </Button>
              <p className="text-xs sm:text-sm text-gray-500">
                No credit card required • Free forever
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-14 px-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1.5">Personalized Goals</h3>
              <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
                Get science-based calorie and macro targets calculated for your body.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1.5">Easy Meal Tracking</h3>
              <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
                Log your meals quickly and see your daily nutrition in real-time.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1.5">Track Progress</h3>
              <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
                Visualize your journey with detailed charts and stay motivated.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full px-3 sm:px-6 pb-6 sm:pb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-2xl p-5 sm:p-8 lg:p-10 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Start Your Journey Today
                </h2>
                <p className="text-xs sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Join thousands of people who have transformed their relationship with food.
                  No credit card required. No complicated setup. Just results.
                </p>
                <Button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all w-full lg:w-auto"
                >
                  Get Started Now →
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-3 sm:p-5 text-center">
                  <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5">100%</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Science-Based</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg sm:rounded-xl p-3 sm:p-5 text-center">
                  <Target className="w-5 h-5 sm:w-7 sm:h-7 text-teal-600 mx-auto mb-1.5" />
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5">Free</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Forever</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg sm:rounded-xl p-3 sm:p-5 text-center">
                  <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-600 mx-auto mb-1.5" />
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5">Easy</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">To Use</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-lg sm:rounded-xl p-3 sm:p-5 text-center">
                  <Utensils className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5">Fast</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Setup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
