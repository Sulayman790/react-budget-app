import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function useFirebase(collection, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, collection, user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setValue(docSnap.data());
        } else {
          await setDoc(docRef, defaultValue);
          setValue(defaultValue);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setValue(defaultValue);
      }
      setLoading(false);
    };

    fetchData();
  }, [collection, defaultValue]);

  const updateValue = async (newValue) => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, collection, user.uid);
    try {
      await setDoc(docRef, newValue);
      setValue(newValue);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return [value, updateValue, loading];
}