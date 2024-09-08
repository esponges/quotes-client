'use client';

import React, { ReactNode } from 'react';
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
  const [activeTab, setActiveTab] = React.useState<string>(children[0].props.label);

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
  const [entry, setEntry] = React.useState<string>('');
  const [workerReady, setWorkerReady] = React.useState<boolean>(false);
  const workerRef = React.useRef<Worker | null>(null);

    // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
    React.useEffect(() => {
      if (!workerRef.current) {
        console.log('Creating worker');
        // Create the worker if it does not yet exist.
        workerRef.current = new Worker(new URL('../worker/spellcheck.js', import.meta.url), {
          type: 'module'
        });
      }
  
      // Create a callback function for messages from the worker thread.
      const onMessageReceived = (e: MessageEvent) => {
        switch (e.data.status) {
          case 'initiate':
            console.log('initiate');
            setWorkerReady(false);
            break;
          case 'ready':
            console.log('ready');
            setWorkerReady(true);
            break;
          // case 'complete':
          //   setResult(e.data.output[0])
          //   break;
        }
      };
  
      // Attach the callback function as an event listener.
      workerRef.current.addEventListener('message', onMessageReceived);
      console.log('adding event listener', { workerRef });
  
      // Define a cleanup function for when the component is unmounted.
      return () => workerRef.current?.removeEventListener('message', onMessageReceived);
    }, []);

  console.log({ workerReady, workerRef });

  const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry(e.target.value);
    // TODO: initialize message differently
    workerRef.current?.postMessage({ text: e.target.value });
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
