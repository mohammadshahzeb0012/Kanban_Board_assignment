import { ToastContainer } from 'react-toastify';
import AuthPage from './feature/auth/AuthPage.jsx'
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './feature/task/ProtectedRoute.jsx';
import Home from './Home.jsx';


function App() {

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute>
     <Home />
    </ProtectedRoute>
  },
  {
    path: '/auth',
    element:   <AuthPage />
  }
])

  return (
    <>
     <Provider store={store}>
      <ToastContainer />
      <RouterProvider  router={appRouter} />
     </Provider>
    </>
  )
}

export default App
