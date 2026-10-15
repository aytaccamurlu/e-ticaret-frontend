import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        role: "User",
      });

      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      console.error("Backend Hata Detayı:", err.response?.data);

      const errorData = err.response?.data;
      if (typeof errorData === "object" && errorData !== null) {
        if (errorData.errors) {
          const messages = Object.values(errorData.errors).flat();
          setError(messages.join(" "));
        } else if (errorData.message) {
          setError(errorData.message);
        } else {
          setError("Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol edin.");
        }
      } else if (typeof errorData === "string") {
        setError(errorData);
      } else {
        setError("Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol edin.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-indigo-950 px-4 py-8">
      {/* Arka Plan Desenleri */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative z-10 w-full max-w-md bg-teal-50/95 backdrop-blur-md border-4 border-teal-400 p-8 rounded-3xl shadow-2xl shadow-black/50">
        <div className="flex justify-center mb-2">
          <span className="text-4xl">📝</span>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-indigo-950 mb-2 tracking-wide">
          Kayıt Ol
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Aramıza katılın ve hemen alışverişe başlayın!
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 text-sm rounded-xl text-center font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                👤 Ad
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400 shadow-inner"
                placeholder="Ahmet"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                👤 Soyad
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400 shadow-inner"
                placeholder="Yılmaz"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              📧 E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-2.5 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400 shadow-inner"
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
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400 shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer mt-2"
          >
            Kayıt Ol ✨
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
          >
            Zaten hesabın var mı? <span className="underline">Giriş Yap</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
