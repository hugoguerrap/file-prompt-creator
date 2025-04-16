
export interface FileItem {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  content: string;
  children?: FileItem[];
}

export interface DirectoryStructure {
  [key: string]: FileItem[];
}
