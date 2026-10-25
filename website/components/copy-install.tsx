'use client';

import { useState } from 'react';
import { INSTALL_COMMAND } from '@/lib/site';

export function CopyInstall() {
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <button type="button" className="install__code" onClick={copyInstall}>
      {copied ? 'Copied!' : INSTALL_COMMAND}
    </button>
  );
}
