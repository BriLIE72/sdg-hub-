import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import RootLayout from './layouts/RootLayout';
import routes from './routes';

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </RootLayout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
