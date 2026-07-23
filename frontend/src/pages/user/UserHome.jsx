import { useEffect } from "react";
import { getDashboardData } from "../../services/AIService.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import DayWiseSpendChart from "../../components/user/DayWiseSpendChart.jsx";
import StatCard from "../../components/user/StatCard.jsx";
import PaymentMethodDoughnut from "../../components/user/PaymentMethodDoughnut.jsx";
import RecentTransactionsList from "../../components/user/RecentTransactionsList.jsx";
import DashboardSkeleton from "../../components/user/DashboardSkeleton.jsx";
import DailySpendBar from "../../components/user/DailySpendBar.jsx";
import {
  Wallet,
  CalendarDays,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

export default function UserHome() {
  const {
    dashboardData,
    setDashboardData,
    loadingDashboardData,
    setLoadingDashboardData,
  } = useAuthContext();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoadingDashboardData(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingDashboardData(false);
      }
    }

    loadDashboardData();
  }, [dashboardData === null]);

  if (loadingDashboardData || !dashboardData) {
    return <DashboardSkeleton />;
  }

  const data = dashboardData;
  const currency = "INR";

  const glassCard =
    "relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]";

  return (
    <div className="px-6 md:px-10 lg:px-16 py-6 min-h-screen text-white">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Track your spending insights
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={<Wallet />} title="This Week" value={formatCurrency(data.total, currency)} />
        <StatCard icon={<TrendingUp />} title="Trend" value={`${Math.abs(data.pct_change ?? 0)}%`} />
        <StatCard icon={<CreditCard />} title="Top Method" value={data.topPaymentMethodUsed?.name ?? "-"} />
        <StatCard icon={<CalendarDays />} title="Peak Day" value={formatDate(data.peakDay?.date)} />
      </div>

      {/* ANALYTICS */}
      <h2 className="text-xs font-semibold text-gray-400 mt-8 mb-2 uppercase tracking-wider">
        Analytics
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className={glassCard}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
          <div className="relative">
            <DayWiseSpendChart
              recentTransactions={data.recentTransactions ?? []}
              fallbackLabels={data.chart?.labels ?? []}
              fallbackSeries={data.chart?.series ?? []}
              currency={currency}
            />
          </div>
        </div>

        <div className={glassCard}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
          <div className="relative">
            <PaymentMethodDoughnut breakdown={data.paymentMethodBreakdown ?? []} />
          </div>
        </div>
      </div>

      <div className={`${glassCard} mt-6`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
        <div className="relative">
          <DailySpendBar
            recentTransactions={data.recentTransactions ?? []}
            fallbackLabels={data.chart?.labels ?? []}
            fallbackSeries={data.chart?.series ?? []}
            currency={currency}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">

        <div className={`lg:col-span-2 ${glassCard}`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>

          <div className="relative">
            <h3 className="font-semibold text-sm text-gray-400 mb-3 uppercase tracking-wide">
              Recent Transactions
            </h3>
            <RecentTransactionsList items={data.recentTransactions ?? []} currency={currency} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-semibold mb-2">
            {data.action?.label ?? "Take Action"}
          </h3>
          <p className="text-sm text-gray-200">
            {data.action?.tip ?? "Improve your spending habits"}
          </p>
        </div>
      </div>
    </div>
  );
}