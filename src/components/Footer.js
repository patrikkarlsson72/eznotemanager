import React from 'react';
import logo from '../assets/EzNoteManagerlogo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter, faLinkedin, faGithub, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      {/* Logo and Title */}
      <div className="flex items-center mb-2 sm:mb-0">
        <img src={logo} alt="EzNoteManager Logo" className="h-16 w-auto mr-4" />
        <h1 className="font-sans text-3xl font-bold">
          EzNote<span className="text-yellow-500">Manager</span>
        </h1>
      </div>

      {/* Contact Details 
      <div className="text-center sm:text-left">
        <p className="mb-2">Contact us: <a href="mailto:support@eznotemanager.com" className="text-yellow-500 hover:text-yellow-400">support@eznotemanager.com</a></p>
        <p className="mb-2">Phone: +1 (123) 456-7890</p>
        <p>123 Main Street, Tech City, USA</p>
      </div>*/}

      {/* Useful Links */}
      <div className="flex flex-col items-center">
        <a href="/privacy-policy" className="text-yellow-500 hover:text-yellow-400">Privacy Policy</a>
        <a href="/terms-of-service" className="text-yellow-500 hover:text-yellow-400">Terms of Service</a>
        <a href="/faq" className="text-yellow-500 hover:text-yellow-400">Help/FAQ</a>
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

      {/* Newsletter Subscription */}
      <div className="flex flex-col items-center mt-4 sm:mt-0">
        <p className="mb-2">Subscribe to our newsletter:</p>
        <input type="email" placeholder="Enter your email" className="p-2 rounded-md text-black mb-2"/>
        <button className="bg-yellow-500 text-blue-950 px-4 py-2 rounded-md hover:bg-yellow-400">Subscribe</button>
      </div>

      {/* Back to Top Link */}
      <div className="mt-2 sm:mt-0">
        <a href="#top" className="text-yellow-500 hover:text-yellow-400 z-10 relative text-xl">Back to Top</a>
      </div>

    </footer>
  );
};

export default Footer;
