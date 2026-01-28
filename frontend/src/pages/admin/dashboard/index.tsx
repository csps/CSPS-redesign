import sampleTshirt from "../../../assets/carrot 1.png";
import sampleProfile from "../../../assets/logos/csps_logo 1.png";
import AuthenticatedNav from "../../../components/AuthenticatedNav";

const Index = () => {
  const sampleProducts = [
    { id: 1, name: "BSCS Uniform - S", stock: 234, status: "" },
    { id: 2, name: "BSCS Uniform - S", stock: 234, status: "" },
    { id: 3, name: "BSCS Uniform - S", stock: 234, status: "" },
    { id: 3, name: "BSCS Uniform - S", stock: 234, status: "" },
    { id: 3, name: "BSCS Uniform - S", stock: 234, status: "" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="w-full max-w-[90rem] p-4 md:p-6 text-white">
        <AuthenticatedNav />

        <div className="w-full space-y-10">
          {/* Top Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            <div className="bg-[#0F033C] text-gray-200 border border-gray-500 h-40 sm:h-48 rounded-md flex flex-col justify-between py-5 px-4">
              <p className="text-lg text-white">Pending Forum Posts</p>
              <p className="text-center text-5xl font-semibold">12</p>
              <p>odlest: 5 days ago</p>
            </div>
            <div className="bg-[#0F033C] border border-gray-500 h-40 sm:h-48 rounded-md flex flex-col  py-5 px-4">
              <p className="text-lg text-white">Total Merch</p>
              <p className="text-center text-5xl font-semibold py-4">12</p>
            </div>
            <div className="bg-[#0F033C] border border-gray-500 h-40 sm:h-48 rounded-md flex flex-col  py-5 px-4">
              <p className="text-lg text-white">Total Orders</p>
              <p className="text-center text-5xl font-semibold py-4">452</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full gap-10">
            <div className="w-full lg:w-1/2 space-y-3">
              <p className="text-lg font-medium">Inventory</p>

              <div className="bg-[#0F033C] w-full rounded-md p-4 ">
                {/* Header */}
                <div className="grid grid-cols-3 text-center text-sm text-white px-1 pb-2">
                  <div>Product</div>
                  <div>Stocks</div>
                  <div>Status</div>
                </div>

                <div className="space-y-3 overflow-auto">
                  {sampleProducts.map((p) => (
                    <div
                      key={p.id}
                      className=" grid  grid-cols-3 md:grid-cols-[2fr_1fr_1fr] gap-3  items-center border-b border-gray-400 p-3"
                    >
                      {/* Product */}
                      <div className="flex items-center gap-2">
                        <img
                          src={sampleTshirt}
                          alt=""
                          className="w-10 h-10 md:w-12 md:h-12 object-cover"
                        />
                        <span className="font-medium truncate">{p.name}</span>
                      </div>

                      {/* Stocks */}
                      <div className="flex justify-center md:justify-center">
                        <span className="font-mono">{p.stock}</span>
                      </div>

                      {/* Status */}
                      <div className="flex justify-center"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Forum Approval */}
            <div className="w-full lg:w-1/2 space-y-3">
              <p className="text-lg font-medium">Forum Approval</p>

              <div className="w-full space-y-6">
                {/* Row 1 */}
                <div className="flex flex-col sm:flex-row gap-5 ">
                  <div className="bg-[#0F033C] w-full sm:w-[80%] rounded-md px-6 py-5">
                    <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center">
                      <div className="flex items-center gap-4 sm:gap-8">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full">
                          <img
                            src={sampleProfile}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-semibold">
                            Title
                          </p>
                          <p className="text-sm text-gray-300">Username</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                        2 mins ago
                      </p>
                    </div>

                    <p className="line-clamp-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Cras vel dolor nunc. Nunc rhoncus venenatis augue vitae
                      tempor. Nulla malesuada libero magna, sit amet eleifend
                      nunc tincidunt at. Mauris congue molestie nunc, quis
                      finibus nunc commodo ut. Nullam aliquet nulla lorem,
                      faucibus mollis libero consequat vel.{" "}
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <button className="px-4 py-2 bg-[#AB83C2] rounded-md">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-[#7D4B99] rounded-md">
                      Decline
                    </button>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex flex-col sm:flex-row gap-5 ">
                  <div className="bg-[#0F033C] w-full sm:w-[80%] rounded-md px-6 py-5">
                    <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center">
                      <div className="flex items-center gap-4 sm:gap-8">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full">
                          <img
                            src={sampleProfile}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-semibold">
                            Title
                          </p>
                          <p className="text-sm text-gray-300">Username</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                        2 mins ago
                      </p>
                    </div>

                    <p className="line-clamp-5">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Cras vel dolor nunc. Nunc rhoncus venenatis augue vitae
                      tempor. Nulla malesuada libero magna, sit amet eleifend
                      nunc tincidunt at. Mauris congue molestie nunc, quis
                      finibus nunc commodo ut. Nullam aliquet nulla lorem,
                      faucibus mollis libero consequat vel.{" "}
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <button className="px-4 py-2 bg-[#AB83C2] rounded-md">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-[#7D4B99] rounded-md">
                      Decline
                    </button>
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
