import React, { useState } from 'react';
import logo from '../assets/EzNoteManagerlogo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter, faLinkedin, faGithub, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PrivacyPolicyModal from './PrivacyPolicyModal';  // Import the PrivacyPolicyModal component
import TermsOfServiceModal from './TermsOfServiceModal';  // Import the TermsOfServiceModal component
import HelpFaqModal from './HelpFaqModal'; // Import HelpFaqModal

const Footer = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
  const [isHelpFaqOpen, setIsHelpFaqOpen] = useState(false); // Add state for Help/FAQ modal

  return (
    <footer className="bg-blue-950 text-white p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      {/* Logo and Title */}
      <div className="flex items-center mb-2 sm:mb-0">
        <img src={logo} alt="EzNoteManager Logo" className="h-16 w-auto mr-4" />
        <h1 className="font-sans text-3xl font-bold">
          EzNote<span className="text-yellow-500">Manager</span>
        </h1>
      </div>

      {/* Social Links */}
      <div className="flex space-x-4 mt-4 sm:mt-0">
        <a href="https://tinyurl.com/4av853kk" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faWhatsapp} className="text-white hover:text-yellow-500 text-4xl" />
        </a>
        <a href="https://t.co/HfimYjMvTv" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faSquareXTwitter} className="text-white hover:text-yellow-500 text-4xl" />
        </a>
        <a href="https://www.linkedin.com/in/patrik-karlsson-808b5855/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} className="text-white hover:text-yellow-500 text-4xl" />
        </a>
        <a href="https://github.com/patrikkarlsson72" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} className="text-white hover:text-yellow-500 text-4xl" />
        </a>
      </div>

      {/* Useful Links */}
      <div className="flex flex-col items-center">
        <button onClick={() => setIsPrivacyPolicyOpen(true)} className="text-yellow-500 hover:text-yellow-400">Privacy Policy</button>
        <button onClick={() => setIsTermsOfServiceOpen(true)} className="text-yellow-500 hover:text-yellow-400">Terms of Service</button>
        <button onClick={() => setIsHelpFaqOpen(true)} className="text-yellow-500 hover:text-yellow-400">Help/FAQ</button>
      </div>

      {/* Back to Top Link */}
      <div className="mt-2 sm:mt-0">
        <a href="#top" className="text-yellow-500 hover:text-yellow-400 z-10 relative text-xl">Back to Top</a>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyPolicyOpen} 
        onRequestClose={() => setIsPrivacyPolicyOpen(false)} 
      />

      {/* Terms of Service Modal */}
      <TermsOfServiceModal 
        isOpen={isTermsOfServiceOpen} 
        onRequestClose={() => setIsTermsOfServiceOpen(false)} 
      />

      {/* Help/FAQ Modal */}
      <HelpFaqModal 
        isOpen={isHelpFaqOpen} 
        onRequestClose={() => setIsHelpFaqOpen(false)} 
      />
    </footer>
  );
};

export default Footer;
