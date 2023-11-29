import React from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './component/config/config';
export function useAuthentication() {
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(undefined);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };
  return {
    user,handleSignOut
  };

}