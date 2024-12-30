import React, { useState } from 'react';
import logo from '../assets/EzNoteManagerPrologo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter, faLinkedin, faGithub, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfServiceModal from './TermsOfServiceModal';
import HelpFaqModal from './HelpFaqModal';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
  const [isHelpFaqOpen, setIsHelpFaqOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'dark' ? 'bg-blue-950 text-white' : 'bg-blue-100 text-gray-800'} p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0`}>
      {/* Logo and Title */}
      <div className="flex items-center mb-2 sm:mb-0">
        <img src={logo} alt="EzNoteManagerPro Logo" className="h-16 w-auto mr-4" />
        <h1 className="font-sans text-3xl font-bold">
          EzNote<span className="text-yellow-500">Manager</span><span className="text-blue-500">Pro</span>
        </h1>
      </div>

      {/* Social Links */}
      <div className="flex space-x-4 mt-4 sm:mt-0">
        <a href="https://tinyurl.com/4av853kk" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faWhatsapp} className={`${theme === 'dark' ? 'text-white hover:text-yellow-500' : 'text-gray-800 hover:text-yellow-600'} text-4xl`} />
        </a>
        <a href="https://t.co/HfimYjMvTv" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faSquareXTwitter} className={`${theme === 'dark' ? 'text-white hover:text-yellow-500' : 'text-gray-800 hover:text-yellow-600'} text-4xl`} />
        </a>
        <a href="https://www.linkedin.com/in/patrik-karlsson-808b5855/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} className={`${theme === 'dark' ? 'text-white hover:text-yellow-500' : 'text-gray-800 hover:text-yellow-600'} text-4xl`} />
        </a>
        <a href="https://github.com/patrikkarlsson72" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} className={`${theme === 'dark' ? 'text-white hover:text-yellow-500' : 'text-gray-800 hover:text-yellow-600'} text-4xl`} />
        </a>
      </div>

      {/* Useful Links */}
      <div className="flex flex-col items-center">
        <button onClick={() => setIsPrivacyPolicyOpen(true)} className={`${theme === 'dark' ? 'text-yellow-500 hover:text-yellow-400' : 'text-blue-600 hover:text-blue-700'}`}>Privacy Policy</button>
        <button onClick={() => setIsTermsOfServiceOpen(true)} className={`${theme === 'dark' ? 'text-yellow-500 hover:text-yellow-400' : 'text-blue-600 hover:text-blue-700'}`}>Terms of Service</button>
        <button onClick={() => setIsHelpFaqOpen(true)} className={`${theme === 'dark' ? 'text-yellow-500 hover:text-yellow-400' : 'text-blue-600 hover:text-blue-700'}`}>Help/FAQ</button>
      </div>

      {/* Back to Top Link */}
      <div className="mt-2 sm:mt-0">
        <a href="#top" className={`${theme === 'dark' ? 'text-yellow-500 hover:text-yellow-400' : 'text-blue-600 hover:text-blue-700'} z-10 relative text-xl`}>Back to Top</a>
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
