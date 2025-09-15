import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithRedirect, 
  signOut, 
  getRedirectResult,
  User 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // If Firebase auth is not available, just set loading to false
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          toast({
            title: "Welcome!",
            description: `Successfully signed in as ${result.user.displayName || result.user.email}`,
          });
        }
      })
      .catch((error) => {
        console.error("Auth redirect error:", error);
        toast({
          title: "Sign-in failed",
          description: "Please check your Firebase configuration",
          variant: "destructive",
        });
      });

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      toast({
        title: "Authentication unavailable",
        description: "Firebase authentication is not configured",
        variant: "destructive",
      });
      return;
    }

    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Sign-in error:", error);
      toast({
        title: "Sign-in failed",
        description: "Please check your Firebase configuration",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    if (!auth) return;
    
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      console.error("Sign-out error:", error);
      toast({
        title: "Sign-out failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user,
    authAvailable: !!auth,
  };
};