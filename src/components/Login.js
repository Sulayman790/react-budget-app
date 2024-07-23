import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import React, { useState, useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";

function Login({ onLogin }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        onLogin(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [onLogin]);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
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