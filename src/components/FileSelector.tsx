import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { FileItem } from "@/types/files";
import { Folder, File, ChevronRight, ChevronDown, Plus, FolderOpen, X, Upload, FolderTree, RefreshCw, Loader2, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FileSelectorProps {
  selectedFiles: FileItem[];
  onFilesSelected: (files: FileItem[]) => void;
}

const FileSelector = ({ selectedFiles, onFilesSelected }: FileSelectorProps) => {
  const [workspaceName, setWorkspaceName] = useState("Mi Proyecto");
  const [searchTerm, setSearchTerm] = useState("");
  const [fileStructure, setFileStructure] = useState<FileItem[]>([]);
  
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "/src": true,
  });
  const [isLoadingFolder, setIsLoadingFolder] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Toggle folder expansion
  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Handle file selection
  const toggleFileSelection = (file: FileItem) => {
    if (file.isDirectory) return;
    
    const isSelected = selectedFiles.some(f => f.id === file.id);
    let newSelectedFiles;
    
    if (isSelected) {
      newSelectedFiles = selectedFiles.filter(f => f.id !== file.id);
    } else {
      newSelectedFiles = [...selectedFiles, file];
    }
    
    onFilesSelected(newSelectedFiles);
  };

  // Upload individual files
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const filePromises = Array.from(files).map(file => {
      return new Promise<FileItem>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const newFile: FileItem = {
            id: `upload-${Date.now()}-${file.name}`,
            name: file.name,
            path: `/${file.name}`,
            isDirectory: false,
            content
          };
          resolve(newFile);
        };
        reader.readAsText(file);
      });
    });

    Promise.all(filePromises).then((newFiles) => {
      setFileStructure(prev => [...prev, ...newFiles]);
      toast.success(`${files.length} archivo(s) subido(s) correctamente`);
    }).catch(err => {
      toast.error("Error al subir archivos");
      console.error(err);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle folder selection from system
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoadingFolder(true);
    
    try {
      // Esta es una simulación porque el acceso real a carpetas del sistema
      // requiere permisos especiales en navegadores modernos
      const folderName = files[0].webkitRelativePath.split('/')[0] || "Carpeta importada";
      
      // Crear estructura de carpeta
      const folderStructure: FileItem = {
        id: `folder-${Date.now()}`,
        name: folderName,
        path: `/${folderName}`,
        isDirectory: true,
        content: "",
        children: []
      };
      
      // Procesar archivos dentro de la carpeta
      const filePromises = Array.from(files).map(file => {
        return new Promise<FileItem>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            const relativePath = file.webkitRelativePath;
            const pathParts = relativePath.split('/');
            pathParts.shift(); // Eliminar nombre de carpeta principal
            
            const fileName = pathParts.pop() || file.name;
            
            const newFile: FileItem = {
              id: `upload-${Date.now()}-${fileName}`,
              name: fileName,
              path: `/${folderName}/${pathParts.join('/')}/${fileName}`.replace(/\/+/g, '/'),
              isDirectory: false,
              content
            };
            resolve(newFile);
          };
          reader.readAsText(file);
        });
      });
      
      const importedFiles = await Promise.all(filePromises);
      
      // Organizar archivos en estructura de carpetas
      importedFiles.forEach(file => {
        const pathParts = file.path.split('/').filter(p => p);
        pathParts.shift(); // Eliminar el nombre de la carpeta principal
        
        let current = folderStructure.children!;
        
        // Crear subcarpetas si es necesario
        for (let i = 0; i < pathParts.length - 1; i++) {
          const pathPart = pathParts[i];
          
          let folder = current.find(item => item.name === pathPart && item.isDirectory);
          
          if (!folder) {
            folder = {
              id: `folder-${Date.now()}-${pathPart}`,
              name: pathPart,
              path: `/${folderName}/${pathParts.slice(0, i+1).join('/')}`.replace(/\/+/g, '/'),
              isDirectory: true,
              content: "",
              children: []
            };
            current.push(folder);
          }
          
          current = folder.children!;
        }
        
        // Añadir el archivo
        if (pathParts.length > 0) {
          current.push({
            ...file,
            name: pathParts[pathParts.length - 1]
          });
        }
      });
      
      // Actualizar estructura de archivos
      setFileStructure(prev => [...prev, folderStructure]);
      toast.success(`Carpeta "${folderName}" importada con ${files.length} archivos`);
      
      // Expandir la carpeta recién añadida
      setExpandedFolders(prev => ({
        ...prev,
        [`/${folderName}`]: true
      }));
      
    } catch (error) {
      console.error(error);
      toast.error("Error al importar carpeta");
    } finally {
      setIsLoadingFolder(false);
      if (folderInputRef.current) {
        folderInputRef.current.value = '';
      }
    }
  };

  // Delete file or folder
  const handleDelete = (item: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const deleteItem = (items: FileItem[]): FileItem[] => {
      return items.filter(f => {
        if (f.id === item.id) {
          // Si el archivo está seleccionado, quitarlo de la selección
          if (!f.isDirectory) {
            onFilesSelected(selectedFiles.filter(sf => sf.id !== f.id));
          }
          return false;
        }
        if (f.isDirectory && f.children) {
          f.children = deleteItem(f.children);
        }
        return true;
      });
    };
    
    setFileStructure(prev => deleteItem(prev));
    toast.success(`${item.isDirectory ? 'Carpeta' : 'Archivo'} eliminado`);
  };

  // Render a file or folder
  const renderFileOrFolder = (item: FileItem, depth = 0) => {
    const isSelected = selectedFiles.some(f => f.id === item.id);
    const isExpanded = expandedFolders[item.path];
    const paddingLeft = `${depth * 1.5}rem`;
    
    // Filter files for search
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      if (!item.isDirectory) return null;
      
      // For directories, check if any children match
      const hasMatchingChildren = item.children?.some(child => 
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (!hasMatchingChildren) return null;
    }

    return (
      <div key={item.id}>
        <div 
          className={`flex items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer group ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
          style={{ paddingLeft }}
          onClick={() => item.isDirectory ? toggleFolder(item.path) : toggleFileSelection(item)}
        >
          {item.isDirectory ? (
            <>
              <div className="mr-1 text-slate-400">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
              <div className="mr-2 text-amber-500">
                {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
              </div>
            </>
          ) : (
            <>
              <div className="w-5 h-5 flex items-center justify-center mr-1">
                <Checkbox 
                  checked={isSelected} 
                  onCheckedChange={() => toggleFileSelection(item)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="mr-2 text-blue-500">
                <File size={18} />
              </div>
            </>
          )}
          <span className="text-sm flex-1 truncate">{item.name}</span>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {!item.isDirectory && (
              <button 
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                title="Agregar al Prompt"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFileSelection(item);
                }}
              >
                {isSelected ? <X size={16} /> : <Plus size={16} />}
              </button>
            )}
            <button 
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
              title={`Eliminar ${item.isDirectory ? 'carpeta' : 'archivo'}`}
              onClick={(e) => handleDelete(item, e)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {item.isDirectory && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderFileOrFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Count files
  const countSelectedFiles = selectedFiles.length;
  const totalFiles = (function countFiles(items: FileItem[]): number {
    return items.reduce((count, item) => {
      if (item.isDirectory && item.children) {
        return count + countFiles(item.children);
      }
      return count + (item.isDirectory ? 0 : 1);
    }, 0);
  })(fileStructure);

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="border-b dark:border-slate-700 p-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center text-lg">
          <FolderTree className="text-amber-500 mr-2" size={18} />
          <div className="flex items-center space-x-2">
            <span>{workspaceName}</span>
            <Badge variant="outline" className="text-xs">
              {countSelectedFiles} / {totalFiles} archivos
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 border-b dark:border-slate-700">
          <Input
            type="text"
            placeholder="Buscar archivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {fileStructure.length > 0 ? (
              fileStructure.map(item => renderFileOrFolder(item))
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 dark:text-slate-400">
                <FileQuestion size={48} className="mb-4 text-slate-400" />
                <p className="text-center mb-2">No hay archivos ni carpetas</p>
                <p className="text-center text-sm">Usa los botones de abajo para subir archivos o importar carpetas</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t dark:border-slate-700 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Subir Archivo
          </Button>
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('folder-upload')?.click()}
            className="flex items-center"
            disabled={isLoadingFolder}
          >
            {isLoadingFolder ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <FolderOpen size={16} className="mr-2" />
            )}
            Importar Carpeta
          </Button>
          <input
            type="file"
            id="folder-upload"
            // Fix the TypeScript error by using proper attribute syntax
            // @ts-ignore - The webkitdirectory attribute is non-standard but widely supported
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={handleFolderUpload}
            ref={folderInputRef}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileSelector;
