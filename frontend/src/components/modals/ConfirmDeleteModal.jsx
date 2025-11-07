import { useState } from "react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

/**
 * Modal de confirmación doble para eliminar cuenta/registro
 * @param {Boolean} isOpen - Si el modal está abierto
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} onConfirm - Función a ejecutar cuando se confirma
 * @param {String} title - Título del modal
 * @param {String} message - Mensaje principal
 * @param {String} confirmText - Texto del botón de confirmar (default: "Eliminar")
 * @param {String} itemName - Nombre del item a eliminar (para la segunda confirmación)
 */
const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Eliminación",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  itemName = "",
}) => {
  const [step, setStep] = useState(1); // 1 = primera confirmación, 2 = segunda confirmación
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Texto que el usuario debe escribir para confirmar (usualmente el nombre del item)
  const confirmationText = itemName || "ELIMINAR";

  const handleClose = () => {
    setStep(1);
    setInputValue("");
    setIsProcessing(false);
    onClose();
  };

  const handleFirstConfirm = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleFinalConfirm = async () => {
    if (inputValue.toUpperCase() !== confirmationText.toUpperCase()) {
      return; // No hacer nada si no coincide
    }

    setIsProcessing(true);
    try {
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setIsProcessing(false);
      // No cerrar el modal si hay error, para que el usuario pueda ver el mensaje
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <>
              <p className="text-gray-700 mb-4">{message}</p>
              <p className="text-sm text-gray-500 mb-6">
                Esta es la primera confirmación. Deberás confirmar una vez más
                para completar la acción.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4 font-medium">
                Confirmación Final
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Para confirmar la eliminación, por favor escribe{" "}
                <span className="font-bold text-red-600">
                  "{confirmationText}"
                </span>{" "}
                en el campo a continuación:
              </p>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Escribe "${confirmationText}"`}
                disabled={isProcessing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
              />
              {inputValue &&
                inputValue.toUpperCase() !== confirmationText.toUpperCase() && (
                  <p className="text-sm text-red-600 mt-2">
                    El texto no coincide. Por favor, escribe exactamente "
                    {confirmationText}"
                  </p>
                )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          {step === 1 ? (
            <button
              onClick={handleFirstConfirm}
              disabled={isProcessing}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleFinalConfirm}
              disabled={
                isProcessing ||
                inputValue.toUpperCase() !== confirmationText.toUpperCase()
              }
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Procesando...
                </>
              ) : (
                confirmText
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

