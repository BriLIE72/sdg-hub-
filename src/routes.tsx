import { lazy } from 'react';

const HomePage = lazy(() => import('./pages/index'));
const Dashboard = lazy(() => import('./pages/dashboard-simple'));
const SDGProgress = lazy(() => import('./pages/sdg-progress'));
const International = lazy(() => import('./pages/international'));
const BestPractices = lazy(() => import('./pages/best-practices'));
const PolicyLab = lazy(() => import('./pages/policy-lab'));
const MultiStakeholder = lazy(() => import('./pages/multi-stakeholder'));
const ImplementationToolkit = lazy(() => import('./pages/implementation-toolkit'));
const KnowledgeCenter = lazy(() => import('./pages/knowledge-center'));
const CitizenFeedback = lazy(() => import('./pages/citizen-feedback'));
const Collaboration = lazy(() => import('./pages/collaboration'));
const Stakeholder = lazy(() => import('./pages/stakeholder'));
const PolicyMonitoring = lazy(() => import('./pages/policy-monitoring'));
const PolicySimulation = lazy(() => import('./pages/policy-simulation'));
const CrossMinistryComparison = lazy(() => import('./pages/cross-ministry-comparison'));
const CompetitorAnalysis = lazy(() => import('./pages/competitor-analysis'));
const Workday = lazy(() => import('./pages/workday'));
const AdminDashboard = lazy(() => import('./pages/admin/index'));
const Login = lazy(() => import('./pages/login'));
const Signup = lazy(() => import('./pages/signup'));
const Auth = lazy(() => import('./pages/auth'));
const NotFound = lazy(() => import('./pages/_404'));

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/dashboard-simple', element: <Dashboard /> },
  { path: '/sdg-progress', element: <SDGProgress /> },
  { path: '/international', element: <International /> },
  { path: '/best-practices', element: <BestPractices /> },
  { path: '/policy-lab', element: <PolicyLab /> },
  { path: '/multi-stakeholder', element: <MultiStakeholder /> },
  { path: '/implementation-toolkit', element: <ImplementationToolkit /> },
  { path: '/knowledge-center', element: <KnowledgeCenter /> },
  { path: '/citizen-feedback', element: <CitizenFeedback /> },
  { path: '/collaboration', element: <Collaboration /> },
  { path: '/stakeholder', element: <Stakeholder /> },
  { path: '/policy-monitoring', element: <PolicyMonitoring /> },
  { path: '/policy-simulation', element: <PolicySimulation /> },
  { path: '/cross-ministry-comparison', element: <CrossMinistryComparison /> },
  { path: '/competitor-analysis', element: <CompetitorAnalysis /> },
  { path: '/workday', element: <Workday /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/auth', element: <Auth /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
