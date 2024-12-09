'use client';

type CustomAlertProps = {
  message: string;
  onClose: () => void;
};

const CustomAlert = ({ message, onClose }: CustomAlertProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-sm">
        <p className="text-lg font-semibold text-center">{message}</p>
        <div className="mt-6 flex justify-center">
          <button className="btn btn-primary" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
