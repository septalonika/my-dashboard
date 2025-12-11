import DashboardTable from "../organisms/dashboard-table";
export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black ">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-between p-16 bg-white dark:bg-black sm:items-start">
        <DashboardTable />
      </main>
    </div>
  );
}
