import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/app-layout";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Contribute from "./pages/Contribute";
import Datesheet from "./pages/Datesheet";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import RepeatedQuestions from "./pages/RepeatedQuestions";
import AdminApprovals from "./pages/AdminApprovals";
import AdminSubjects from "./pages/AdminSubjects";
import AdminBranches from "./pages/AdminBranches";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
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
                <Route path="/about" element={<About />} />
                <Route path="/contribute" element={<Contribute />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/datesheet" element={<Datesheet />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/repeated" element={<RepeatedQuestions />} />
                <Route path="/admin/approvals" element={<AdminApprovals />} />
                <Route path="/admin/subjects" element={<AdminSubjects />} />
                <Route path="/admin/branches" element={<AdminBranches />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
