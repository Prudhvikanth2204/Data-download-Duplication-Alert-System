
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertProvider } from "@/context/AlertContext";
import Index from "./pages/Index";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Downloads from "./pages/Downloads";
import DownloadDatabase from "./pages/DownloadDatabase";
import UsageReport from "./pages/UsageReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AlertProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/download-database" element={<DownloadDatabase />} />
            <Route path="/usage-report" element={<UsageReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
