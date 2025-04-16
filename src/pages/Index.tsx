import { useState, useEffect } from "react";
import FileSelector from "@/components/FileSelector";
import PromptEditor from "@/components/PromptEditor";
import Header from "@/components/Header";
import { FileItem } from "@/types/files";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, Code, Wand2 } from "lucide-react";
import { estimateTokenCount } from "@/lib/tokenizer";

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [finalPrompt, setFinalPrompt] = useState<string>("");
  const [taskInstruction, setTaskInstruction] = useState<string>("");
  const [totalTokens, setTotalTokens] = useState<number>(0);

  const handleFileSelect = (files: FileItem[]) => {
    setSelectedFiles(files);
    generatePrompt(files, taskInstruction);
  };

  const handleTaskInstructionChange = (instruction: string) => {
    setTaskInstruction(instruction);
    generatePrompt(selectedFiles, instruction);
  };

  const generatePrompt = (files: FileItem[], instruction: string) => {
    if (files.length === 0 && !instruction.trim()) {
      setFinalPrompt("");
      return;
    }
    
    let generatedPrompt = instruction ? `${instruction}\n\n` : "";
    
    files.forEach((file, index) => {
      generatedPrompt += `### ${index + 1}. ${file.name}\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
    });

    setFinalPrompt(generatedPrompt);
  };

  useEffect(() => {
    // Actualizar el conteo total de tokens cuando cambie el prompt final
    const updateTotalTokens = async () => {
      if (finalPrompt) {
        try {
          const tokens = await estimateTokenCount(finalPrompt);
          setTotalTokens(tokens);
        } catch (error) {
          console.error("Error estimating total tokens:", error);
        }
      } else {
        setTotalTokens(0);
      }
    };
    
    updateTotalTokens();
  }, [finalPrompt]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalPrompt);
    toast.success("Prompt copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="space-y-6 overflow-auto">
            <Card className="shadow-md">
              <CardHeader className="pb-3 border-b dark:border-slate-700">
                <CardTitle className="flex items-center">
                  <Code className="mr-2 text-blue-500" size={18} />
                  Instrucciones
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Textarea
                  className="min-h-[120px] font-medium"
                  placeholder="Escribe aquí tus instrucciones para la tarea. Por ejemplo: 
- Crear una función para calcular precios
- Refactorizar el código para mejor rendimiento
- Crear una API REST para gestión de usuarios"
                  value={taskInstruction}
                  onChange={(e) => handleTaskInstructionChange(e.target.value)}
                />
              </CardContent>
            </Card>

            <FileSelector 
              selectedFiles={selectedFiles} 
              onFilesSelected={handleFileSelect} 
            />
          </div>
          
          <div className="h-full">
            <PromptEditor 
              prompt={finalPrompt} 
              onCopy={copyToClipboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
