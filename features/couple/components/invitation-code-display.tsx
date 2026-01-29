'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export function InvitationCodeDisplay({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors (e.g. non-secure context); user can still select/copy manually.
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Badge variant="secondary" className="text-2xl font-mono px-4 py-2">
        {code}
      </Badge>
      <Button
        size="icon"
        variant="outline"
        onClick={handleCopy}
        className="h-10 w-10"
        aria-label="Copiar código"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

