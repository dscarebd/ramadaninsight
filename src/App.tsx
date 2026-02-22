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
import Policies from "./pages/Policies";
import NotFound from "./pages/NotFound";
import { useContentProtection } from "@/hooks/useContentProtection";

const queryClient = new QueryClient();

const AppContent = () => {
  useContentProtection();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <AppContent />
        <BrowserRouter>
          <div className="max-w-md mx-auto min-h-screen bg-background relative">
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dua" element={<DuaHadith />} />
              <Route path="/salat" element={<SalatTracker />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
