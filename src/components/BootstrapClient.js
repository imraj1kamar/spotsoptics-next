'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Bootstrap JS ko client-side par load karein
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}