import React from "react";
import LineChart from "./components/LineChart";
import Navbar from "../../../components/Navbar";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Index = () => {
  const sampleStudents = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      idNumber: "20211001",
      membership: "Non-Member",
      total: "₱1,666.00",
      date: "September 9, 2025",
      status: "Pending",
    },
    {
      id: 2,
      name: "Juan Dela Cruz",
      idNumber: "20211001",
      membership: "Non-Member",
      total: "₱1,666.00",
      date: "September 9, 2025",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="w-full max-w-[90rem] p-6 text-white">
        <Navbar  />

         {/* MAIN CARD */}
        <div className="mt-6 bg-[#0F033C] rounded-xl p-4 sm:p-8 space-y-10">

          {/* ================= SALES / CHART ================= */}
          <div>
            <div className="w-full h-[240px] sm:h-[300px]">
              <LineChart />
            </div>

            <div className="mt-40 sm:mt-25">
              <button className="flex items-center gap-2 text-xs bg-[#2d175c] border border-purple-400 px-4 py-2 rounded-md">
                <FaClockRotateLeft />
                Full History
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p className="text-lg font-semibold">Transactions</p>

              <div className="flex w-full sm:w-auto gap-2">
                <input
                  placeholder="Search for..."
                  className="flex-1 sm:flex-none bg-[#2d175c] text-xs px-3 py-2 rounded-md outline-none"
                />
                <select className="bg-[#2d175c] text-xs px-3 py-2 rounded-md outline-none">
                  <option>Year</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[900px] bg-[#24144F] rounded-xl overflow-hidden">
                <div className="grid grid-cols-7 px-6 py-4 text-xs uppercase border-b border-white/10 opacity-80">
                  <div>Student ID</div>
                  <div>Student</div>
                  <div>Membership</div>
                  <div>Total</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>

                {sampleStudents.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-7 px-6 py-4 text-sm items-center border-b border-white/5 last:border-none"
                  >
                    <div>{p.idNumber}</div>
                    <div>{p.name}</div>
                    <div>{p.membership}</div>
                    <div>{p.total}</div>
                    <div>{p.date}</div>

                    <div
                      className={`font-semibold ${
                        p.status === "Paid"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {p.status}
                    </div>

                    <div className="flex gap-2">
                      <button className="w-6 h-6 rounded-full border  text-red-400 flex items-center justify-center">
                        <IoClose className="text-xl"/>
                      </button>
                      <button className="w-6 h-6 rounded-full border text-green-400 flex items-center justify-center">
                        <FaCheck />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
