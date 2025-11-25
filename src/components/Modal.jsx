export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Soft white transparent overlay (NO BLACK) */}
      <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-40"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md md:max-w-lg p-6 rounded-2xl shadow-lg border border-gray-200">

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
