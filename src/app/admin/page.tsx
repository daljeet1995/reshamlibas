import { getOrders } from "@/lib/sheets";

export default async function AdminPage() {
  const orders = await getOrders();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Panel - All Orders</h1>

      {orders.length === 0 ? (
        <p>Abhi tak koi order nahi aaya hai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Date</th>
                <th className="border border-gray-300 p-3 text-left">Customer</th>
                <th className="border border-gray-300 p-3 text-left">Phone</th>
                <th className="border border-gray-300 p-3 text-left">Address</th>
                <th className="border border-gray-300 p-3 text-left">Total</th>
                <th className="border border-gray-300 p-3 text-left">UTR</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 p-3 font-bold">{order.name}</td>
                  <td className="border border-gray-300 p-3">{order.phone}</td>
                  <td className="border border-gray-300 p-3">{order.address}</td>
                  <td className="border border-gray-300 p-3 text-green-700 font-bold">₹{order.total}</td>
                  <td className="border border-gray-300 p-3 font-mono text-blue-600 font-bold">{order.utr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}