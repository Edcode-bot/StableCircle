import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Smartphone, ExternalLink } from 'lucide-react';

export function MobileWalletBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Check if user is on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check if wallet is available
  const hasWallet = window.celo || window.ethereum;
  
  // Only show banner if mobile and no wallet detected
  if (!isMobile || hasWallet || !isVisible) {
    return null;
  }

  return (
    <Card className="mx-4 mt-4 border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Smartphone className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-900 mb-1">
                Mobile Wallet Required
              </h4>
              <p className="text-sm text-orange-700 mb-3">
                To use StableCircle on mobile, you need to install Valora wallet and browse from within the app.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  onClick={() => {
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                    const url = isIOS 
                      ? "https://apps.apple.com/app/valora/id1520414263"
                      : "https://play.google.com/store/apps/details?id=co.clabs.valora";
                    window.open(url, '_blank');
                  }}
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Install Valora
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-orange-700 hover:bg-orange-100"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Copy App Link
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-orange-600 hover:bg-orange-100 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}