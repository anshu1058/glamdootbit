import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import store, { persistor } from './component/Redux/Store/Store';
import { PersistGate } from 'redux-persist/integration/react';
import i18n from './i18n';
import { ThemeProviderWrapper } from './component/header/ThemeContext.jsx';
import MinimizableWebChat from './component/chatbot/Chatbotnew/chatbot/MinimizableWebChat';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProviderWrapper> {/* Wrap the entire app with ThemeProviderWrapper */}
      <I18nextProvider i18n={i18n}>
        <Router>
          <Suspense>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <App />
                <MinimizableWebChat/>
              </PersistGate>
            </Provider>
          </Suspense>
        </Router>
      </I18nextProvider>
    </ThemeProviderWrapper>
  </React.StrictMode>
);
