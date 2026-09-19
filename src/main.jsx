import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import Login from '../main/Login.jsx';
import Dashboard from '../main/dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);