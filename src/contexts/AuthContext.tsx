import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../services/firebase'
import { ReactNode, createContext, useEffect, useState } from "react";

type User = {
    id: string;
    name:string;
    avatar: string;
}
  
export type AuthContextType ={
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps ={
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

  
export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    //mnitoramento para não perder as informações de login do usuario
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user){
          const { displayName, photoURL, uid} = user
  
          if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.')
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }
      })
  
      return () =>{
        unsubscribe();
      }
    }, [])
  
    async function signInWithGoogle(){
      const provider = new GoogleAuthProvider();
  
      const result = await signInWithPopup(auth, provider)
  
      if(result.user){
        const { displayName, photoURL, uid} = result.user
  
          if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.')
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
      }
    }
  
    
    return(
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );
}