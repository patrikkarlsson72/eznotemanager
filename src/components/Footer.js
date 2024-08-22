import React from 'react';
import logo from '../assets/EzNoteManagerlogo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white p-4 flex flex-col sm:flex-row justify-between items-center">
      {/* Logo and Title */}
      <div className="flex items-center mb-2 sm:mb-0">
        <img src={logo} alt="EzNoteManager Logo" className="h-16 w-auto mr-4" />
        <h1 className="font-sans text-3xl font-bold">
          EzNote<span className="text-yellow-500">Manager</span>
        </h1>
      </div>

      {/* Contact Details and Social Links */}
      <div className="flex flex-col items-center">
        <p className="mb-2">contact@eznotemanager.com</p>
        <div className="flex space-x-4">
          <a href="https://t.co/HfimYjMvTv" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="text-white hover:text-yellow-500 text-4xl" />
          </a>
          <a href="https://www.linkedin.com/in/patrik-karlsson-808b5855/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} className="text-white hover:text-yellow-500 text-4xl" />
          </a>
          <a href="https://github.com/patrikkarlsson72" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} className="text-white hover:text-yellow-500 text-4xl" />
          </a>
        </div>
      </div>

      {/* Back to Top Link */}
      <div className="mt-2 sm:mt-0">
       <a href="#top" className="text-yellow-500 hover:text-yellow-400 z-10 relative text-xl">Back to Top</a>
     </div>

    </footer>
  );
};

export default Footer;
