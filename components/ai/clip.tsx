'use client';

import { useState } from 'react';

export default function VisualSearch() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResults([]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/visual-search', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data?.matched) {
      setResults(data.matched);
    } else if (data?.message) {
      setResults([{ message: data.message }]);
    }

    setLoading(false);
    setFile(null);
    setPreview(null);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setResults([]);
      setIsClosing(false);
    }, 300);
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">
          Tìm phòng bằng hình ảnh
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Chọn ảnh bạn muốn tìm – hệ thống sẽ đề xuất những phòng tương tự.
        </p>

        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all">
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <svg
              className="w-6 h-6 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2"
              />
            </svg>
            <span className="text-sm text-gray-600">Nhấn để chọn ảnh từ thiết bị</span>
          </label>

          {preview && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Ảnh đã chọn:</p>
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl max-h-64 w-full object-cover border shadow hover:scale-[1.02] transition"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="mt-6 w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <span>Đang tìm kiếm...</span>
              </div>
            ) : (
              'Tìm phòng giống ảnh này'
            )}
          </button>
        </div>

        {/* Modal kết quả */}
        {results.length > 0 && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`bg-white max-w-5xl w-full mx-4 md:mx-auto rounded-2xl shadow-xl overflow-auto max-h-[90vh] p-6 ${
                isClosing ? 'animate-fade-out' : 'animate-fade-in'
              }`}
            >
              <h2 className="text-3xl font-bold text-center mb-6">Phòng đề xuất</h2>

              {results[0]?.message ? (
                <p className="text-center text-gray-500 text-lg">{results[0].message}</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {results.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl shadow-md overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 text-left">
                        <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-1">{item.country}</p>
                        <p className="text-gray-700 text-sm">💰 Giá: ${item.price} / đêm</p>
                        <p className="text-gray-700 text-sm">👥 Sức chứa: {item.guests} người</p>
                        <p className="text-gray-600 text-sm">🔍 Giống nhau: {item.similarity}</p>
                        <a
                          href={`/properties/${item.id}`}
                          className="inline-block mt-2 text-sm font-medium text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
                        >
                          Xem chi tiết
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Animations */}
        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
          .animate-fade-out {
            animation: fadeOut 0.3s ease-out forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: scale(1);
            }
            to {
              opacity: 0;
              transform: scale(0.95);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
