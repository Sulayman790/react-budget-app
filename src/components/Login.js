import { signInWithPopup } from "firebase/auth";
import { auth, provider, db  } from "../firebase";
import React, { useState, useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { doc, setDoc, getDoc  } from "firebase/firestore";

function Login({ onLogin }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await ensureUserData(user);
        onLogin(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [onLogin]);

  const ensureUserData = async (user) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, { 
        email: user.email, 
        createdAt: new Date().toISOString() 
      });
      
      await setDoc(doc(db, "users", user.uid, "globalBudget", "data"), {
        amount: 0,
        lastResetDate: new Date().toISOString(),
      });

      await setDoc(doc(db, 'users', user.uid, 'monthlySalary', 'data'), {
        amount: 0,
        lastResetDate: new Date().toISOString(),
      });
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        await ensureUserData(result.user);
        onLogin(result.user);
      })
      .catch((error) => {
        console.error("Error signing in with Google", error);
      });
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: '300px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Welcome to Budget App</Card.Title>
          <Button variant="primary" onClick={signInWithGoogle} className="w-100">
            Sign in with Google
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;