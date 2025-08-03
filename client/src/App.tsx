import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { WalletProvider } from "@/contexts/WalletContext";
import { GroupProvider } from "@/contexts/GroupContext";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { ChatBot } from "@/components/ChatBot";
import ErrorBoundary from "@/components/ErrorBoundary";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import MobileDashboard from "@/pages/MobileDashboard";
import GroupDetail from "@/pages/GroupDetail";
import CreateGroup from "@/pages/CreateGroup";
import JoinGroup from "@/pages/JoinGroup";
import Leaderboard from "@/pages/Leaderboard";
import NotFound from "@/pages/not-found";
import { Users } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";

function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary flex items-center">
                <Users className="mr-2 h-6 w-6" />
                StableCircle
              </h1>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link 
                href="/dashboard" 
                className={`font-medium transition-colors ${
                  location === '/dashboard' ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/create-hub" 
                className={`font-medium transition-colors ${
                  location === '/create-hub' ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                Create Hub
              </Link>
              <Link 
                href="/join-hub" 
                className={`font-medium transition-colors ${
                  location === '/join-hub' ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                Join Hub
              </Link>
              <Link 
                href="/leaderboard" 
                className={`font-medium transition-colors ${
                  location === '/leaderboard' ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                Leaderboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © 2024 StableCircle. Built on Celo blockchain.
            </p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Router() {
  const [, params] = useRoute("/");
  const [location] = useLocation();
  
  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('pendingReferral', refCode);
    }
  }, []);
  
  // Show landing page on root, dashboard for logged in users
  if (location === "/") {
    return <LandingPage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/mobile-dashboard" component={MobileDashboard} />
          <Route path="/group/:id" component={GroupDetail} />
          <Route path="/hub/:id" component={GroupDetail} />
          <Route path="/create" component={CreateGroup} />
          <Route path="/create-hub" component={CreateGroup} />
          <Route path="/join" component={JoinGroup} />
          <Route path="/join-hub" component={JoinGroup} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WalletProvider>
            <GroupProvider>
              <ErrorBoundary>
                <Router />
              </ErrorBoundary>
              <ChatBot />
              <Toaster />
            </GroupProvider>
          </WalletProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
