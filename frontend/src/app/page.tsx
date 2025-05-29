'use client';

import { useState } from 'react';
import { useChat, Message } from 'ai/react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [developerMessage, setDeveloperMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    messages,
    input,
    handleInputChange,
    setInput,
    append,
  } = useChat({
    api: '/api/chat',
    onError: (error: Error) => {
      setError(error.message);
      setIsLoading(false);
    },
    onFinish: () => {
      setIsLoading(false);
    },
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!apiKey) {
      setError('Please enter your OpenAI API key');
      return;
    }
    if (!input.trim()) {
      setError('Please enter a message');
      return;
    }
    setError('');
    setIsLoading(true);
    await append(
      {
        role: 'user',
        content: input,
      },
      {
        options: {
          body: {
            api_key: apiKey,
            developer_message: developerMessage,
            user_message: input,
            model: 'gpt-4.1-mini',
          },
        },
      }
    );
    setInput('');
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gray-50">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Chat Interface</h1>
          <p className="text-gray-600">Powered by GPT-4.1-mini</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                OpenAI API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 text-base"
                placeholder="Enter your OpenAI API key"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="developerMessage" className="block text-sm font-medium text-gray-700">
                Developer Message (Optional)
              </label>
              <textarea
                id="developerMessage"
                value={developerMessage}
                onChange={(e) => setDeveloperMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 text-base"
                rows={3}
                placeholder="e.g. Play the role of a cranky troll, regardless of the user's input."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            {messages.map((message: Message, i: number) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  message.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <p className="text-sm font-medium text-gray-900">
                  {message.role === 'user' ? 'You' : 'Assistant'}:
                </p>
                <p className="mt-1 text-gray-700 whitespace-pre-line">{message.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleFormSubmit} className="mt-4">
            <div className="flex space-x-4">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 text-base"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
