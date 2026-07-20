import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import LandingPage from '@/features/landing/LandingPage'
import LoginPage from '@/features/auth/components/LoginPage'
import RegisterPage from '@/features/auth/components/RegisterPage'
import AppLayout from '@/shared/components/AppLayout'
import AuthGuard from '@/features/auth/components/AuthGuard'
import DashboardPage from '@/features/dashboard/DashboardPage'
import ProjectsPage from '@/features/projects/ProjectsPage'
import TasksPage from '@/features/tasks/TasksPage'
import IssuesPage from '@/features/issues/IssuesPage'
import PlannerPage from '@/features/planner/PlannerPage'
import NotesPage from '@/features/notes/NotesPage'
import ActivityPage from '@/features/activity/ActivityPage'
import AnalyticsPage from '@/features/analytics/AnalyticsPage'
import AIAssistantPage from '@/features/ai/AIAssistantPage'
import GitHubPage from '@/features/github/GitHubPage'
import ResumePage from '@/features/resume/ResumePage'
import PortfolioPage from '@/features/portfolio/PortfolioPage'
import SnippetPage from '@/features/snippets/SnippetPage'
import SettingsPage from '@/features/settings/SettingsPage'

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
        path: 'issues',
        element: <IssuesPage />,
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
      {
        path: 'github',
        element: <GitHubPage />,
      },
      {
        path: 'resume',
        element: <ResumePage />,
      },
      {
        path: 'portfolio',
        element: <PortfolioPage />,
      },
      {
        path: 'snippets',
        element: <SnippetPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
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
