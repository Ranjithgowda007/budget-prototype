import { Layout } from '@/components/layout/Layout';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';

export default function Home() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Welcome to the budget portal. Please select a section from the sidebar to begin.</p>
      </div>

      <DashboardGrid />
    </Layout>
  );
}
