import { Dashboard } from '@/components/Dashboard';

// Force dynamic rendering pour supporter les Client Components avec Context
export const dynamic = 'force-dynamic';

export default function Home() {
  return <Dashboard />;
}
