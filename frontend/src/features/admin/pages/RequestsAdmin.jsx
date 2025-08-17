import RequestsBusiness from "../components/RequestsBusiness";

const RequestsAdmin = () => {
  return (
    <div className="p-8 space-y-6 bg-gray-300">
      <h1 className="text-2xl font-bold">Solicitudes de Negocios</h1>
      <RequestsBusiness/>
    </div>
  );
}

export default RequestsAdmin