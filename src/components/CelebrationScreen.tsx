'use client';

import { useEffect, useState } from 'react';

interface CelebrationScreenProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onHome: () => void;
}

const Confetti = () => {
  const pieces = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            animation: `fall ${2 + Math.random() * 2}s linear forwards`,
            backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)],
            opacity: 0.7,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default function CelebrationScreen({
  score,
  totalQuestions,
  onRetry,
  onHome,
}: CelebrationScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getEncouragement = () => {
    if (percentage === 100) return 'Perfect! You\'re a star! ⭐';
    if (percentage >= 80) return 'Amazing work! You\'re awesome! 🌟';
    if (percentage >= 60) return 'Great job! Keep practicing! 💪';
    if (percentage >= 40) return 'Good effort! You\'re getting there! 👍';
    return 'Nice try! Keep learning! 📚';
  };

  const getEmoji = () => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '🌈';
    if (percentage >= 40) return '🚀';
    return '💫';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {showConfetti && <Confetti />}

      <div className="max-w-2xl w-full">
        {/* Main celebration card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 text-center">
          {/* Main emoji/celebration */}
          <div className="text-9xl mb-8 animate-bounce">
            {getEmoji()}
          </div>

          {/* Congratulation message */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            {getEncouragement()}
          </h1>

          {/* Score display */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-8 mb-8 border-4 border-purple-300">
            <p className="text-gray-700 text-2xl font-bold mb-4">Your Score</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {score}
              </span>
              <span className="text-5xl text-gray-600">/</span>
              <span className="text-5xl font-bold text-gray-600">
                {totalQuestions}
              </span>
            </div>

            {/* Percentage */}
            <p className="text-3xl font-bold text-purple-600 mb-6">
              {percentage}% Correct!
            </p>

            {/* Star rating */}
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-4xl transition-all duration-300 ${
                    i < Math.ceil((percentage / 100) * 5) ? 'scale-125' : 'opacity-30'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          {/* Message based on score */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-300">
            <p className="text-lg text-gray-700">
              {percentage === 100
                ? '🎊 Perfect score! You really know your stuff!'
                : percentage >= 80
                ? '🌟 Excellent work! You\'re mastering this topic!'
                : percentage >= 60
                ? '💡 Good understanding! Review the tricky parts and try again!'
                : '📖 Keep studying! Each attempt makes you stronger!'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onRetry}
              className="bg-gradient-to-r from-green-400 to-green-500 text-white font-bold text-lg py-5 px-8 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105"
            >
              🔄 Try Again
            </button>
            <button
              onClick={onHome}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg py-5 px-8 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105"
            >
              🏠 Choose Another Topic
            </button>
          </div>
        </div>

        {/* Encouragement message */}
        <div className="text-center mt-8 text-gray-700 text-lg font-semibold">
          <p>Keep learning and having fun! 🎓</p>
        </div>
      </div>
    </div>
  );
}
