interface UserConfirmationProps {
  isOpen: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export default function UserConfirmation({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: UserConfirmationProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[300px] text-center shadow-lg">
        <p className="text-lg font-semibold mb-6">{message || "Confirmar ação?"}</p>

        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
