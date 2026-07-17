import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import LandingPage from '@/features/landing/LandingPage'
import LoginPage from '@/features/auth/components/LoginPage'
import RegisterPage from '@/features/auth/components/RegisterPage'
import AppLayout from '@/shared/components/AppLayout'
import AuthGuard from '@/features/auth/components/AuthGuard'
import DashboardPage from '@/features/dashboard/DashboardPage'
import ProjectsPage from '@/features/projects/ProjectsPage'
import TasksPage from '@/features/tasks/TasksPage'
import PlannerPage from '@/features/planner/PlannerPage'
import NotesPage from '@/features/notes/NotesPage'
import ActivityPage from '@/features/activity/ActivityPage'
import AnalyticsPage from '@/features/analytics/AnalyticsPage'
import AIAssistantPage from '@/features/ai/AIAssistantPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'planner',
        element: <PlannerPage />,
      },
      {
        path: 'notes',
        element: <NotesPage />,
      },
      {
        path: 'activity',
        element: <ActivityPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'ai',
        element: <AIAssistantPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
