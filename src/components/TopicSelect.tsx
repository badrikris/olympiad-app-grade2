'use client';

interface BookData {
  subjects: Array<{
    id: string;
    title: string;
    topics: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  }>;
}

interface TopicSelectProps {
  bookData: BookData;
  onSelectTopic: (subjectId: string, topicId: string) => void;
}

export default function TopicSelect({ bookData, onSelectTopic }: TopicSelectProps) {
  const handleClick = (subjectId: string, topicId: string) => {
    onSelectTopic(subjectId, topicId);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            🎓 Learn Science!
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            Ready for today's challenge?
          </p>
        </div>

        {/* Topics Grid */}
        {bookData.subjects.map((subject) => (
          <div key={subject.id}>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{subject.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {subject.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleClick(subject.id, topic.id)}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-300"
                >
                  {/* Card background animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="text-7xl mb-4 block text-center">{topic.icon}</div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                      {topic.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Start Button */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                      <span className="text-sm font-semibold text-purple-600">Let's go!</span>
                      <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
