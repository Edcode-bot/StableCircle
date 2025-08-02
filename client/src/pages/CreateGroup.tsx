import { CreateGroupForm } from '@/components/CreateGroupForm';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function CreateGroup() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <CreateGroupForm />
    </div>
  );
}
