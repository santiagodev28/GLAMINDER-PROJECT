import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo-2.png";

const TerminosCondiciones = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-black/90 border-b border-[#23262B]/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Glaminder Logo" className="h-12 w-auto" />
            <span className="ml-3 text-xl font-bold text-[#F5F5F5]">GLAMINDER</span>
          </Link>
          <Link
            to="/registrar"
            className="text-[#D1A04D] hover:text-[#F5C76A] transition-colors"
          >
            ← Volver al registro
          </Link>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-black/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-[#23262B]/60">
          <h1 className="text-4xl font-bold text-[#F5F5F5] mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-[#B0B3B8] mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                1. Aceptación de los Términos
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Al acceder y utilizar el servicio de Glaminder, usted acepta cumplir con estos 
                términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, 
                no debe utilizar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                2. Descripción del Servicio
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Glaminder es una plataforma que conecta a clientes con negocios de belleza y 
                bienestar, permitiendo la reserva de citas, gestión de servicios y comunicación 
                entre usuarios y proveedores de servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                3. Registro de Usuario
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed mb-4">
                Para utilizar nuestros servicios, debe:
              </p>
              <ul className="list-disc list-inside text-[#B0B3B8] space-y-2 ml-4">
                <li>Proporcionar información veraz, precisa y completa</li>
                <li>Mantener la seguridad de su cuenta y contraseña</li>
                <li>Ser mayor de edad o tener el consentimiento de un tutor legal</li>
                <li>Notificarnos inmediatamente de cualquier uso no autorizado de su cuenta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                4. Uso del Servicio
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed mb-4">
                Usted se compromete a:
              </p>
              <ul className="list-disc list-inside text-[#B0B3B8] space-y-2 ml-4">
                <li>Utilizar el servicio únicamente para fines legales</li>
                <li>No interferir con el funcionamiento del servicio</li>
                <li>No intentar acceder a áreas restringidas del sistema</li>
                <li>Respetar los derechos de otros usuarios</li>
                <li>No utilizar el servicio para actividades fraudulentas o ilegales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                5. Reservas y Cancelaciones
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed mb-4">
                Las reservas de citas están sujetas a:
              </p>
              <ul className="list-disc list-inside text-[#B0B3B8] space-y-2 ml-4">
                <li>Disponibilidad del negocio y del profesional</li>
                <li>Políticas de cancelación del establecimiento</li>
                <li>Confirmación por parte del negocio</li>
              </ul>
              <p className="text-[#B0B3B8] leading-relaxed mt-4">
                Las cancelaciones deben realizarse con al menos 24 horas de anticipación, 
                salvo que el negocio indique lo contrario.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                6. Propiedad Intelectual
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Todo el contenido de Glaminder, incluyendo pero no limitado a textos, gráficos, 
                logos, iconos, imágenes y software, es propiedad de Glaminder o sus proveedores 
                de contenido y está protegido por leyes de propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                7. Limitación de Responsabilidad
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Glaminder actúa como intermediario entre clientes y negocios. No somos responsables 
                por la calidad de los servicios proporcionados por los negocios, ni por disputas 
                que puedan surgir entre usuarios y proveedores de servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                8. Modificaciones del Servicio
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto 
                del servicio en cualquier momento, con o sin previo aviso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                9. Terminación
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Podemos terminar o suspender su acceso al servicio inmediatamente, sin previo 
                aviso, por cualquier motivo, incluyendo el incumplimiento de estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                10. Ley Aplicable
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Estos términos se rigen por las leyes de Colombia. Cualquier disputa será resuelta 
                en los tribunales competentes de Colombia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                11. Contacto
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Si tiene preguntas sobre estos términos, puede contactarnos a través de nuestro 
                sistema de soporte o en la información de contacto proporcionada en la plataforma.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[#31343A]">
            <Link
              to="/registrar"
              className="inline-block bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-[#F5F5F5] font-semibold py-3 px-6 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-200"
            >
              Volver al registro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminosCondiciones;

