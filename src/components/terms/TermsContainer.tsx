'use client';

import { useState } from 'react';
import TermsSidebar from './TermsSidebar';
import TermsContent from './TermsContent';

export default function TermsContainer() {
  const [activeSection, setActiveSection] = useState(0);
  return (
    <>
      <TermsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <TermsContent activeSection={activeSection} setActiveSection={setActiveSection} />
    </>
  );
}
