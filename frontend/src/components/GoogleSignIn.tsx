'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInProps {
  onSuccess?: () => void;
  buttonText?: string;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ 
  onSuccess, 
  buttonText = 'Sign in with Google' 
}) => {
  const { login } = useAuth();
  const router = useRouter();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Client ID is configured
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!googleClientId || googleClientId === 'your-google-client-id-here') {
      console.log('Google OAuth not configured - skipping Google Sign-In setup');
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
          });

          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { 
              theme: 'outline', 
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              width: '100%'
            }
          );
          setIsGoogleLoaded(true);
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
        }
      }
    };

    // Load Google Sign-In script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
      };
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      const result = await authAPI.googleAuth(response.credential);
      login(result.access_token, result.user);
      toast.success('Successfully signed in with Google!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error(error.response?.data?.error || 'Google sign-in failed');
    }
  };

  // Check if Google OAuth is configured
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!googleClientId || googleClientId === 'your-google-client-id-here') {
    return (
      <div className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-center">
        <p className="text-sm text-gray-600">
          Google OAuth not configured
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Please set up Google OAuth credentials to enable Google Sign-In
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full"></div>
      {!isGoogleLoaded && (
        <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-center">
          <p className="text-sm text-gray-600">Loading Google Sign-In...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleSignIn;
