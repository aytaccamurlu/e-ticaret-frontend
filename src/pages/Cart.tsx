import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleCheckout = async () => {
    setLoading(true);
    setMessage("");

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post("/orders", orderPayload);

      setMessage("Siparişiniz başarıyla oluşturuldu! 🎉");
      setCartItems([]);
      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Sipariş oluşturulamadı.";
      setMessage(typeof errorMsg === "string" ? errorMsg : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-black text-orange-400 flex items-center gap-2">
            🛒 Alışveriş Sepeti
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer font-medium"
          >
            ← Alışverişe Dön
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-teal-500/20 border border-teal-400 text-teal-200 rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl block mb-3">📦</span>
            Sepetiniz boş.
          </div>
        ) : (
          <div>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/10 gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border border-white/10"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-2xl">
                        📦
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        {item.name}
                      </h3>
                      <span className="text-orange-400 font-semibold">
                        {item.price} ₺
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Miktar Artırma / Azaltma */}
                    <div className="flex items-center bg-white/10 rounded-xl border border-white/10 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1.5 hover:bg-white/20 text-white font-bold cursor-pointer transition-all"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1.5 hover:bg-white/20 text-white font-bold cursor-pointer transition-all"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium cursor-pointer px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all"
                    >
                      Sil 🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-6 gap-4">
              <div>
                <span className="text-gray-400 text-sm block">
                  Toplam Tutar
                </span>
                <span className="text-3xl font-black text-teal-300">
                  {totalPrice} ₺
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/40 transition-all cursor-pointer text-lg disabled:opacity-50"
              >
                {loading ? "İşleniyor..." : "Siparişi Tamamla 🚀"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
