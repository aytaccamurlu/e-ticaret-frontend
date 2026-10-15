import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      // Backend'den gelen token ve rol değerlerini geçiyoruz
      // Eğer backend rolü farklı bir property'de dönüyorsa (örn: response.data.role), onu kullanabilirsin
      login(response.data.token, response.data.role || "User");
      navigate("/");
    } catch (err: any) {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-indigo-950 px-4">
      {/* Arka Plandaki Renkli E-Ticaret / Alışveriş İkonları ve Vektörel Desen */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Dekoratif Renkli Şekiller ve Alışveriş Vektörleri Efekti */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      {/* Ana Giriş Kutusu */}
      <div className="relative z-10 w-full max-w-md bg-teal-50/95 backdrop-blur-md border-4 border-teal-400 p-8 rounded-3xl shadow-2xl shadow-black/50">
        {/* Üst İkon / Karşılama */}
        <div className="flex justify-center mb-2">
          <span className="text-4xl">🛒</span>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-indigo-950 mb-2 tracking-wide">
          Giriş Yap
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          E-ticaret dünyasına hoş geldiniz!
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              📧 E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400 shadow-inner"
              placeholder="ornek@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              🔑 Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400 shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer"
          >
            Giriş Yap 🛒
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
          >
            Hesabın yok mu? <span className="underline">Kayıt Ol</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
