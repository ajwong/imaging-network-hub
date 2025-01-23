import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError, AuthChangeEvent } from "@supabase/supabase-js";
import SignupFields from "@/components/auth/SignupFields";
import AuthError from "@/components/auth/AuthError";

const Auth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ahpraNumber, setAhpraNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Watch for view changes in Auth UI
    const observer = setupViewObserver();

    return () => {
      subscription.unsubscribe();
      observer.disconnect();
    };
  }, [navigate, phoneNumber, ahpraNumber]);

  const handleAuthStateChange = async (event: AuthChangeEvent, session: any) => {
    if (event === 'SIGNED_IN' && session) {
      navigate("/");
    }
    if (event === 'USER_UPDATED') {
      const { error } = await supabase.auth.getSession();
      if (error) {
        setErrorMessage(getErrorMessage(error));
      }
    }
    if (event === 'SIGNED_OUT') {
      setErrorMessage("");
    }
    if (event === 'SIGNED_UP' as AuthChangeEvent) {
      supabase.auth.updateUser({
        data: {
          phone_number: phoneNumber,
          ahpra_number: ahpraNumber,
        }
      });
    }
  };

  const setupViewObserver = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement) {
          const viewText = mutation.target.textContent?.toLowerCase() || '';
          setIsSignUp(viewText.includes('sign up'));
        }
      });
    });

    const authContainer = document.querySelector('.supabase-auth-ui_ui-container');
    if (authContainer) {
      observer.observe(authContainer, { 
        subtree: true, 
        childList: true, 
        characterData: true 
      });
    }

    return observer;
  };

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'email_not_confirmed':
          return 'Please verify your email address before signing in.';
        case 'user_not_found':
          return 'No user found with these credentials.';
        case 'invalid_grant':
          return 'Invalid login credentials.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        Welcome to RadConnect
      </h1>
      
      <AuthError message={errorMessage} />
      
      {isSignUp && (
        <SignupFields
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          ahpraNumber={ahpraNumber}
          setAhpraNumber={setAhpraNumber}
        />
      )}

      <SupabaseAuth 
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#1E3A8A',
                brandAccent: '#1E40AF',
              },
            },
          },
        }}
        providers={[]}
      />
    </div>
  );
};

export default Auth;