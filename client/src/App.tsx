import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import UserDashboard from "@/pages/user-dashboard";
import OwnerDashboard from "@/pages/owner-dashboard";
import PropertyDetails from "@/pages/property-details";
import NotFound from "@/pages/not-found";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Footer from "@/components/footer";
import Careers from "@/pages/careers";
import Press from "@/pages/press";
import Blog from "@/pages/blog";
import HelpCenter from "@/pages/help-center";
import Safety from "@/pages/safety";
import Cancellation from "@/pages/cancellation";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Cookies from "@/pages/cookies";
import Sitemap from "@/pages/sitemap";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!user ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/properties" component={Home} />
          <Route path="/property/:id" component={PropertyDetails} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/properties" component={Home} />
          <Route 
            path="/dashboard" 
            component={user.role === 'owner' ? OwnerDashboard : UserDashboard} 
          />
          <Route path="/property/:id" component={PropertyDetails} />
        </>
      )}
      <Route path="/about" component={About} />
      <Route path="/careers" component={Careers} />
      <Route path="/press" component={Press} />
      <Route path="/blog" component={Blog} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/safety" component={Safety} />
      <Route path="/cancellation" component={Cancellation} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/sitemap" component={Sitemap} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
          <Router />
            </div>
            <Footer />
          </div>
        </TooltipProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
}

export default App;
