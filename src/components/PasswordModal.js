import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordModal = ({ isOpen, onClose, onSubmit, isEncrypting = false, title = '', isCreatingPassword = false }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const passwordInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
      setError('');
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isCreatingPassword) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    onSubmit(password);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-xl p-6 w-96 max-w-full mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            {isEncrypting 
              ? isCreatingPassword ? 'Create Password' : 'Set Password for Note'
              : `Enter Password for "${title}"`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faLock} className={`mr-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
              <label 
                htmlFor="password" 
                className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} font-medium`}
              >
                {isCreatingPassword ? 'Create Password' : 'Password'}
              </label>
            </div>
            <div className="relative">
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 pr-10 border rounded ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 text-gray-800'
                    : 'bg-gray-700 border-gray-600 text-white'
                }`}
                placeholder="Enter password"
                autoComplete="new-password"
              />
              <button 
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
                onClick={toggleShowPassword}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          
          {isCreatingPassword && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faLock} className={`mr-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
                <label 
                  htmlFor="confirmPassword" 
                  className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} font-medium`}
                >
                  Confirm Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-2 pr-10 border rounded ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-800'
                      : 'bg-gray-700 border-gray-600 text-white'
                  }`}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
                <button 
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
                  onClick={toggleShowPassword}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex space-x-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border rounded ${
                theme === 'light'
                  ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                  : 'border-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEncrypting ? 'Encrypt Note' : 'Decrypt Note'}
            </button>
          </div>
        </form>
        
        {!isCreatingPassword && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {isEncrypting 
              ? 'This will encrypt the note with a password. You\'ll need this password to view the note again.'
              : 'Enter the password you used to encrypt this note.'}
          </p>
        )}
        
        {isCreatingPassword && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Important: If you forget this password, you will not be able to recover your encrypted note. There is no password reset option.
          </p>
        )}
      </div>
    </div>
  );
};

export default PasswordModal; 