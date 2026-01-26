"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { useRouter } from "next/navigation";

// Data dummy untuk contoh (nanti bisa diganti dengan data dari props atau API)
const sampleOrders = [
  {
    id: "ORD-001",
    customer: "PT. Makmur Jaya",
    totalAmount: 12500000,
    status: "pending",
    createdAt: "2024-01-15",
    paymentMethod: "Transfer Bank",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "CV. Sentosa Abadi",
    totalAmount: 8500000,
    status: "processing",
    createdAt: "2024-01-14",
    paymentMethod: "Credit",
    items: 5,
  },
  {
    id: "ORD-003",
    customer: "UD. Berkah Mandiri",
    totalAmount: 21000000,
    status: "waiting_payment",
    createdAt: "2024-01-13",
    paymentMethod: "Transfer Bank",
    items: 2,
  },
  {
    id: "ORD-004",
    customer: "PT. Indah Selalu",
    totalAmount: 7600000,
    status: "completed",
    createdAt: "2024-01-12",
    paymentMethod: "Cash",
    items: 4,
  },
  {
    id: "ORD-005",
    customer: "CV. Maju Bersama",
    totalAmount: 15300000,
    status: "pending",
    createdAt: "2024-01-11",
    paymentMethod: "Transfer Bank",
    items: 3,
  },
];

export default function OrderManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Konfirmasi Order");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Filter orders berdasarkan tab aktif
  const getFilteredOrders = () => {
    switch (activeTab) {
      case "Konfirmasi Order":
        return sampleOrders.filter((order) => order.status === "pending");
      case "Menunggu Pembayaran DP":
        return sampleOrders.filter(
          (order) => order.status === "waiting_payment",
        );
      case "Pemrosesan Order":
        return sampleOrders.filter((order) => order.status === "processing");
      case "Menunggu Pelunasan":
        return sampleOrders.filter(
          (order) => order.status === "waiting_payment",
        );
      case "Order Selesai":
        return sampleOrders.filter((order) => order.status === "completed");
      default:
        return sampleOrders;
    }
  };

  const handleDelete = async (id) => {
    // Logika delete order
    console.log("Deleting order:", id);
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };

  const handleViewDetail = (id) => {
    router.push(`/orders/detail/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/orders/edit/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "waiting_payment":
        return "bg-orange-100 text-orange-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "waiting_payment":
        return "Menunggu Pembayaran";
      case "processing":
        return "Sedang Diproses";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const tabItems = [
    "Konfirmasi Order",
    "Menunggu Pembayaran DP",
    "Pemrosesan Order",
    "Menunggu Pelunasan",
    "Order Selesai",
  ];

  const filteredOrders = getFilteredOrders();

  return (
    <div className="p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="font-semibold text-2xl md:text-3xl text-gray-800">
            Order Management
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola semua pesanan B2B Anda di satu tempat
          </p>
        </div>
      </div>

      {/* Stats Cards - Sama seperti UsersScreen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {sampleOrders.length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {sampleOrders.filter((o) => o.status === "pending").length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Processing Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {sampleOrders.filter((o) => o.status === "processing").length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(
                  sampleOrders.reduce(
                    (sum, order) => sum + order.totalAmount,
                    0,
                  ),
                )}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs Line Navigation - Full Width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-2 md:px-6">
          <ul className="flex items-center text-sm font-medium overflow-x-auto">
            {tabItems.map((item, index) => (
              <li key={item} className="flex-1 min-w-[200px]">
                <button
                  onClick={() => setActiveTab(item)}
                  className={`relative flex items-center justify-center gap-2 px-3 md:px-4 py-4 w-full transition-colors whitespace-nowrap ${
                    activeTab === item
                      ? "text-blue-600 font-semibold after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:bg-blue-600"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === item
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index === 0
                      ? 2
                      : index === 1
                        ? 1
                        : index === 2
                          ? 1
                          : index === 3
                            ? 0
                            : 1}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table Section - Sama seperti UsersScreen */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {activeTab}
              </h2>
              <p className="text-sm text-gray-600">
                Menampilkan {filteredOrders.length} order
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Cari order..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Filter</option>
                <option>Hari Ini</option>
                <option>Minggu Ini</option>
                <option>Bulan Ini</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metode Bayar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        order.status,
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewDetail(order.id)}
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(order.id)}
                        className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                        title="Edit"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedId(order.id);
                        }}
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Tidak ada order
              </h3>
              <p className="text-gray-500">
                Tidak ada order ditemukan untuk kategori {activeTab}
              </p>
            </div>
          )}
        </div>

        {/* Table Footer */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredOrders.length}</span> of{" "}
                <span className="font-medium">{filteredOrders.length}</span>{" "}
                orders
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          setIsOpen={setIsDeleteModalOpen}
          onCancel={() => setIsDeleteModalOpen(false)}
          handleConfirm={() => handleDelete(selectedId)}
          title="Hapus Order"
          message="Apakah Anda yakin ingin menghapus order ini? Tindakan ini tidak dapat dibatalkan."
        />
      )}
    </div>
  );
}
