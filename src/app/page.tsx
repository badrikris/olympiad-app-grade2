'use client';

import { useState, useEffect } from 'react';
import TopicSelect from '@/components/TopicSelect';
import LessonView from '@/components/LessonView';
import QuizView from '@/components/QuizView';
import CelebrationScreen from '@/components/CelebrationScreen';

type AppState = 'home' | 'lesson' | 'quiz' | 'celebration';

interface BookData {
  subjects: Array<{
    id: string;
    title: string;
    topics: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      lessons: Array<{
        id: string;
        title: string;
      }>;
      questions: Array<any>;
    }>;
  }>;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('home');
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const loadBook = async () => {
      const res = await fetch('/data/book.json');
      const data = await res.json();
      setBookData(data);
    };
    loadBook();
  }, []);

  const handleTopicSelect = (subjectId: string, topicId: string) => {
    setSelectedSubject(subjectId);
    setSelectedTopic(topicId);
    setCurrentLessonIndex(0);
    setAppState('lesson');
  };

  const handleLessonComplete = () => {
    const topic = bookData?.subjects
      .find(s => s.id === selectedSubject)?.topics
      .find(t => t.id === selectedTopic);

    if (topic) {
      setTotalQuestions(topic.questions.length);
      setAppState('quiz');
    }
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setAppState('celebration');
  };

  const handleRetry = () => {
    setCurrentLessonIndex(0);
    setAppState('lesson');
  };

  const handleHome = () => {
    setAppState('home');
    setSelectedSubject('');
    setSelectedTopic('');
    setCurrentLessonIndex(0);
  };

  if (!bookData) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {appState === 'home' && <TopicSelect bookData={bookData} onSelectTopic={handleTopicSelect} />}
      {appState === 'lesson' && (
        <LessonView
          bookData={bookData}
          subjectId={selectedSubject}
          topicId={selectedTopic}
          lessonIndex={currentLessonIndex}
          onNext={() => {
            const topic = bookData.subjects
              .find(s => s.id === selectedSubject)?.topics
              .find(t => t.id === selectedTopic);

            if (topic && currentLessonIndex < topic.lessons.length - 1) {
              setCurrentLessonIndex(currentLessonIndex + 1);
            } else {
              handleLessonComplete();
            }
          }}
          onHome={handleHome}
        />
      )}
      {appState === 'quiz' && (
        <QuizView
          bookData={bookData}
          subjectId={selectedSubject}
          topicId={selectedTopic}
          onComplete={handleQuizComplete}
          onHome={handleHome}
        />
      )}
      {appState === 'celebration' && (
        <CelebrationScreen
          score={quizScore}
          totalQuestions={totalQuestions}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
