import { useEffect, useState, useMemo } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import {
  Users,
  Calendar,
  LayoutDashboard,
  ArrowUpRight,
  Package,
} from "lucide-react";
import StatCard from "./components/StatCard";
import QuickActions from "./components/QuickActions";
import ActivityFeed, { type ActivityItem } from "./components/ActivityFeed";
import {
  getFinanceDashboard,
  type FinanceDashboardDTO,
} from "../../../api/dashboard";
import { getUpcomingEvents } from "../../../api/event";
import { S3_BASE_URL } from "../../../constant";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [dashboardData, setDashboardData] =
    useState<FinanceDashboardDTO | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dash, events] = await Promise.all([
          getFinanceDashboard(),
          getUpcomingEvents(),
        ]);
        setDashboardData(dash);
        setUpcomingEvents(events);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activities = useMemo<ActivityItem[]>(() => {
    if (!dashboardData) return [];

    const items: ActivityItem[] = [];

    // Add recent orders
    dashboardData.recentOrders.slice(0, 3).forEach((order) => {
      items.push({
        id: order.orderItemId,
        type: "ORDER",
        title: `New order: ${order.productName}`,
        subtitle: `Ordered by ${order.studentName}`,
        time: "Recently",
      });
    });

    // Add recent memberships
    dashboardData.recentMemberships.slice(0, 3).forEach((mem) => {
      items.push({
        id: mem.studentId,
        type: "MEMBERSHIP",
        title: "New Membership Registration",
        subtitle: `${mem.fullName} joined as a member`,
        time: "Recently",
      });
    });

    // Add announcements

    return items;
  }, [dashboardData]);

  return (
    <Layout>
      <main className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 py-6 text-white">
        <AuthenticatedNav />

          <section className="mt-10 space-y-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <section>
                <nav className="flex items-center gap-2 mb-2"></nav>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                  Central command for organization oversight.
                </p>
              </section>
            </header>

            {/* Stats Row */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Organization Students"
                value={dashboardData?.membershipRatio.totalStudents ?? 0}
                icon={Users}
                isLoading={isLoading}
                trend={{ value: "+12%", isPositive: true }}
              />
              <StatCard
                title="Active Paid Members"
                value={dashboardData?.membershipRatio.paidMembersCount ?? 0}
                icon={LayoutDashboard}
                isLoading={isLoading}
                description={`${dashboardData?.membershipRatio.memberPercentage.toFixed(1)}% of total students`}
              />

              <StatCard
                title="Upcoming events"
                value={upcomingEvents.length ?? 0}
                icon={Calendar}
                isLoading={isLoading}
                description="Scheduled this month"
              />
            </nav>

            {/* Main Content Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column: Activity & Overview */}
              <article className="lg:col-span-2 space-y-10">
                {/* Activity Section */}
                <section className="bg-[#0F033C]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-black/20">
                  <header className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      Recent Activity
                      <span className="text-[10px] font-bold py-1 px-2 rounded-full bg-purple-500/10 text-purple-400 uppercase border border-purple-500/20">
                        Real-time
                      </span>
                    </h2>
                    <button className="text-xs font-bold text-gray-500 hover:text-white uppercase transition-colors flex items-center gap-1 cursor-pointer">
                      View All <ArrowUpRight size={12} />
                    </button>
                  </header>
                  <ActivityFeed activities={activities} isLoading={isLoading} />
                </section>

                {/* Inventory Peek */}
                <section className="bg-[#0F033C]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-black/20">
                  <header className="flex justify-between items-center mb-8">
                    <article>
                      <h2 className="text-xl font-bold">Inventory Alerts</h2>
                      <p className="text-xs text-gray-500 mt-1 uppercase">
                        Critical Stock Levels
                      </p>
                    </article>
                    <button
                      onClick={() => navigate("/admin/merch/products")}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/20 cursor-pointer"
                    >
                      Manage Store
                    </button>
                  </header>

                  <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      Array.from({ length: 2 }).map((_, i) => (
                        <span
                          key={i}
                          className="h-24 bg-white/5 rounded-2xl animate-pulse"
                        />
                      ))
                    ) : dashboardData?.inventory.filter(
                        (i) => i.stockStatus !== "IN_STOCK",
                      ).length === 0 ? (
                      <footer className="col-span-full py-10 text-center bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                        <p className="text-emerald-400 text-sm font-medium">
                          All items adequately stocked.
                        </p>
                      </footer>
                    ) : (
                      dashboardData?.inventory
                        .filter((i) => i.stockStatus !== "IN_STOCK")
                        .map((item) => (
                          <article
                            key={item.id}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5"
                          >
                            <span className="w-14 h-14 rounded-xl bg-white/5 p-2 shrink-0">
                              <img
                                src={
                                  item.s3ImageKey
                                    ? `${S3_BASE_URL}${item.s3ImageKey}`
                                    : "/placeholder.png"
                                }
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </span>
                            <section className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">
                                {item.name}
                              </h4>
                              <nav className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    item.stockStatus === "OUT_OF_STOCK"
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }`}
                                >
                                  {item.stockStatus.replace("_", " ")}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {item.stock} left
                                </span>
                              </nav>
                            </section>
                          </article>
                        ))
                    )}
                  </nav>
                </section>
              </article>

              {/* Right Column: Actions & Team */}
              <aside className="space-y-10">
                {/* Quick Actions */}
                <section>
                  <header className="flex items-center gap-2 mb-6 px-1">
                    <Package size={16} className="text-purple-400" />
                    <h2 className="text-xs font-black uppercase text-gray-500">
                      Quick Actions
                    </h2>
                  </header>
                  <QuickActions />
                </section>
              </aside>
            </section>
          </section>
        </main>
      </Layout>
  );
};

export default Index;
