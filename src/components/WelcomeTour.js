import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';

const WelcomeTour = () => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRunTour(true);
    }
  }, []);

  const handleTourEnd = (data) => {
    const { status } = data;
    const finishedStatuses = ['finished', 'skipped'];
    
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('hasSeenTour', 'true');
    }
  };

  const steps = [
    {
      target: '#top',
      content: 'Welcome to EzNoteManager! Let me show you around.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.create-note-button',
      content: 'Click here to create a new note. You can add titles, content, and organize them with categories and tags.',
      placement: 'bottom',
    },
    {
      target: '.flex.flex-1.overflow-hidden',
      content: 'Your notes will appear here. You can drag and drop them to reorder, and use the search bar to find specific notes.',
      placement: 'center',
    },
    {
      target: '.category-section',
      content: 'Organize your notes by categories. Click the + button to create new categories.',
      placement: 'right',
    },
    {
      target: '.tag-section',
      content: 'Add tags to your notes for even better organization. You can filter notes by clicking on tags.',
      placement: 'right',
    },
    {
      target: '.editor-toolbar',
      content: 'Our advanced editor supports Markdown formatting, code blocks with syntax highlighting, task lists, and more!',
      placement: 'bottom',
    },
    {
      target: '.encryption-toggle',
      content: 'Enable end-to-end encryption to secure your sensitive notes. Encrypted notes show a lock icon in the preview.',
      placement: 'bottom',
    },
    {
      target: '.theme-toggle',
      content: 'Switch between light and dark themes to suit your preference. Your choice is automatically saved.',
      placement: 'bottom',
    },
    {
      target: '.menu-button',
      content: 'Access additional features like importing/exporting notes, help documentation, and application settings.',
      placement: 'bottom',
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleTourEnd}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#4F46E5',
          backgroundColor: '#f3f4f6',
          textColor: '#1f2937',
        },
        spotlight: {
          backgroundColor: 'transparent',
        },
        tooltip: {
          backgroundColor: '#f3f4f6',
          textColor: '#1f2937',
          fontSize: '16px',
        },
        buttonNext: {
          backgroundColor: '#4F46E5',
          color: '#ffffff',
        },
        buttonBack: {
          color: '#4F46E5',
        },
        buttonSkip: {
          color: '#4F46E5',
        },
      }}
    />
  );
};

export default WelcomeTour; 