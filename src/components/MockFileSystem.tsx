
import { FileItem } from "@/types/files";

export const mockFileSystem: FileItem[] = [
  {
    id: "1",
    name: "src",
    path: "/src",
    isDirectory: true,
    content: "",
    children: [
      {
        id: "2",
        name: "components",
        path: "/src/components",
        isDirectory: true,
        content: "",
        children: [
          {
            id: "3",
            name: "Button.tsx",
            path: "/src/components/Button.tsx",
            isDirectory: false,
            content: "import React from 'react';\n\ninterface ButtonProps {\n  children: React.ReactNode;\n  variant?: 'primary' | 'secondary' | 'danger';\n  size?: 'sm' | 'md' | 'lg';\n  onClick?: () => void;\n}\n\nconst Button: React.FC<ButtonProps> = ({\n  children,\n  variant = 'primary',\n  size = 'md',\n  onClick,\n}) => {\n  return (\n    <button\n      className={`btn btn-${variant} btn-${size}`}\n      onClick={onClick}\n    >\n      {children}\n    </button>\n  );\n};\n\nexport default Button;"
          },
          {
            id: "4",
            name: "Header.tsx",
            path: "/src/components/Header.tsx",
            isDirectory: false,
            content: "import React from 'react';\nimport Button from './Button';\n\nconst Header: React.FC = () => {\n  return (\n    <header className=\"header\">\n      <div className=\"logo\">MyApp</div>\n      <nav>\n        <ul>\n          <li><a href=\"/\">Home</a></li>\n          <li><a href=\"/about\">About</a></li>\n          <li><a href=\"/contact\">Contact</a></li>\n        </ul>\n      </nav>\n      <Button size=\"sm\">Login</Button>\n    </header>\n  );\n};\n\nexport default Header;"
          }
        ]
      },
      {
        id: "5",
        name: "pages",
        path: "/src/pages",
        isDirectory: true,
        content: "",
        children: [
          {
            id: "6",
            name: "Home.tsx",
            path: "/src/pages/Home.tsx",
            isDirectory: false,
            content: "import React from 'react';\nimport Header from '../components/Header';\n\nconst Home: React.FC = () => {\n  return (\n    <div className=\"page\">\n      <Header />\n      <main>\n        <h1>Welcome to MyApp</h1>\n        <p>This is the home page of our application.</p>\n      </main>\n    </div>\n  );\n};\n\nexport default Home;"
          },
          {
            id: "7",
            name: "About.tsx",
            path: "/src/pages/About.tsx",
            isDirectory: false,
            content: "import React from 'react';\nimport Header from '../components/Header';\n\nconst About: React.FC = () => {\n  return (\n    <div className=\"page\">\n      <Header />\n      <main>\n        <h1>About Us</h1>\n        <p>Learn more about our company and what we do.</p>\n      </main>\n    </div>\n  );\n};\n\nexport default About;"
          }
        ]
      },
      {
        id: "8",
        name: "App.tsx",
        path: "/src/App.tsx",
        isDirectory: false,
        content: "import React from 'react';\nimport Home from './pages/Home';\nimport './App.css';\n\nconst App: React.FC = () => {\n  return (\n    <div className=\"app\">\n      <Home />\n    </div>\n  );\n};\n\nexport default App;"
      },
      {
        id: "9",
        name: "index.tsx",
        path: "/src/index.tsx",
        isDirectory: false,
        content: "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);"
      }
    ]
  },
  {
    id: "10",
    name: "public",
    path: "/public",
    isDirectory: true,
    content: "",
    children: [
      {
        id: "11",
        name: "index.html",
        path: "/public/index.html",
        isDirectory: false,
        content: "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>MyApp</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/index.tsx\"></script>\n  </body>\n</html>"
      },
      {
        id: "12",
        name: "favicon.ico",
        path: "/public/favicon.ico",
        isDirectory: false,
        content: "[Binary content not displayed]"
      }
    ]
  },
  {
    id: "13",
    name: "package.json",
    path: "/package.json",
    isDirectory: false,
    content: "{\n  \"name\": \"my-app\",\n  \"version\": \"1.0.0\",\n  \"private\": true,\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",\n    \"react-dom\": \"^18.2.0\",\n    \"react-scripts\": \"5.0.1\",\n    \"typescript\": \"^4.9.5\"\n  },\n  \"scripts\": {\n    \"start\": \"react-scripts start\",\n    \"build\": \"react-scripts build\",\n    \"test\": \"react-scripts test\",\n    \"eject\": \"react-scripts eject\"\n  }\n}"
  },
  {
    id: "14",
    name: "tsconfig.json",
    path: "/tsconfig.json",
    isDirectory: false,
    content: "{\n  \"compilerOptions\": {\n    \"target\": \"es5\",\n    \"lib\": [\n      \"dom\",\n      \"dom.iterable\",\n      \"esnext\"\n    ],\n    \"allowJs\": true,\n    \"skipLibCheck\": true,\n    \"esModuleInterop\": true,\n    \"allowSyntheticDefaultImports\": true,\n    \"strict\": true,\n    \"forceConsistentCasingInFileNames\": true,\n    \"noFallthroughCasesInSwitch\": true,\n    \"module\": \"esnext\",\n    \"moduleResolution\": \"node\",\n    \"resolveJsonModule\": true,\n    \"isolatedModules\": true,\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\"\n  },\n  \"include\": [\n    \"src\"\n  ]\n}"
  }
];

export default mockFileSystem;
