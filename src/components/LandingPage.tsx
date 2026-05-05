import { Utensils, Target, BarChart3, CheckCircle, ArrowRight, Activity, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <header className="bg-white/40 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-10 h-10 vitality-gradient rounded-xl flex items-center justify-center shadow-lg shadow-vitality-lime/20 group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-vitality-slate">
                Calorie<span className="text-vitality-emerald">Tracker</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onSignIn}
                className="text-vitality-slate font-semibold hover:text-vitality-emerald hover:bg-vitality-lime/10"
              >
                Sign In
              </Button>
              <Button
                onClick={onSignUp}
                className="vitality-gradient hover:opacity-90 shadow-lg shadow-vitality-emerald/25 px-6 font-bold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vitality-lime blur-[120px] rounded-full" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vitality-emerald blur-[120px] rounded-full" />
          </div>
          
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vitality-lime/10 text-vitality-emerald font-bold text-sm mb-8 border border-vitality-emerald/20 animate-fade-in">
                <Activity className="w-4 h-4" />
                <span>REVOLUTIONIZING PERSONAL NUTRITION</span>
              </div>
              <h1 className="text-6xl sm:text-7xl font-extrabold text-vitality-slate mb-8 leading-[1.1] tracking-tight">
                Master Your Health with 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-vitality-lime to-vitality-emerald"> Precision</span>
              </h1>
              <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                Elevate your nutrition journey. Track with ease, optimize with science, 
                and witness the professional transformation of your body and mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Button
                  size="lg"
                  onClick={onSignUp}
                  className="vitality-gradient hover:opacity-95 text-lg px-10 py-7 rounded-2xl shadow-xl shadow-vitality-emerald/20 group transition-all"
                >
                  Start Your Transformation 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex -space-x-3 items-center ml-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" />
                     </div>
                   ))}
                   <span className="ml-6 text-sm font-bold text-slate-500 tracking-wide">Join 10k+ Athletes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-10">
              <div className="glass-card p-10 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 group">
                <div className="w-14 h-14 bg-vitality-lime/20 rounded-2xl flex items-center justify-center mb-6 group-hover:vitality-gradient transition-colors">
                  <Target className="w-8 h-8 text-vitality-emerald group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-vitality-slate mb-4">Elite Goal Setting</h3>
                <p className="text-slate-600 leading-relaxed">
                  Tailored macro-nutrient ratios and caloric targets engineered for your specific physiological profile.
                </p>
              </div>

              <div className="glass-card p-10 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 group">
                <div className="w-14 h-14 bg-vitality-emerald/20 rounded-2xl flex items-center justify-center mb-6 group-hover:vitality-gradient transition-colors">
                  <Zap className="w-8 h-8 text-vitality-emerald group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-vitality-slate mb-4">Instant Logging</h3>
                <p className="text-slate-600 leading-relaxed">
                  Frictionless entry system designed for the professional on the move. Log complete meals in under 10 seconds.
                </p>
              </div>

              <div className="glass-card p-10 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 group">
                <div className="w-14 h-14 bg-vitality-amber/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-vitality-amber transition-colors">
                  <BarChart3 className="w-8 h-8 text-vitality-amber group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-vitality-slate mb-4">Advanced Analytics</h3>
                <p className="text-slate-600 leading-relaxed">
                  Visual intelligence that translates raw data into actionable insights for continuous performance improvement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Prop Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 vitality-gradient relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white">
              Why Elite Performers Choose Us
            </h2>
            <p className="text-xl text-emerald-50 mb-16 max-w-2xl mx-auto opacity-90">
              We've stripped away the complexity to provide you with the most efficient tracking experience on the planet.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: "Zero Friction", desc: "No complex sub-menus." },
                { icon: Target, title: "Pure Science", desc: "Proven metabolic logic." },
                { icon: CheckCircle, title: "Always Free", desc: "No hidden paywalls." },
                { icon: Activity, title: "Data Privacy", desc: "Your data is encrypted." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-left">
                  <item.icon className="w-8 h-8 mb-4 text-vitality-lime" />
                  <h4 className="font-bold text-lg mb-2 text-white">{item.title}</h4>
                  <p className="text-sm text-emerald-50/80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-extrabold text-vitality-slate mb-8 leading-tight">
              Ready to redefine your <br />
              <span className="text-vitality-emerald">nutritional standard?</span>
            </h2>
            <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto">
              Join the new standard of health tracking. Setup takes less than 2 minutes.
            </p>
            <Button
              size="lg"
              onClick={onSignUp}
              className="vitality-gradient hover:opacity-90 text-xl px-16 py-8 rounded-2xl shadow-2xl shadow-vitality-emerald/30 font-bold"
            >
              Get Started Now — It's Free
            </Button>
            <p className="text-sm text-slate-400 mt-8 font-medium">
              NO CREDIT CARD REQUIRED • NO ADS • NO NONSENSE
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-vitality-slate text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-800 pb-12 mb-12">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 vitality-gradient rounded-lg flex items-center justify-center shadow-lg shadow-vitality-lime/20">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Calorie<span className="text-vitality-emerald">Tracker</span>
              </span>
            </div>
            <div className="flex gap-10 font-medium text-sm">
               <a href="#" className="hover:text-vitality-lime transition-colors">Privacy</a>
               <a href="#" className="hover:text-vitality-lime transition-colors">Terms</a>
               <a href="#" className="hover:text-vitality-lime transition-colors">Contact</a>
            </div>
          </div>
          <p className="text-sm text-center text-slate-500">
            © 2026 CalorieTracker. Engineered for professional vitality.
          </p>
        </div>
      </footer>
    </div>
  );
}
