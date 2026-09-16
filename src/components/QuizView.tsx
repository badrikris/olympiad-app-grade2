'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Clock } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
}

interface BookData {
  subjects: Array<{
    topics: Array<{
      id: string;
      questions: Question[];
    }>;
  }>;
}

interface QuizViewProps {
  bookData: BookData;
  subjectId: string;
  topicId: string;
  onComplete: (score: number) => void;
  onHome: () => void;
}

export default function QuizView({
  bookData,
  subjectId,
  topicId,
  onComplete,
  onHome,
}: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<Array<{ questionId: string; answer: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes for 8 questions

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const topic = bookData.subjects[0].topics.find(t => t.id === topicId);
  const questions = topic?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = Math.min(questions.length, 8); // Show max 8 questions

  if (!currentQuestion) return <div>Loading...</div>;

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSelectAnswer = (index: number) => {
    if (!showFeedback) {
      setSelectedAnswer(index);
      setShowFeedback(true);

      if (index === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }

      setAnswers([...answers, { questionId: currentQuestion.id, answer: index }]);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onComplete(score + (isCorrect ? 1 : 0));
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'think':
        return 'bg-blue-100 text-blue-700';
      case 'challenge':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={onHome}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-semibold"
          >
            <ChevronLeft size={24} /> Home
          </button>

          {/* Timer */}
          <div className={`flex items-center gap-2 text-lg font-bold px-4 py-2 rounded-full ${
            timeLeft > 60 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
          }`}>
            <Clock size={20} />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>

          <div className="text-sm font-semibold text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Score display */}
        <div className="text-center mb-8">
          <p className="text-gray-700 font-semibold">
            Current Score: <span className="text-2xl font-bold text-purple-600">{score}</span>
          </p>
        </div>

        {/* Main quiz card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          {/* Difficulty badge */}
          <div className="mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty === 'easy' ? '⭐ Easy' : currentQuestion.difficulty === 'think' ? '⭐⭐ Think' : '⭐⭐⭐ Challenge'}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showFeedback}
                className={`w-full p-6 rounded-2xl text-lg font-bold transition-all transform text-left ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white scale-105 shadow-lg'
                      : 'bg-gradient-to-r from-red-400 to-red-500 text-white scale-105 shadow-lg'
                    : showFeedback && index === currentQuestion.correctAnswer
                    ? 'bg-gradient-to-r from-green-300 to-green-400 text-white border-4 border-green-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-purple-100 cursor-pointer border-2 border-gray-300 hover:border-purple-400'
                } ${showFeedback && selectedAnswer !== index ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 bg-white/30 rounded-full font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback section */}
          {showFeedback && (
            <div className={`rounded-2xl p-6 mb-8 ${isCorrect ? 'bg-green-50 border-2 border-green-400' : 'bg-orange-50 border-2 border-orange-400'}`}>
              <div className="flex items-start gap-4">
                <span className="text-4xl">
                  {isCorrect ? '🎉' : '💭'}
                </span>
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                    {isCorrect ? 'Awesome! 🌟' : 'Good try! 💪'}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hint button */}
          {!showFeedback && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full bg-yellow-100 text-yellow-900 font-bold py-4 px-6 rounded-xl hover:bg-yellow-200 transition-colors mb-8 border-2 border-yellow-400"
            >
              💡 {showHint ? 'Hide Hint' : 'Give me a hint'}
            </button>
          )}

          {/* Hint display */}
          {showHint && !showFeedback && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
              <p className="text-yellow-900 text-lg font-semibold">{currentQuestion.hint}</p>
            </div>
          )}
        </div>

        {/* Next button */}
        {showFeedback && (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xl py-6 px-8 rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            {isLastQuestion ? '✨ See My Score!' : '➡️ Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
