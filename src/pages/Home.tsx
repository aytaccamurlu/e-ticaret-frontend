import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  categoryId?: number;
}

interface Category {
  id: number;
  name: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sayfa ilk açıldığında kategorileri veritabanından çek
  useEffect(() => {
    fetchCategories();
  }, []);

  // Kategori seçimi değiştiğinde ürünleri veritabanından çek
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Kategoriler yüklenirken hata oluştu:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `/products?categoryId=${selectedCategory}`
        : "/products";
      const response = await api.get(url);
      setProducts(response.data);
    } catch (err) {
      console.error("Ürünler yüklenirken hata oluştu:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Sepete Ekle Fonksiyonu
  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item: any) => item.id === product.id,
    );

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert(`${product.name} sepete eklendi! 🛒`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-gray-100">
      {/* Üst Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛍️</span>
          <h1 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            E-Ticaret Mağazası
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            📦 Siparişlerim
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            🛒 Sepet
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sol Menü: Kategoriler */}
        <div className="w-full md:w-64 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl h-fit">
          <h2 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
            📂 Kategoriler
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                selectedCategory === null
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              ✨ Tüm Ürünler
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "hover:bg-white/10 text-gray-300"
                }`}
              >
                📁 {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sağ Alan: Ürün Listesi */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-300">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name +
                  " Ürünleri"
                : "Tüm Ürünler"}
            </h2>
            <span className="text-sm text-gray-400">
              {products.length} ürün listeleniyor
            </span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400 text-lg">
              Yükleniyor...
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-gray-400">
              <span className="text-4xl block mb-2">📦</span>
              Bu kategoride henüz ürün bulunmuyor.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:transform hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover border-b border-white/10"
                      />
                    ) : (
                      <div className="w-full h-48 bg-white/5 flex items-center justify-center text-4xl border-b border-white/10">
                        📦
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                        {product.description || "Açıklama bulunmuyor."}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between">
                    <span className="text-xl font-black text-orange-400">
                      {product.price} ₺
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm"
                    >
                      Sepete Ekle 🛒
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
