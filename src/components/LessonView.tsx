'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  hook: string;
  explanation: string;
  content: string;
  examples: Array<{
    title: string;
    description: string;
    [key: string]: any;
  }>;
}

interface Topic {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface BookData {
  subjects: Array<{
    topics: Array<Topic>;
  }>;
}

interface LessonViewProps {
  bookData: BookData;
  subjectId: string;
  topicId: string;
  lessonIndex: number;
  onNext: () => void;
  onHome: () => void;
}

export default function LessonView({
  bookData,
  subjectId,
  topicId,
  lessonIndex,
  onNext,
  onHome,
}: LessonViewProps) {
  const [expandedExample, setExpandedExample] = useState<number | null>(null);

  const topic = bookData.subjects[0].topics.find(t => t.id === topicId);
  const lesson = topic?.lessons[lessonIndex];
  const totalLessons = topic?.lessons.length || 0;

  if (!lesson) return <div>Loading...</div>;

  const isLastLesson = lessonIndex === totalLessons - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={onHome}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-semibold"
          >
            <ChevronLeft size={24} /> Home
          </button>
          <div className="text-sm font-semibold text-gray-600">
            Lesson {lessonIndex + 1} of {totalLessons}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
          />
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          {/* Lesson title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {lesson.title}
          </h1>

          {/* Hook - The interesting part */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8 border-2 border-blue-300">
            <p className="text-2xl font-bold text-blue-900">{lesson.hook}</p>
          </div>

          {/* Explanation */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Let's Learn</h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {lesson.explanation}
            </p>
          </div>

          {/* Content section */}
          <div className="mb-8">
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-600">
              {lesson.content}
            </div>
          </div>

          {/* Examples */}
          {lesson.examples.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Examples</h2>
              <div className="space-y-4">
                {lesson.examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setExpandedExample(expandedExample === idx ? null : idx)}
                    className="w-full text-left bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-300 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {example.title}
                        </h3>
                        {expandedExample !== idx && (
                          <p className="text-gray-600 mt-2">{example.description}</p>
                        )}
                      </div>
                      <span className={`text-2xl transition-transform ${expandedExample === idx ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>

                    {expandedExample === idx && (
                      <div className="mt-4 pt-4 border-t-2 border-purple-300">
                        <p className="text-gray-700">{example.description}</p>
                        {example.visual && (
                          <p className="text-gray-600 mt-2 italic">{example.visual}</p>
                        )}
                        {example.food_example && (
                          <p className="text-gray-700 mt-2 font-semibold">{example.food_example}</p>
                        )}
                        {example.items && (
                          <ul className="mt-2 space-y-1">
                            {example.items.map((item: string, i: number) => (
                              <li key={i} className="text-gray-700">• {item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick practice section */}
        <div className="bg-green-50 rounded-3xl p-8 mb-8 border-2 border-green-300">
          <h3 className="text-2xl font-bold text-green-900 mb-3">✨ Great job!</h3>
          <p className="text-lg text-green-900">
            You've learned about {lesson.title.toLowerCase()}!
          </p>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xl py-6 px-8 rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 mb-4"
        >
          {isLastLesson ? '🎯 Ready for Quiz!' : '➡️ Next Lesson'}
        </button>

        {/* Back button for lessons page */}
        {lessonIndex > 0 && (
          <button
            onClick={() => {
              // Would need to handle going back in the parent
              window.location.reload(); // Quick workaround for demo
            }}
            className="w-full bg-gray-200 text-gray-800 font-bold text-lg py-4 px-8 rounded-2xl hover:bg-gray-300 transition-colors"
          >
            ← Go Back
          </button>
        )}
      </div>
    </div>
  );
}
