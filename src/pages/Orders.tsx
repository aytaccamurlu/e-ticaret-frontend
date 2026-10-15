import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (err) {
      console.error("Siparişler yüklenirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Üst Kısım */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-black text-orange-400 flex items-center gap-2">
            📦 Siparişlerim
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer font-medium"
          >
            ← Mağazaya Dön
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg">
            Siparişler yükleniyor...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-gray-400">
            <span className="text-5xl block mb-3">🛍️</span>
            Henüz verilmiş bir siparişiniz bulunmuyor.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-white/10 pb-3 gap-2">
                  <div>
                    <span className="text-sm text-gray-400 block">
                      Sipariş ID: #{order.id}
                    </span>
                    <span className="text-xs text-teal-300">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                      {order.status || "Hazırlanıyor"}
                    </span>
                    <span className="text-lg font-black text-orange-400">
                      {order.totalAmount} ₺
                    </span>
                  </div>
                </div>

                {/* Sipariş Edilen Ürünler Listesi */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Ürünler
                  </h4>
                  {order.items &&
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 text-sm"
                      >
                        <span className="font-medium text-white">
                          {item.productName || `Ürün ID: ${item.id}`}
                        </span>
                        <div className="flex items-center gap-6">
                          <span className="text-gray-400">
                            Adet: {item.quantity}
                          </span>
                          <span className="font-semibold text-teal-300">
                            {item.price} ₺
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
