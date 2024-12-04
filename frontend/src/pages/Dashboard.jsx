import { Sidebar } from '../components/Dashboard_Components/Sidebar';
import { Header } from '../components/Dashboard_Components/Header';
import DeliverySystem from './DeliverySystem';

export function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <DeliverySystem />
        </main>
      </div>
    </div>
  );
}

