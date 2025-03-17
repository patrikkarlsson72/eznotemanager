import React, { useState } from 'react';
import overviewImg from '../assets/guide-images/overview.png';
import categoriesImg from '../assets/guide-images/categories.png';
import tagsImg from '../assets/guide-images/tags.png';
import noteDetailsImg from '../assets/guide-images/note-details.png';
import advancededitorImg from '../assets/guide-images/advancededitor.png';
import encryptionImg from '../assets/guide-images/encryption.png';

const WelcomeGuide = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to EzNoteManagerPro!",
      content: "A powerful and intuitive note-taking application.",
      image: overviewImg,
      description: "Your notes are displayed in an organized grid layout. Create, edit, and manage your notes with ease."
    },
    {
      title: "Advanced Editor Features",
      content: "Create rich content with our powerful editor.",
      image: advancededitorImg,
      description: "Use Markdown formatting, create code blocks with syntax highlighting, manage tasks with checkboxes, and embed images and files directly in your notes."
    },
    {
      title: "Secure Your Notes",
      content: "End-to-end encryption for your sensitive information.",
      image: encryptionImg,
      description: "Enable encryption to secure your private notes. Encrypted notes are marked with a lock icon and can only be read by you."
    },
    {
      title: "Organize with Categories",
      content: "Keep your notes organized by categories.",
      image: categoriesImg,
      description: "Use the sidebar to filter notes by category. Create custom categories to match your workflow."
    },
    {
      title: "Tag Your Notes",
      content: "Add tags to find notes quickly.",
      image: tagsImg,
      description: "Tags make it easy to find related notes. Click on tags to filter your notes instantly."
    },
    {
      title: "Always Available",
      content: "Work online or offline with automatic syncing.",
      image: overviewImg,
      description: "Your notes are cached locally for offline access. Changes sync automatically when you're back online."
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-600 mb-4">{steps[currentStep].content}</p>
        </div>

        <div className="mb-8">
          <img
            src={steps[currentStep].image}
            alt={steps[currentStep].title}
            className="rounded-lg shadow-lg w-full object-contain max-h-[60vh]"
          />
          <p className="text-gray-600 mt-4">{steps[currentStep].description}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            className={`px-4 py-2 rounded ${
              currentStep === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide; 