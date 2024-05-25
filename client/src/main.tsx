import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { ManagerPage } from './pages/ManagerPage';
import { UserPage } from './pages/UserPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<UserPage />} />
        <Route path="manager" element={<ManagerPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
