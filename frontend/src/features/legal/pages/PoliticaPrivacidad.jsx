import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo-2.png";

const PoliticaPrivacidad = () => {
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
            Política de Privacidad
          </h1>
          <p className="text-[#B0B3B8] mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                1. Información que Recopilamos
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed mb-4">
                Recopilamos la siguiente información cuando utiliza nuestro servicio:
              </p>
              <ul className="list-disc list-inside text-[#B0B3B8] space-y-2 ml-4">
                <li><strong>Información de registro:</strong> Nombre, apellido, correo electrónico, teléfono</li>
                <li><strong>Información de perfil:</strong> Preferencias, historial de citas, calificaciones</li>
                <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, dispositivo</li>
                <li><strong>Información de uso:</strong> Páginas visitadas, tiempo de uso, interacciones</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                2. Cómo Utilizamos su Información
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed mb-4">
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside text-[#B0B3B8] space-y-2 ml-4">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Procesar y gestionar sus reservas de citas</li>
                <li>Comunicarnos con usted sobre su cuenta y servicios</li>
                <li>Enviar notificaciones importantes sobre el servicio</li>
                <li>Personalizar su experiencia en la plataforma</li>
                <li>Detectar y prevenir fraudes o actividades ilegales</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                3. Compartir Información
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed mb-4">
                Compartimos su información únicamente en las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside text-[#B0B3B8] space-y-2 ml-4">
                <li><strong>Con negocios:</strong> Información necesaria para procesar sus reservas</li>
                <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar (hosting, email, etc.)</li>
                <li><strong>Requisitos legales:</strong> Cuando sea requerido por ley o autoridades</li>
                <li><strong>Con su consentimiento:</strong> En cualquier otra situación con su autorización explícita</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                4. Seguridad de los Datos
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su 
                información personal, incluyendo encriptación, controles de acceso y monitoreo 
                de seguridad. Sin embargo, ningún método de transmisión por Internet es 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                5. Retención de Datos
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Conservamos su información personal mientras su cuenta esté activa o según sea 
                necesario para proporcionar nuestros servicios, cumplir con obligaciones legales 
                o resolver disputas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                6. Sus Derechos
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-[#B0B3B8] space-y-2 ml-4">
                <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos (derecho al olvido)</li>
                <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Revocación:</strong> Revocar su consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                7. Cookies y Tecnologías Similares
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar 
                el uso del sitio y personalizar el contenido. Puede gestionar sus preferencias 
                de cookies a través de la configuración de su navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                8. Menores de Edad
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Nuestro servicio está dirigido a personas mayores de 18 años. No recopilamos 
                intencionalmente información de menores de edad. Si descubrimos que hemos 
                recopilado información de un menor, la eliminaremos inmediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                9. Cambios a esta Política
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos 
                de cambios significativos mediante correo electrónico o a través de nuestro servicio. 
                La fecha de "Última actualización" al inicio de este documento indica cuándo se 
                realizó la última modificación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                10. Contacto
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Si tiene preguntas, preocupaciones o solicitudes relacionadas con esta política 
                de privacidad o el manejo de sus datos personales, puede contactarnos a través 
                de nuestro sistema de soporte o en la información de contacto proporcionada en la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#F5F5F5] mt-8 mb-4">
                11. Cumplimiento Legal
              </h2>
              <p className="text-[#B0B3B8] leading-relaxed">
                Esta política cumple con la Ley 1581 de 2012 de Protección de Datos Personales 
                de Colombia y el Reglamento General de Protección de Datos (RGPD) de la Unión Europea, 
                cuando aplique.
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

export default PoliticaPrivacidad;

