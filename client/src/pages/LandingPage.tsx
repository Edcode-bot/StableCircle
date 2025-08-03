import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { useWallet } from '@/contexts/WalletContext';
import { FAQ_DATA, APP_CONFIG } from '@/config/constants';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Coins, 
  TrendingUp, 
  ArrowRight, 
  Play,
  CheckCircle,
  Globe,
  Smartphone,
  Award,
  Target,
  Clock,
  MessageCircle,
  Zap,
  Gift,
  Heart,
  Eye
} from 'lucide-react';
import { FaDiscord, FaTwitter, FaGithub } from 'react-icons/fa';

export default function LandingPage() {
  const { isConnected } = useWallet();
  const [, setLocation] = useLocation();
  const [showVideo, setShowVideo] = useState(false);
  const [impactStats, setImpactStats] = useState({
    totalSaved: 0,
    activeHubs: 0,
    topContributor: 'Anonymous'
  });

  useEffect(() => {
    // Load live impact data
    const loadImpactData = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setImpactStats({
            totalSaved: data.totalSaved || 125000,
            activeHubs: data.totalHubs || 47,
            topContributor: 'CeloBuilder' // Could be from data.topContributor
          });
        }
      } catch (error) {
        // Use demo data if API fails
        setImpactStats({
          totalSaved: 125000,
          activeHubs: 47,
          topContributor: 'CeloBuilder'
        });
      }
    };

    loadImpactData();
    const interval = setInterval(loadImpactData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  if (isConnected) {
    setLocation('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
                "linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
                "linear-gradient(225deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
                "linear-gradient(315deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                  🚀 Powered by Celo Blockchain
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-6xl font-bold mb-6 leading-tight text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Save Together,<br />
                <motion.span 
                  className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Grow Together
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl sm:text-2xl mb-8 text-blue-100 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Join collaborative savings hubs using cUSD stablecoin. 
                Build financial freedom with friends on the Celo blockchain.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <WalletConnectButton />
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  onClick={() => setShowVideo(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  How It Works
                </Button>
              </motion.div>
              
              <motion.div 
                className="mt-8 flex items-center justify-center lg:justify-start space-x-8 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="flex items-center text-white/90">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>100% Transparent</span>
                </div>
                <div className="flex items-center text-white/90">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Blockchain Secured</span>
                </div>
                <div className="flex items-center text-white/90">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Community Driven</span>
                </div>
              </motion.div>
            </motion.div>
            
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Start Your Circle</h3>
                  <p className="text-blue-100">Connect your wallet to begin</p>
                </div>
                
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">My Groups</span>
                      <Badge className="bg-green-500/20 text-green-100">Active</Badge>
                    </div>
                    <div className="text-2xl font-bold">3 Groups</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Total Saved</span>
                      <Badge className="bg-blue-500/20 text-blue-100">cUSD</Badge>
                    </div>
                    <div className="text-2xl font-bold">1,250.00</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Rewards Earned</span>
                      <Badge className="bg-accent/20 text-accent-foreground">Referrals</Badge>
                    </div>
                    <div className="text-2xl font-bold">75.00</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose StableCircle?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of group savings with blockchain transparency and community rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Decentralized Saving</h3>
                <p className="text-gray-600">
                  Your funds are secured by smart contracts on the Celo blockchain. 
                  No central authority controls your money.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Transparent Payouts</h3>
                <p className="text-gray-600">
                  Every transaction is recorded on-chain. Track contributions, 
                  payouts, and group progress in real-time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Social Rewards</h3>
                <p className="text-gray-600">
                  Earn rewards for referring friends, maintaining saving streaks, 
                  and building strong savings communities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Mobile-First</h3>
                <p className="text-gray-600">
                  Designed for mobile use with support for MetaMask mobile, 
                  Valora, and other Celo-compatible wallets.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Flexible Goals</h3>
                <p className="text-gray-600">
                  Set custom saving targets, deadlines, and contribution amounts. 
                  Adapt to your group's needs and preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold">Automated Payouts</h3>
                <p className="text-gray-600">
                  Smart contracts handle payout distribution automatically 
                  based on your group's agreed schedule.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How StableCircle Works
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Watch this 2-minute video to understand group savings circles
          </p>
          
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {showVideo ? (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="How StableCircle Works"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                <Button
                  size="lg"
                  onClick={() => setShowVideo(true)}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <Play className="mr-2 h-6 w-6" />
                  Play Video
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">$2.5M+</div>
              <div className="text-gray-600">Total Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">500+</div>
              <div className="text-gray-600">Savings Circles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">99.9%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about StableCircle
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            About StableCircle
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            StableCircle was born from the vision of making group savings accessible, 
            transparent, and rewarding for everyone. Built on the Celo blockchain, 
            we're creating a new way for communities to save together while earning 
            rewards and building financial resilience.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Our mission is to empower individuals and communities worldwide by providing 
            a decentralized, transparent platform for collective savings that removes 
            traditional barriers and creates new opportunities for financial growth.
          </p>
          
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Saving?</h3>
            <p className="text-blue-100 mb-6">
              Join thousands of users building their financial future with StableCircle
            </p>
            <WalletConnectButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-primary mr-3" />
                <span className="text-2xl font-bold">StableCircle</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering communities through decentralized group savings on the Celo blockchain.
              </p>
              <div className="flex space-x-4">
                <a 
                  href={APP_CONFIG.SOCIAL_LINKS.discord}
                  className="text-gray-400 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDiscord className="h-6 w-6" />
                </a>
                <a 
                  href={APP_CONFIG.SOCIAL_LINKS.twitter}
                  className="text-gray-400 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a 
                  href={APP_CONFIG.SOCIAL_LINKS.github}
                  className="text-gray-400 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/create" className="hover:text-white transition-colors">Create Group</Link></li>
                <li><Link href="/join" className="hover:text-white transition-colors">Join Group</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 StableCircle. Built on Celo blockchain.</p>
            <p className="mt-2">Developed by <span className="text-primary font-semibold">Edcode and Bruno Maa</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}