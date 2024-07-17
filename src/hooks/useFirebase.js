
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function useFirestore(collection, document, defaultValue) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, collection, document);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setValue(docSnap.data());
      } else {
        await setDoc(docRef, defaultValue);
      }
    };

    fetchData();
  }, [collection, document]);

  const updateValue = async (newValue) => {
    const docRef = doc(db, collection, document);
    await setDoc(docRef, newValue);
    setValue(newValue);
  };

  return [value, updateValue];
}