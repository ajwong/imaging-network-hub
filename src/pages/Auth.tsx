import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError, AuthChangeEvent } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ahpraNumber, setAhpraNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
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
      if (event === 'SIGNED_UP') {
        // Update user metadata after signup
        supabase.auth.updateUser({
          data: {
            phone_number: phoneNumber,
            ahpra_number: ahpraNumber,
          }
        });
      }
    });

    // Watch for view changes in Auth UI
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement) {
          const viewText = mutation.target.textContent?.toLowerCase() || '';
          setIsSignUp(viewText.includes('sign up'));
        }
      });
    });

    // Start observing the auth container for changes
    const authContainer = document.querySelector('.supabase-auth-ui_ui-container');
    if (authContainer) {
      observer.observe(authContainer, { 
        subtree: true, 
        childList: true, 
        characterData: true 
      });
    }

    return () => {
      subscription.unsubscribe();
      observer.disconnect();
    };
  }, [navigate, phoneNumber, ahpraNumber]);

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
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">Welcome to RadConnect</h1>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {isSignUp && (
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ahpra">AHPRA Number</Label>
            <Input
              id="ahpra"
              type="text"
              placeholder="Enter your AHPRA number"
              value={ahpraNumber}
              onChange={(e) => setAhpraNumber(e.target.value)}
            />
          </div>
        </div>
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