
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const Jokes = () => {
  const [jokes, setJokes] = useState({});
  const [showJokes, setShowJokes] = useState(true);
  const navigate = useNavigate();

  const URL = "https://official-joke-api.appspot.com/random_joke";

  const fetchRandomJokes = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    setJokes(data);
    setShowJokes(true);
  };

  useEffect(() => {
    fetchRandomJokes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md text-center border border-white/20"
      >
        <h1 className="text-3xl font-semibold mb-6">😂 Random Joke Generator</h1>

        <motion.p
          key={jokes.setup}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg mb-6 text-yellow-100"
        >
          <span className="font-medium text-white"></span> {jokes.setup}
        </motion.p>

        {showJokes ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowJokes(false)}
            className="px-6 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition cursor-pointer"
          >
            Reveal
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="mt-6 text-2xl font-bold text-green-300">
            {jokes.punchline}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowJokes(true)}
              className="mt-4 px-6 py-2 rounded-full bg-pink-400 text-white font-semibold hover:bg-pink-300 transition cursor-pointer"
            >
              Hide Punchline
            </motion.button>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchRandomJokes()}
          className="mt-8 px-6 py-2 rounded-full bg-blue-500 font-semibold hover:bg-blue-400 transition cursor-pointer"
        >
          Next Joke
        </motion.button>
      </motion.div>
       <motion.button
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-2 rounded-full bg-blue-500 font-semibold hover:bg-blue-400 transition cursor-pointer"
        >
          Back
        </motion.button>
    </div>
  );
};

export default Jokes;
