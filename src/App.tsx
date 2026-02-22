import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import DuaHadith from "./pages/DuaHadith";
import SalatTracker from "./pages/SalatTracker";
import Schedule from "./pages/Schedule";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Policies from "./pages/Policies";
import NotFound from "./pages/NotFound";
import { useContentProtection } from "@/hooks/useContentProtection";
import { useBackButtonHandler } from "@/hooks/useBackButtonHandler";
import { useStatusBar } from "@/hooks/useStatusBar";
import { useKeyboard } from "@/hooks/useKeyboard";
import Footer from "@/components/Footer";
import appQuran from '@/assets/app-quran.png';
import appQuiz from '@/assets/app-quiz.png';
import appExpense from '@/assets/app-expense.png';
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  useContentProtection();
  useBackButtonHandler();
  useStatusBar();
  useKeyboard();
  useEffect(() => {
    [appQuran, appQuiz, appExpense].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
          <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto min-h-screen bg-background relative">
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dua" element={<DuaHadith />} />
              <Route path="/salat" element={<SalatTracker />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
            <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
