import sampleTshirt from "../../../../assets/carrot 1.png";

import { Chart } from "./components/Chart";
import RadialChart from "./components/RadialChart";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";

const Index = () => {
  const sampleProducts = [
    { id: 1, name: "BSCS Uniform - S", stock: 234, status: "Out of Stock" },
    { id: 2, name: "BSCS Uniform - S", stock: 234, status: "In Stock" },
    { id: 3, name: "BSCS Uniform - S", stock: 234, status: "In Stock" },
  ];

  const sampleUsers = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      refNo: "CSPS20231001",
      product: "BSCS Uniform - S",
      status: "Delivered",
    },
    {
      id: 2,
      name: "Maria Clara",
      refNo: "CSPS20231002",
      product: "CSPS Hoodie - M",
      status: "Processing",
    },
    {
      id: 3,
      name: "Pedro Penduko",
      refNo: "CSPS20231003",
      product: "CSPS Cap",
      status: "Shipped",
    },
  ];

  const sampleStudents = [
    { id: 1, name: "Juan Dela Cruz", idNumber: "20211001", status: "Paid" },
    { id: 2, name: "Maria Clara", idNumber: "23749596", status: "Paid" },
    { id: 3, name: "Pedro Penduko", idNumber: "23749096", status: "Not Paid" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="relative w-full max-w-[90rem] p-4 md:p-6 text-white">
        <AuthenticatedNav />

        <div className="py-5">
          {/* Charts Row */}
          <div className="flex flex-wrap gap-6 justify-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full sm:w-[320px] lg:w-[420px] border border-gray-600 rounded-lg bg-[#0F033C]"
              >
                <Chart />
              </div>
            ))}
          </div>

          {/* Tables & Radial Chart */}
          <div className="flex flex-col gap-10 py-10">
            {/* Membership & Order Status */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Inventory */}
              <div className="w-full md:w-1/2 bg-[#0F033C] p-4 rounded-md flex flex-col">
                <p className="text-2xl mb-4">Inventory</p>
                <div className="bg-purple-900/35 w-full flex-1 rounded-md p-4 overflow-auto">
                  {/* Header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr] text-sm text-white uppercase px-2 pb-2 border-b border-[#FDE006]">
                    <div className="text-left">NAME</div>
                    <div className="text-center">ID NUMBER</div>
                    <div className="text-center">STATUS</div>
                  </div>

                  {/* Rows */}
                  <div className="space-y-2">
                    {sampleProducts.map((p) => (
                      <div
                        key={p.id}
                        className="grid grid-cols-[2fr_1fr_1fr] items-center px-2 py-4 rounded-md transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={sampleTshirt}
                            alt=""
                            className="w-10 h-10 rounded object-cover"
                          />
                          <span className="font-medium truncate text-white">
                            {p.name}
                          </span>
                        </div>
                        <div className="text-center font-mono text-white">
                          {p.stock}
                        </div>
                        <div className="text-center">
                          <span
                            className={`text-xs font-medium ${
                              p.status === "In Stock"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="w-full md:w-1/2 bg-[#0F033C] p-4 rounded-md flex flex-col">
                <p className="text-2xl mb-4">Order Status</p>
                <div className="bg-purple-900/35 w-full flex-1 rounded-md p-4 overflow-auto">
                  {/* Header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-sm text-white uppercase px-2 pb-2 border-b border-[#FDE006]">
                    <div className="text-left">NAME</div>
                    <div className="text-center">REF NO.</div>
                    <div className="text-center">PRODUCT</div>
                    <div className="text-center">STATUS</div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-white/5">
                    {sampleUsers.map((p) => (
                      <div
                        key={p.id}
                        className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-2 py-4 hover:bg-purple-900/30 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-medium truncate text-white">
                            {p.name}
                          </span>
                        </div>
                        <div className="text-center font-mono text-sm text-white">
                          {p.refNo}
                        </div>
                        <div className="text-center text-sm text-white truncate">
                          {p.product}
                        </div>
                        <div className="text-center">
                          <span
                            className={`text-xs font-semibold ${
                              p.status === "In Stock"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Membership & Radial Chart */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Membership Status */}
              <div className="w-full md:w-1/2 bg-[#0F033C] p-4 rounded-md flex flex-col">
                <p className="text-2xl mb-4">Membership Status</p>
                <div className="bg-purple-900/35 w-full flex-1 rounded-md p-4 overflow-auto">
                  {/* Header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr] text-sm text-white uppercase px-2 pb-2 border-b border-[#FDE006]">
                    <div className="text-left">NAME</div>
                    <div className="text-center">ID NUMBER</div>
                    <div className="text-center">STATUS</div>
                  </div>

                  {/* Rows */}
                  <div className="space-y-2 divide-y divide-white/5">
                    {sampleStudents.map((p) => (
                      <div
                        key={p.id}
                        className="grid grid-cols-[2fr_1fr_1fr] items-center px-2 py-4 rounded-md transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-medium truncate text-white">
                            {p.name}
                          </span>
                        </div>
                        <div className="text-center font-mono text-white">
                          {p.idNumber}
                        </div>
                        <div className="text-center">
                          <span
                            className={`text-xs font-medium ${
                              p.status === "Paid"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Radial Chart */}
              <div className="w-full md:w-1/2 space-y-3 bg-[#0F033C] p-4 rounded-md">
                <p className="text-2xl text-white">
                  Member to Non-Member Ratio
                </p>
                <div className="flex flex-col lg:flex-row bg-purple-900/35 w-full rounded-md p-4 gap-4 items-center">
                  <div className="shrink-0">
                    <RadialChart />
                  </div>
                  <div className="flex-1 w-full space-y-4 bg-purple-900/60 px-4 py-6 rounded-lg">
                    <div className="flex w-full justify-between text-white border-b border-white/20 pb-2">
                      <p className="before:w-[2px] before:bg-yellow-400 before:absolute before:h-full before:left-0 relative px-2">
                        Member
                      </p>
                      <p>75%</p>
                    </div>
                    <div className="flex w-full justify-between text-white border-b border-white/20 pb-2">
                      <p className="before:w-[2px] before:bg-[#A000FF] before:absolute before:h-full before:left-0 relative px-2">
                        Non-Member
                      </p>
                      <p>25%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
