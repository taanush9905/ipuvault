import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/app-layout";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Datesheet from "./pages/Datesheet";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import RepeatedQuestions from "./pages/RepeatedQuestions";
import AdminApprovals from "./pages/AdminApprovals";
import AdminSubjects from "./pages/AdminSubjects";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
         <Analytics />
          <AuthProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/datesheet" element={<Datesheet />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/repeated" element={<RepeatedQuestions />} />
                <Route path="/admin/approvals" element={<AdminApprovals />} />
                <Route path="/admin/subjects" element={<AdminSubjects />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </AuthProvider>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
