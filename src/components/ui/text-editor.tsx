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
          <div className='border rounded p-4 prose'>
            <ReactMarkdown>{entry}</ReactMarkdown>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};
