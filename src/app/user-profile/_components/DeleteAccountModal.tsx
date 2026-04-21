"use client";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  error?: string | null;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#fbf8ec] bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-[#414141]">Подтверждение удаления</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <p className="text-[#414141] mb-6">
          Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#f3f2f1] rounded hover:shadow-md p-2 justify-center items-center active:shadow-inner duration-300 cursor-pointer text-[#606060] font-medium"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-[#d80000] text-white rounded hover:bg-red-700 duration-300 cursor-pointer font-medium"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
