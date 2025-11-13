"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { files } from '@/components/container/files'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Play, TerminalIcon, Sun, Moon, Github, Twitter, Files, Monitor } from 'lucide-react'
import { motion } from 'framer-motion'
import { WebContainerLoader } from '@/components/container/loader'
import dynamic from 'next/dynamic'
import { WebContainer } from '@webcontainer/api'
import { FileExplorer } from './file-explorer'
import { AIChat } from '@/components/chat/ai-chat'

const DynamicWebContainer = dynamic(() => import('./dynamic-web-container'), { ssr: false })

type LoadingState = 'booting' | 'installing' | 'starting' | 'compiling' | 'ready' | 'error';

export default function Container() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [loadingState, setLoadingState] = useState<LoadingState>('booting');
  const [webcontainerInstance, setWebcontainerInstance] = useState<WebContainer | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('app/[[...slug]]/page.tsx');
  const hasBooted = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeEnvironment = async () => {
      if (hasBooted.current) return
      hasBooted.current = true

      if (!textareaRef.current || !iframeRef.current || !terminalRef.current) return

      // Load the BlocksWeb dynamic page component as the default file
      const dynamicPageContent = (files as any)?.app?.directory?.['[[...slug]]']?.directory?.['page.tsx']?.file?.contents;
      if (dynamicPageContent && textareaRef.current) {
        textareaRef.current.value = dynamicPageContent;
      }
      }

    initializeEnvironment()
  }, [])


  const handleFileSelect = useCallback(async (path: string) => {
    if (webcontainerInstance && textareaRef.current) {
      const contents = await webcontainerInstance.fs.readFile(path, 'utf-8');
      textareaRef.current.value = contents;
      setSelectedFile(path);
      console.log(path);
    }
  }, [webcontainerInstance]);

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 flex w-full justify-between items-center transition-colors duration-300`}>
        <h1 className="text-2xl font-bold">
          NextJS WebContainer Example
        </h1>
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open('https://x.com/KevIsDev', '_blank')}
              className={` hover:text-blue-600 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              <Twitter size={18} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={` hover:text-blue-600 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              <Github size={18} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col p-4 space-y-4">
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg overflow-hidden">
          {/* AI Chat Panel - Full Height */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
            <AIChat webcontainerInstance={webcontainerInstance} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* Tabbed Panel - Files or Preview */}
          <ResizablePanel defaultSize={80} minSize={50}>
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} px-4 pt-3 pb-1`}>
                <TabsList className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Monitor size={16} />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="files" className="flex items-center gap-2">
                    <Files size={16} />
                    Files
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Preview Tab Content */}
              <TabsContent value="preview" className="flex-1 m-0 h-full" forceMount>
                <ResizablePanelGroup direction="vertical" className="h-full data-[state=inactive]:hidden">
                  {/* Preview Panel */}
                  <ResizablePanel defaultSize={60} minSize={30}>
                    <motion.div
                      className={`h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden transition-colors duration-300 relative`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <iframe ref={iframeRef} className="w-full h-full" />
                      {loadingState !== 'ready' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-inherit z-10">
                          <WebContainerLoader state={loadingState} />
                        </div>
                      )}
                    </motion.div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  {/* Terminal Panel */}
                  <ResizablePanel defaultSize={40} minSize={20}>
                    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-colors duration-300`}>
                      <div
                        className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-2 flex justify-between items-center transition-colors duration-300`}
                      >
                        <span className="flex items-center"><TerminalIcon size={18} className="mr-2" /> Terminal</span>
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <div ref={terminalRef} className="h-full w-full"></div>
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </TabsContent>

              {/* Files Tab Content */}
              <TabsContent value="files" className="flex-1 m-0 h-full data-[state=inactive]:hidden" forceMount>
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {/* File Explorer */}
                  <ResizablePanel defaultSize={30} minSize={20}>
                    {webcontainerInstance && (
                      <FileExplorer
                        isDarkMode={isDarkMode}
                        webcontainerInstance={webcontainerInstance}
                        onFileSelect={handleFileSelect}
                      />
                    )}
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  {/* Editor */}
                  <ResizablePanel defaultSize={70} minSize={40}>
                    <motion.div
                      className={`h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden transition-colors duration-300`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-2 flex justify-between items-center transition-colors duration-300`}>
                        <span className="flex items-center"><Code size={18} className="mr-2" /> Editor</span>
                      </div>
                      <Textarea
                        ref={textareaRef}
                        className={`w-full h-[calc(100%-40px)] rounded-none p-4 border-none font-mono text-sm resize-none focus:outline-none ${
                          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
                        } transition-colors duration-300`}
                      />
                    </motion.div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <DynamicWebContainer
        textareaRef={textareaRef}
        iframeRef={iframeRef}
        terminalRef={terminalRef}
        isDarkMode={isDarkMode}
        setLoadingState={setLoadingState}
        selectedFile={selectedFile}
        webcontainerInstance={webcontainerInstance}
        setWebcontainerInstance={setWebcontainerInstance}
      />
    </div>
  )
}