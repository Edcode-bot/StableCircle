import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/contexts/WalletContext";
import { GroupProvider } from "@/contexts/GroupContext";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import Dashboard from "@/pages/Dashboard";
import GroupDetail from "@/pages/GroupDetail";
import CreateGroup from "@/pages/CreateGroup";
import JoinGroup from "@/pages/JoinGroup";
import NotFound from "@/pages/not-found";
import { Users } from "lucide-react";
import { Link, useLocation } from "wouter";

function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary flex items-center">
                <Users className="mr-2 h-6 w-6" />
                StableCircle
              </h1>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link 
                href="/" 
                className={`font-medium transition-colors ${
                  location === '/' ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/create" 
                className={`font-medium transition-colors ${
                  location === '/create' ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                Create Group
              </Link>
              <Link 
                href="/join" 
                className={`font-medium transition-colors ${
                  location === '/join' ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                Join Group
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
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/group/:id" component={GroupDetail} />
          <Route path="/create" component={CreateGroup} />
          <Route path="/join" component={JoinGroup} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <GroupProvider>
            <Toaster />
            <Router />
          </GroupProvider>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
