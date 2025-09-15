import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MapView from "@/pages/map-view";
import ReportZone from "@/pages/report-zone";
import Header from "@/components/navigation/header";

function Router() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Header />
      <main className="h-full relative" style={{ height: 'calc(100vh - 64px)' }}>
        <Switch>
          <Route path="/" component={MapView} />
          <Route path="/report" component={ReportZone} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
