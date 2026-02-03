// import sampleTshirt from "../../../../assets/carrot 1.png";
// import { useState, useEffect } from "react";

// import { Chart } from "./components/Chart";
// import RadialChart from "./components/RadialChart";
// import AuthenticatedNav from "../../../../components/AuthenticatedNav";
// import { getAllMerch } from "../../../../api/merch";
// import { getAllOrders } from "../../../../api/order";
// import { getStudents } from "../../../../api/student";

// const Index = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [orders, setOrders] = useState<any[]>([]);
//   const [students, setStudents] = useState<any[]>([]);
//   const [chartData, setChartData] = useState<number[]>([
//     150, 180, 120, 210, 250, 180, 190,
//   ]);
//   const [loading, setLoading] = useState(true);
//   const [memberStats, setMemberStats] = useState({
//     members: 75,
//     nonMembers: 25,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [merchData, orderData, studentData] = await Promise.all([
//           getAllMerch(),
//           getAllOrders(),
//           getStudents(),
//         ]);

//         // Process merch data for inventory
//         const processedProducts = merchData.slice(0, 3).map((merch: any) => ({
//           id: merch.merchId,
//           name: merch.merchName,
//           stock:
//             merch.variants?.reduce(
//               (sum: number, v: any) =>
//                 sum +
//                 (v.variantItems?.reduce(
//                   (s: number, i: any) => s + i.stockQuantity,
//                   0,
//                 ) || 0),
//               0,
//             ) || 0,
//           status:
//             (merch.variants?.reduce(
//               (sum: number, v: any) =>
//                 sum +
//                 (v.variantItems?.reduce(
//                   (s: number, i: any) => s + i.stockQuantity,
//                   0,
//                 ) || 0),
//               0,
//             ) || 0) > 0
//               ? "In Stock"
//               : "Out of Stock",
//         }));
//         setProducts(processedProducts);

//         // Process order data
//         const processedOrders = orderData.slice(0, 3).map((order: any) => ({
//           id: order.orderId,
//           name: order.studentName || "Unknown",
//           refNo: order.referenceNumber || `ORD${order.orderId}`,
//           product: order.items?.[0]?.merchName || "Unknown Product",
//           status: order.orderStatus || "Processing",
//         }));
//         setOrders(processedOrders);

//         // Process student data
//         const processedStudents = studentData
//           .slice(0, 3)
//           .map((student: any) => ({
//             id: student.studentId,
//             name: student.firstName + " " + student.lastName,
//             idNumber: student.idNumber,
//             status: student.paid ? "Paid" : "Not Paid",
//           }));
//         setStudents(processedStudents);

//         // Calculate member statistics
//         const totalStudents = studentData.length;
//         const paidStudents = studentData.filter((s: any) => s.paid).length;
//         const memberPercentage =
//           Math.round((paidStudents / totalStudents) * 100) || 75;
//         setMemberStats({
//           members: memberPercentage,
//           nonMembers: 100 - memberPercentage,
//         });

//         // Generate chart data based on orders (last 7 days simulation)
//         const chartValues = Array(7)
//           .fill(0)
//           .map(() => Math.floor(Math.random() * 300));
//         setChartData(chartValues);
//       } catch (error) {
//         console.error("Error fetching finance data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const sampleProducts =
//     products.length > 0
//       ? products
//       : [{ id: 1, name: "Loading...", stock: 0, status: "In Stock" }];

//   const sampleUsers =
//     orders.length > 0
//       ? orders
//       : [
//           {
//             id: 1,
//             name: "Loading...",
//             refNo: "---",
//             product: "---",
//             status: "Processing",
//           },
//         ];

//   const sampleStudents =
//     students.length > 0
//       ? students
//       : [{ id: 1, name: "Loading...", idNumber: "---", status: "Paid" }];

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
//       <div className="relative w-full max-w-[90rem] p-4 md:p-6 text-white">
//         <AuthenticatedNav />

//         <div className="py-5">
//           {/* Charts Row */}
//           <div className="flex flex-wrap gap-6 justify-center">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="w-full sm:w-[320px] lg:w-[420px] border border-gray-600 rounded-lg bg-[#0F033C]"
//               >
//                 <Chart />
//               </div>
//             ))}
//           </div>

//           {/* Tables & Radial Chart */}
//           <div className="flex flex-col gap-10 py-10">
//             {/* Membership & Order Status */}
//             <div className="flex flex-col md:flex-row gap-6">
//               {/* Inventory */}
//               <div className="w-full md:w-1/2 bg-[#0F033C] p-4 rounded-md flex flex-col">
//                 <p className="text-2xl mb-4">Inventory</p>
//                 <div className="bg-purple-900/35 w-full flex-1 rounded-md p-4 overflow-auto">
//                   {/* Header */}
//                   <div className="grid grid-cols-[2fr_1fr_1fr] text-sm text-white uppercase px-2 pb-2 border-b border-[#FDE006]">
//                     <div className="text-left">NAME</div>
//                     <div className="text-center">ID NUMBER</div>
//                     <div className="text-center">STATUS</div>
//                   </div>

//                   {/* Rows */}
//                   <div className="space-y-2">
//                     {sampleProducts.map((p) => (
//                       <div
//                         key={p.id}
//                         className="grid grid-cols-[2fr_1fr_1fr] items-center px-2 py-4 rounded-md transition"
//                       >
//                         <div className="flex items-center gap-3 min-w-0">
//                           <img
//                             src={sampleTshirt}
//                             alt=""
//                             className="w-10 h-10 rounded object-cover"
//                           />
//                           <span className="font-medium truncate text-white">
//                             {p.name}
//                           </span>
//                         </div>
//                         <div className="text-center font-mono text-white">
//                           {p.stock}
//                         </div>
//                         <div className="text-center">
//                           <span
//                             className={`text-xs font-medium ${
//                               p.status === "In Stock"
//                                 ? "text-green-400"
//                                 : "text-red-400"
//                             }`}
//                           >
//                             {p.status}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Order Status */}
//               <div className="w-full md:w-1/2 bg-[#0F033C] p-4 rounded-md flex flex-col">
//                 <p className="text-2xl mb-4">Order Status</p>
//                 <div className="bg-purple-900/35 w-full flex-1 rounded-md p-4 overflow-auto">
//                   {/* Header */}
//                   <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-sm text-white uppercase px-2 pb-2 border-b border-[#FDE006]">
//                     <div className="text-left">NAME</div>
//                     <div className="text-center">REF NO.</div>
//                     <div className="text-center">PRODUCT</div>
//                     <div className="text-center">STATUS</div>
//                   </div>

//                   {/* Rows */}
//                   <div className="divide-y divide-white/5">
//                     {sampleUsers.map((p) => (
//                       <div
//                         key={p.id}
//                         className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-2 py-4 hover:bg-purple-900/30 transition"
//                       >
//                         <div className="flex items-center gap-3 min-w-0">
//                           <span className="font-medium truncate text-white">
//                             {p.name}
//                           </span>
//                         </div>
//                         <div className="text-center font-mono text-sm text-white">
//                           {p.refNo}
//                         </div>
//                         <div className="text-center text-sm text-white truncate">
//                           {p.product}
//                         </div>
//                         <div className="text-center">
//                           <span
//                             className={`text-xs font-semibold ${
//                               p.status === "In Stock"
//                                 ? "text-green-400"
//                                 : "text-red-400"
//                             }`}
//                           >
//                             {p.status}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Membership & Radial Chart */}
//             <div className="flex flex-col md:flex-row gap-6">
//               {/* Membership Status */}
//               <div className="w-full md:w-1/2 bg-[#0F033C] p-4 rounded-md flex flex-col">
//                 <p className="text-2xl mb-4">Membership Status</p>
//                 <div className="bg-purple-900/35 w-full flex-1 rounded-md p-4 overflow-auto">
//                   {/* Header */}
//                   <div className="grid grid-cols-[2fr_1fr_1fr] text-sm text-white uppercase px-2 pb-2 border-b border-[#FDE006]">
//                     <div className="text-left">NAME</div>
//                     <div className="text-center">ID NUMBER</div>
//                     <div className="text-center">STATUS</div>
//                   </div>

//                   {/* Rows */}
//                   <div className="space-y-2 divide-y divide-white/5">
//                     {sampleStudents.map((p) => (
//                       <div
//                         key={p.id}
//                         className="grid grid-cols-[2fr_1fr_1fr] items-center px-2 py-4 rounded-md transition"
//                       >
//                         <div className="flex items-center gap-3 min-w-0">
//                           <span className="font-medium truncate text-white">
//                             {p.name}
//                           </span>
//                         </div>
//                         <div className="text-center font-mono text-white">
//                           {p.idNumber}
//                         </div>
//                         <div className="text-center">
//                           <span
//                             className={`text-xs font-medium ${
//                               p.status === "Paid"
//                                 ? "text-green-400"
//                                 : "text-red-400"
//                             }`}
//                           >
//                             {p.status}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Radial Chart */}
//               <div className="w-full md:w-1/2 space-y-3 bg-[#0F033C] p-4 rounded-md">
//                 <p className="text-2xl text-white">
//                   Member to Non-Member Ratio
//                 </p>
//                 <div className="flex flex-col lg:flex-row bg-purple-900/35 w-full rounded-md p-4 gap-4 items-center">
//                   <div className="shrink-0">
//                     <RadialChart />
//                   </div>
//                   <div className="flex-1 w-full space-y-4 bg-purple-900/60 px-4 py-6 rounded-lg">
//                     <div className="flex w-full justify-between text-white border-b border-white/20 pb-2">
//                       <p className="before:w-[2px] before:bg-yellow-400 before:absolute before:h-full before:left-0 relative px-2">
//                         Member
//                       </p>
//                       <p>75%</p>
//                     </div>
//                     <div className="flex w-full justify-between text-white border-b border-white/20 pb-2">
//                       <p className="before:w-[2px] before:bg-[#A000FF] before:absolute before:h-full before:left-0 relative px-2">
//                         Non-Member
//                       </p>
//                       <p>25%</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;
