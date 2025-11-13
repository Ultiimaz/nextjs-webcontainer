'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Message, ToolCall, FileOperation } from '@/types/chat';
import { WebContainer } from '@webcontainer/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface AIChatProps {
  webcontainerInstance: WebContainer | null;
}

export function AIChat({ webcontainerInstance }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // System prompt for the AI
  const SYSTEM_PROMPT = `You are an expert Next.js developer and UI/UX designer assistant. You can help build and modify Next.js applications by creating, reading, updating, and deleting files in a Next.js project.

## DESIGN PHILOSOPHY - PRODUCTION-GRADE UI/UX

Before writing any UI code, THINK THROUGH the design approach:

**Design Thinking Process:**
1. **Analyze the requirement**: What is the purpose? Who is the user?
2. **Choose a design direction**: Modern, minimal, bold, elegant, playful?
3. **Plan the layout**: Information hierarchy, spacing, visual flow
4. **Select color palette**: Primary, secondary, accent colors with purpose
5. **Define interactions**: Hover states, transitions, micro-interactions

**Production-Grade Design Principles:**

**1. Visual Hierarchy & Layout**
- Use clear visual hierarchy with size, weight, and spacing
- Implement generous whitespace (padding, margins) - don't cram elements
- Apply grid systems for alignment and consistency
- Use max-width constraints for readability (max-w-7xl, max-w-4xl for content)
- Ensure responsive design with mobile-first approach

**2. Color & Aesthetics**
- Use purposeful color palettes with 60-30-10 rule
- Leverage Tailwind's color system: slate/zinc for neutrals, vibrant accents
- Implement proper contrast ratios for accessibility (WCAG AA minimum)
- Use gradient accents sparingly for visual interest (bg-gradient-to-r)
- Dark mode support when appropriate using Tailwind dark: variants

**3. Typography**
- Establish type scale: text-xs to text-6xl with purpose
- Use font-semibold/font-bold for hierarchy, not just size
- Implement proper line-height (leading) for readability
- Limit line length for body text (max-w-prose)
- Use font families meaningfully (system fonts for performance)

**4. Spacing & Rhythm**
- Follow consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Use padding for breathing room: p-6, p-8, p-12 for sections
- Apply gap utilities for flex/grid layouts (gap-4, gap-6, gap-8)
- Create visual rhythm through consistent spacing patterns

**5. Components & Interactions**
- Add subtle shadows for depth (shadow-sm, shadow-md, shadow-lg)
- Implement smooth transitions (transition-all duration-200)
- Use hover states for all interactive elements (hover:bg-accent)
- Add focus states for accessibility (focus:ring-2 focus:ring-offset-2)
- Consider loading states, empty states, error states

**6. Modern UI Patterns**
- Cards: rounded-lg, border, shadow-sm with proper padding
- Buttons: Clear hierarchy (primary, secondary, ghost variants)
- Forms: Proper labels, placeholders, validation states
- Navigation: Clear, accessible, with active states
- Modals/Dialogs: Proper backdrop, animations, focus trapping

**7. Glass morphism & Modern Effects (when appropriate)**
- backdrop-blur-sm with bg-white/10 for glass effects
- Subtle border-white/20 for definition
- Use sparingly for premium, modern feel

**8. Accessibility First**
- Semantic HTML elements (nav, main, section, article)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for images, aria-labels for icons
- Keyboard navigation support
- Screen reader friendly

**9. Performance & Polish**
- Optimize images with next/image
- Use CSS transforms over positional animations
- Implement lazy loading where appropriate
- Minimize layout shift
- Smooth scrolling behavior

**EXAMPLE PATTERN - Hero Section:**
Instead of:
\`\`\`tsx
<div className="text-center">
  <h1>Welcome</h1>
  <p>Description</p>
</div>
\`\`\`

Use production-grade approach:
\`\`\`tsx
<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
  <div className="max-w-5xl mx-auto px-6 py-24 text-center">
    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mb-6">
      Welcome to the Future
    </h1>
    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
      A beautifully crafted experience designed for modern web applications
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl">
        Get Started
      </button>
      <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
        Learn More
      </button>
    </div>
  </div>
</section>
\`\`\`

## DEVELOPMENT WORKFLOW

When the user asks you to build something:
1. **THINK FIRST**: Consider the design approach, layout, colors, and user experience
2. Use the available tools to explore the existing file structure
3. Create or modify files with production-grade design implemented
4. **CRITICAL**: After ANY file changes, ALWAYS call check_terminal to verify the build is successful
5. If check_terminal shows errors, analyze them and fix the issues
6. Repeat steps 4-5 until check_terminal shows "SUCCESS"
7. Only when the build is successful, inform the user that the task is complete
8. Follow Next.js best practices (App Router, TypeScript, Tailwind CSS, shadcn/ui components)
9. Explain your design decisions as you work

Available tools:
- read_file: Read file contents
- write_file: Create or update files
- delete_file: Remove files or directories
- list_files: List directory contents
- create_directory: Create new directories
- check_terminal: Check terminal for errors and build status (ALWAYS use after file changes!)

**IMPORTANT**: Never consider a task complete until check_terminal returns "SUCCESS" status. If there are errors:
1. Read the error messages from check_terminal
2. Identify the problematic file(s)
3. Fix the issues
4. Check terminal again
5. Repeat until successful

Always use relative paths from the project root (e.g., "app/page.tsx" or "src/app/page.tsx", not "/app/page.tsx").

**REMEMBER**: Every UI you create should look and feel production-ready, not like a prototype. Think about the user experience, visual appeal, and professional polish in every component you build.`;

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !webcontainerInstance) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await processAIResponse([...messages, userMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry, I encountered an unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your API configuration.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processAIResponse = async (messageHistory: Message[]) => {
    let conversationMessages = messageHistory;
    let continueLoop = true;
    let iterations = 0;
    const MAX_ITERATIONS = 10; // Prevent infinite loops

    while (continueLoop && iterations < MAX_ITERATIONS) {
      iterations++;

      // Convert messages to API format
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationMessages.map((msg) => {
          if (msg.role === 'tool') {
            return {
              role: 'tool',
              content: msg.content,
              tool_call_id: msg.toolCallId,
            };
          }
          return {
            role: msg.role,
            content: msg.content,
            ...(msg.toolCalls && { tool_calls: msg.toolCalls }),
          };
        }),
      ];

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        // Handle error gracefully and continue conversation
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I encountered an error (${response.status}): ${errorData.error || 'Failed to get AI response'}. Please check your OpenRouter API key configuration or try again.`,
          timestamp: Date.now(),
        };
        conversationMessages = [...conversationMessages, errorMessage];
        setMessages(conversationMessages);
        continueLoop = false;
        continue;
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message;

      // Handle missing response data
      if (!assistantMessage) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'I received an invalid response from the API. Please try again.',
          timestamp: Date.now(),
        };
        conversationMessages = [...conversationMessages, errorMessage];
        setMessages(conversationMessages);
        continueLoop = false;
        continue;
      }

      // Create assistant message
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: assistantMessage.content || '',
        toolCalls: assistantMessage.tool_calls,
        timestamp: Date.now(),
      };

      conversationMessages = [...conversationMessages, newMessage];
      setMessages(conversationMessages);

      // Check if there are tool calls to execute
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        // Execute all tool calls
        for (const toolCall of assistantMessage.tool_calls) {
          const result = await executeToolCall(toolCall);

          const toolMessage: Message = {
            id: Date.now().toString(),
            role: 'tool',
            content: JSON.stringify(result),
            toolCallId: toolCall.id,
            timestamp: Date.now(),
          };

          conversationMessages = [...conversationMessages, toolMessage];
          setMessages(conversationMessages);
        }

        // Continue the loop to get AI response after tool execution
        continueLoop = true;
      } else {
        // No more tool calls, we're done
        continueLoop = false;
      }
    }
  };

  const executeToolCall = async (toolCall: ToolCall): Promise<FileOperation> => {
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    if (!webcontainerInstance && functionName !== 'check_terminal') {
      return {
        type: functionName as any,
        path: args.path,
        error: 'WebContainer not initialized',
      };
    }

    try {
      switch (functionName) {
        case 'read_file': {
          const content = await webcontainerInstance!.fs.readFile(args.path, 'utf-8');
          return {
            type: 'read_file',
            path: args.path,
            result: content,
          };
        }

        case 'write_file': {
          // Ensure directory exists
          const pathParts = args.path.split('/');
          if (pathParts.length > 1) {
            const dirPath = pathParts.slice(0, -1).join('/');
            try {
              await webcontainerInstance!.fs.mkdir(dirPath, { recursive: true });
            } catch (e) {
              // Directory might already exist
            }
          }

          await webcontainerInstance!.fs.writeFile(args.path, args.content);

          // Wait a bit for the dev server to recompile
          await new Promise(resolve => setTimeout(resolve, 2000));

          return {
            type: 'write_file',
            path: args.path,
            result: 'File written successfully',
          };
        }

        case 'delete_file': {
          await webcontainerInstance!.fs.rm(args.path, { recursive: true });
          return {
            type: 'delete_file',
            path: args.path,
            result: 'File deleted successfully',
          };
        }

        case 'list_files': {
          const files = await webcontainerInstance!.fs.readdir(args.path, {
            withFileTypes: true,
          });
          const fileList = files.map((file) =>
            file.isDirectory() ? `${file.name}/` : file.name
          );
          return {
            type: 'list_files',
            path: args.path,
            result: fileList,
          };
        }

        case 'create_directory': {
          await webcontainerInstance!.fs.mkdir(args.path, { recursive: true });
          return {
            type: 'create_directory',
            path: args.path,
            result: 'Directory created successfully',
          };
        }

        case 'check_terminal': {
          const terminalMonitor = (window as any).terminalMonitor;
          if (!terminalMonitor) {
            return {
              type: 'check_terminal',
              path: 'terminal',
              error: 'Terminal monitor not available',
            };
          }

          const lines = args.lines || 50;
          const recentOutput = terminalMonitor.getRecentOutput(lines);
          const hasErrors = terminalMonitor.hasErrors();
          const errors = terminalMonitor.getErrors();
          const isBuildSuccessful = terminalMonitor.isBuildSuccessful();

          return {
            type: 'check_terminal',
            path: 'terminal',
            result: JSON.stringify({
              recentOutput,
              hasErrors,
              errors: errors.slice(-10), // Last 10 error lines
              isBuildSuccessful,
              status: isBuildSuccessful ? 'SUCCESS' : hasErrors ? 'ERROR' : 'COMPILING',
            }),
          };
        }

        default:
          return {
            type: functionName as any,
            path: args.path || 'unknown',
            error: `Unknown function: ${functionName}`,
          };
      }
    } catch (error: any) {
      return {
        type: functionName as any,
        path: args.path || 'unknown',
        error: error.message || 'Unknown error',
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <p>Hi! I'm your Next.js AI assistant.</p>
                <p className="mt-2">Ask me to build components, pages, or features!</p>
              </div>
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} allMessages={messages} />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to build something..."
            className="min-h-[60px] max-h-[200px] resize-none"
            disabled={isLoading || !webcontainerInstance}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || !webcontainerInstance}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, allMessages }: { message: Message; allMessages: Message[] }) {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';

  // Find completed tool calls (those that have corresponding tool result messages)
  const completedToolCallIds = new Set(
    allMessages
      .filter((m) => m.role === 'tool' && m.toolCallId)
      .map((m) => m.toolCallId)
  );

  // Filter out completed tool calls
  const pendingToolCalls = message.toolCalls?.filter(
    (toolCall) => !completedToolCallIds.has(toolCall.id)
  );

  if (isTool) {
    const operation = JSON.parse(message.content) as FileOperation;
    return (
      <div className="flex items-start gap-2 text-sm">
        <div className="flex-shrink-0 mt-1">
          {operation.error ? (
            <XCircle className="h-4 w-4 text-destructive" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            <span className="font-medium">{operation.type}</span>
            <span className="text-muted-foreground">→ {operation.path}</span>
          </div>
          {operation.error && (
            <p className="text-destructive text-xs mt-1">{operation.error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-1 w-full',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[85%] break-words overflow-hidden',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        <div className="text-sm prose prose-sm dark:prose-invert max-w-none overflow-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // Style code blocks
              code: ({ node, inline, className, children, ...props }: any) => {
                return inline ? (
                  <code
                    className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono break-all"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    className={cn(
                      'block bg-muted p-3 rounded-md overflow-x-auto font-mono text-xs whitespace-pre-wrap break-words',
                      className
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // Style links
              a: ({ node, children, ...props }: any) => (
                <a
                  className="text-blue-500 hover:text-blue-600 underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              ),
              // Style lists
              ul: ({ node, children, ...props }: any) => (
                <ul className="list-disc list-inside space-y-1 overflow-auto" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ node, children, ...props }: any) => (
                <ol className="list-decimal list-inside space-y-1 overflow-auto" {...props}>
                  {children}
                </ol>
              ),
              // Style paragraphs
              p: ({ node, children, ...props }: any) => (
                <p className="mb-2 last:mb-0 break-words overflow-wrap-anywhere" {...props}>
                  {children}
                </p>
              ),
              // Style pre (wraps code blocks)
              pre: ({ node, children, ...props }: any) => (
                <pre className="overflow-x-auto max-w-full" {...props}>
                  {children}
                </pre>
              ),
              // Style headings
              h1: ({ node, children, ...props }: any) => (
                <h1 className="text-xl font-bold mb-2 mt-3 first:mt-0 break-words" {...props}>
                  {children}
                </h1>
              ),
              h2: ({ node, children, ...props }: any) => (
                <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0 break-words" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ node, children, ...props }: any) => (
                <h3 className="text-base font-bold mb-2 mt-2 first:mt-0 break-words" {...props}>
                  {children}
                </h3>
              ),
              // Style blockquotes
              blockquote: ({ node, children, ...props }: any) => (
                <blockquote
                  className="border-l-4 border-muted-foreground/30 pl-3 italic my-2 break-words overflow-auto"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              // Style tables
              table: ({ node, children, ...props }: any) => (
                <div className="overflow-x-auto max-w-full">
                  <table className="min-w-full divide-y divide-border" {...props}>
                    {children}
                  </table>
                </div>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>

      {pendingToolCalls && pendingToolCalls.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-1 ml-2">
          {pendingToolCalls.map((toolCall) => {
            const args = JSON.parse(toolCall.function.arguments);
            return (
              <div key={toolCall.id} className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>
                  {toolCall.function.name} → {args.path}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
