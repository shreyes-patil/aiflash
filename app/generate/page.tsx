'use client'

import React, { useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Flashcard {
  name: string;
  front: string;
  back: string;
}

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('api/generate', {
        method: 'POST',
        body: text,
      });
      const data = await res.json();
      setFlashcards(data);
      setFlipped(new Array(data.length).fill(false));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id: number) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name for your flashcard set');
      return;
    }
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user?.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f: Flashcard) => f.name === name)) {
        alert('Flashcard set with this name already exists');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });
    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

  useLayoutEffect(() => {
    if (!isSignedIn && isLoaded) {
      router.push('/sign-in');
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Generate Flashcards</h1>
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-32 p-2 text-gray-800 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="mt-4 bg-purple-600 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-700 transition duration-300"
          >
            Generate
          </motion.button>
        </div>

        {loading ? (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-8 h-8 border-4 border-white border-t-purple-600 rounded-full"
            />
          </div>
        ) : (
          <>
            {flashcards.length > 0 ? (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mt-8"
  >
    <h2 className="text-2xl font-bold mb-4 text-center">Your Flashcards</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer"
          onClick={() => handleCardClick(index)}
        >
          <div className="h-48 relative">
            <div
              className={`absolute inset-0 w-full h-full transition-all duration-500 ${
                flipped[index] ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="h-full flex items-center justify-center p-4 text-gray-800">
                <p className="text-xl font-semibold">{flashcard.front}</p>
              </div>
            </div>
            <div
              className={`absolute inset-0 w-full h-full transition-all duration-500 ${
                flipped[index] ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="h-full flex items-center justify-center p-4 text-gray-800 bg-purple-100">
                <p className="text-xl">{flashcard.back}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    <div className="mt-8 text-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="bg-green-500 text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition duration-300"
      >
        Save Flashcards
      </motion.button>
    </div>
  </motion.div>
) : (
  <p className="text-center text-xl mt-8">No flashcards to display</p>
)}
          </>
        )}
      </motion.div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Save Flashcards</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter flashcard set name"
              className="w-full p-2 mb-4 text-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveFlashcards}
                className="bg-purple-600 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-700 transition duration-300"
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}