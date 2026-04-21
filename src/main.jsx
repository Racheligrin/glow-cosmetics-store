import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux' // הייבוא החסר
import { store } from './redux/store' // הייבוא של ה-Store שיצרנו
import App from './App'
import './styles/main.scss'; // או הנתיב שבו שמרת את הקובץ
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* כאן עוטפים את כל האפליקציה ב-Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)