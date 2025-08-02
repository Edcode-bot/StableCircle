import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  ExternalLink, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MobileWalletGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function MobileWalletGuide({ isOpen, onClose, onRetry }: MobileWalletGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Install Valora Wallet",
      description: "Download the official Valora wallet app",
      action: "Download App",
      icon: Download,
      links: {
        ios: "https://apps.apple.com/app/valora/id1520414263",
        android: "https://play.google.com/store/apps/details?id=co.clabs.valora"
      }
    },
    {
      title: "Create Your Wallet",
      description: "Set up your new Celo wallet and secure your seed phrase",
      action: "Setup Complete",
      icon: CheckCircle,
    },
    {
      title: "Open Browser in Valora",
      description: "Use Valora's built-in browser to visit StableCircle",
      action: "Browse to App",
      icon: ExternalLink,
    },
    {
      title: "Connect Your Wallet",
      description: "Tap 'Connect Wallet' and approve the connection",
      action: "Try Again",
      icon: RefreshCw,
    }
  ];

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  const handleStepAction = (step: number) => {
    const stepData = steps[step];
    
    if (step === 0) {
      // Download app
      if (isIOS && stepData.links?.ios) {
        window.open(stepData.links.ios, '_blank');
      } else if (isAndroid && stepData.links?.android) {
        window.open(stepData.links.android, '_blank');
      }
      setCurrentStep(1);
    } else if (step === 1) {
      // Setup complete
      setCurrentStep(2);
    } else if (step === 2) {
      // Browse to app
      setCurrentStep(3);
    } else if (step === 3) {
      // Try connection again
      onRetry();
      onClose();
    }
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Smartphone className="mr-2 h-5 w-5" />
            Mobile Wallet Setup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Mobile Browser Limitation</p>
                <p className="text-sm text-blue-700 mt-1">
                  Most mobile browsers don't support wallet connections. You'll need to use Valora's built-in browser.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <Card key={index} className={`transition-all ${
                  isActive ? 'ring-2 ring-primary border-primary' : 
                  isCompleted ? 'bg-green-50 border-green-200' : 'opacity-60'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          isCompleted ? 'bg-green-100 text-green-600' :
                          isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className={`font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-800' : 'text-gray-600'}`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      
                      {isActive && (
                        <Button
                          size="sm"
                          onClick={() => handleStepAction(index)}
                          className="flex-shrink-0"
                        >
                          {step.action}
                        </Button>
                      )}
                      
                      {isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {currentStep === 2 && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Quick Access</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Copy this URL and paste it in Valora's browser:
                </p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-white p-2 rounded text-xs border font-mono">
                    {window.location.href}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyAppUrl}>
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {currentStep === 3 && (
                <Button onClick={() => handleStepAction(3)}>
                  Try Connection
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}