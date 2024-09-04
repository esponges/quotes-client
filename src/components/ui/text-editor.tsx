'use client';

import React, { useState, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';

type TextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
};

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded text-gray-800 ${className}`}
  />
);

type TabProps = {
  label: string;
  children: ReactNode;
};

const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;

type TabsProps = {
  children: React.ReactElement<TabProps>[];
};

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>(children[0].props.label);

  return (
    <div>
      <div className='flex border-b mb-4'>
        {children.map((child) => (
          <button
            key={child.props.label}
            className={`py-2 px-4 ${
              activeTab === child.props.label
                ? 'border-b-2 border-blue-500'
                : ''
            }`}
            onClick={() => setActiveTab(child.props.label)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      {children.find((child) => child.props.label === activeTab)}
    </div>
  );
};

export const TextEditor: React.FC = () => {
  const [entry, setEntry] = useState<string>('');

  const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry(e.target.value);
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Markdown Diary</h1>
      <Tabs>
        <Tab label='Write'>
          <Textarea
            value={entry}
            onChange={handleEntryChange}
            placeholder='Write your diary entry here using Markdown...'
            className='h-64'
          />
        </Tab>
        <Tab label='Preview'>
          <div className='border rounded p-4 markdown-preview'>
            <ReactMarkdown>{entry}</ReactMarkdown>
          </div>
        </Tab>
      </Tabs>
      <style jsx global>{`
        .markdown-preview h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .markdown-preview h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .markdown-preview h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .markdown-preview h4 {
          font-size: 1em;
          font-weight: bold;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }
        .markdown-preview h5 {
          font-size: 0.83em;
          font-weight: bold;
          margin-top: 1.67em;
          margin-bottom: 1.67em;
        }
        .markdown-preview h6 {
          font-size: 0.67em;
          font-weight: bold;
          margin-top: 2.33em;
          margin-bottom: 2.33em;
        }
        .markdown-preview p {
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .markdown-preview ul,
        .markdown-preview ol {
          padding-left: 2em;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .markdown-preview blockquote {
          border-left: 4px solid #ccc;
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
        }
        .markdown-preview pre {
          background-color: #f4f4f4;
          padding: 1em;
          border-radius: 4px;
          overflow-x: auto;
        }
        .markdown-preview code {
          background-color: #f4f4f4;
          padding: 0.2em 0.4em;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};
