import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { IssuesPage } from './pages/IssuesPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { CreateIssuePage } from './pages/CreateIssuePage';
import { EditIssuePage } from './pages/EditIssuePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/issues"
              element={
                <ProtectedRoute>
                  <IssuesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues/new"
              element={
                <ProtectedRoute>
                  <CreateIssuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues/:id"
              element={
                <ProtectedRoute>
                  <IssueDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues/:id/edit"
              element={
                <ProtectedRoute>
                  <EditIssuePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
