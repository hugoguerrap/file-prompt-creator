import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clipboard, History, Download, FileText, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { estimateTokenCount } from "@/lib/tokenizer";

interface PromptEditorProps {
  prompt: string;
  onCopy: () => void;
}

const PromptEditor = ({ prompt, onCopy }: PromptEditorProps) => {
  const [activeTab, setActiveTab] = useState("editor");
  const [history, setHistory] = useState<{timestamp: Date, prompt: string, tokens: number}[]>([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate token count whenever prompt changes
  useEffect(() => {
    const calculateTokens = async () => {
      if (!prompt) {
        setTokenCount(0);
        return;
      }
      
      setIsCalculating(true);
      try {
        const count = await estimateTokenCount(prompt);
        setTokenCount(count);
      } catch (error) {
        console.error("Error estimating tokens:", error);
      } finally {
        setIsCalculating(false);
      }
    };
    
    calculateTokens();
  }, [prompt]);

  const handleDownload = () => {
    if (!prompt.trim()) return;
    
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col shadow-md">
      <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <FileText className="mr-2 text-blue-500" size={18} />
          Prompt Final
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-3 flex items-center">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Zap size={12} className={isCalculating ? "animate-pulse text-amber-500" : "text-blue-500"} />
                    {isCalculating ? 'Calculando...' : `${tokenCount} tokens`}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimación de tokens según modelos GPT</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[250px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" className="flex items-center gap-1">
              <FileText size={14} />
              Editor
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History size={14} />
              Historial
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} className="flex-1 flex flex-col">
          <TabsContent value="editor" className="flex-1 flex flex-col m-0 p-0">
            <ScrollArea className="flex-1">
              <div className="p-4">
                <textarea
                  className="w-full h-full min-h-[calc(100vh-20rem)] p-4 border rounded-md bg-slate-50 dark:bg-slate-700 dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={prompt}
                  readOnly
                  placeholder="El prompt generado aparecerá aquí..."
                />
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="history" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full">
              {history.length > 0 ? (
                <div className="space-y-2 p-4">
                  {history.map((item, i) => (
                    <Card 
                      key={i}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                    >
                      <CardContent className="p-0">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                          <span className="flex items-center gap-1">
                            <History size={12} />
                            {item.timestamp.toLocaleTimeString()}
                          </span>
                          <Badge variant="outline" size="sm" className="flex items-center gap-1">
                            <Zap size={12} className="text-blue-500" />
                            {item.tokens} tokens
                          </Badge>
                        </div>
                        <div className="text-sm whitespace-pre-wrap truncate max-h-20 overflow-hidden">
                          {item.prompt.slice(0, 100)}
                          {item.prompt.length > 100 ? '...' : ''}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <div className="text-center">
                    <History className="mx-auto mb-2" size={24} />
                    <p>No hay historial de prompts</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div 
          className={cn(
            "p-4 border-t dark:border-slate-700 flex justify-between",
            activeTab !== "editor" && "hidden"
          )}
        >
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={!prompt.trim()}
              className="flex items-center"
            >
              <Download size={16} className="mr-2" />
              Descargar
            </Button>
          </div>
          <Button 
            variant="secondary"
            onClick={onCopy}
            disabled={!prompt.trim()}
            className="flex items-center"
          >
            <Clipboard size={16} className="mr-2" />
            Copiar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PromptEditor;
