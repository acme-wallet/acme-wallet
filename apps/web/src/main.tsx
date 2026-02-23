import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from '@tanstack/react-router';
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router';
import './index.css';
import { router } from './router';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <NuqsAdapter>
        <RouterProvider router={router} />
      </NuqsAdapter>
    </Provider>
  </StrictMode>,
);
