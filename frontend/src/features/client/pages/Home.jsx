import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BuildingStorefrontIcon,
  UserIcon,
  CalendarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Imágenes de salones de estética y barbería
  const salonImages = [
    "./home-1.jpg",
    "./home-2.jpg",
    "./home-3.jpg",
    "./home-4.jpg",
    "./home-5.jpg",
    "./home-6.jpg",
  ];

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === salonImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [salonImages.length]);

  const features = [
    {
      icon: CalendarIcon,
      title: "Reserva Fácil",
      description: "Agenda tu cita en segundos con nuestro sistema intuitivo",
    },
    {
      icon: BuildingStorefrontIcon,
      title: "Mejores Negocios",
      description: "Descubre los salones y spas más exclusivos de tu ciudad",
    },
    {
      icon: UserGroupIcon,
      title: "Profesionales Expertos",
      description: "Trabaja con los mejores estilistas y especialistas",
    },
    {
      icon: SparklesIcon,
      title: "Experiencia Premium",
      description: "Disfruta de un servicio de calidad excepcional",
    },
  ];

  const benefits = [
    "Reserva tu cita en cualquier momento del día",
    "Accede a descuentos exclusivos y promociones",
    "Califica y reseña tus experiencias",
    "Recibe recordatorios automáticos",
    "Cancela o reprograma sin complicaciones",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images with transitions */}
        {salonImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="backdrop-blur-md rounded-3xl p-12 border-white/10 shadow-2xl">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F5C76A] via-[#D1A04D] to-[#B47B1C] mb-6 font-serif tracking-wide">
              Glaminder
            </h1>
            <p className="text-2xl md:text-3xl text-[#F5F5F5] mb-8 font-light">
              Tu belleza, nuestra pasión
            </p>
            <p className="text-lg text-[#B0B3B8] mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubre los mejores salones de estética y barbería de tu ciudad.
              Reserva tu cita de manera fácil, rápida y segura.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-2xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-semibold text-lg"
              >
                <UserIcon className="w-6 h-6 mr-3" />
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-black/80 text-white rounded-2xl hover:bg-black/90 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-semibold text-lg border border-white/20"
              >
                <UserGroupIcon className="w-6 h-6 mr-3" />
                Registrarse
              </Link>
            </div>
          </div>
        </div>

        {/* Carrusel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-3">
            {salonImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-[#D1A04D] scale-125"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#1A1A1A] to-[#23262B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6">
              ¿Por qué elegir{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D1A04D] to-[#B47B1C]">
                Glaminder
              </span>
              ?
            </h2>
            <p className="text-xl text-[#B0B3B8] max-w-3xl mx-auto">
              Ofrecemos la mejor experiencia para reservar tus citas de belleza
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#2A2419] to-[#1F1A0F] backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:from-[#3A3429] hover:to-[#2F2A1F] transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#F5F5F5] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#B0B3B8] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#1A1A1A] to-[#23262B]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-8">
                ¿Qué hacemos?
              </h2>
              <p className="text-xl text-[#B0B3B8] mb-8 leading-relaxed">
                Glaminder es la plataforma líder que conecta a los amantes de la
                belleza con los mejores salones de estética y barbería de su
                ciudad. Simplificamos el proceso de reserva y garantizamos una
                experiencia excepcional.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="w-6 h-6 text-[#D1A04D] mr-4 flex-shrink-0" />
                    <span className="text-[#F5F5F5] text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-2xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-semibold text-lg"
                >
                  Comenzar Ahora
                  <ArrowRightIcon className="w-6 h-6 ml-3" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#2A2419] to-[#1F1A0F] rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <CalendarIcon className="w-24 h-24 text-[#D1A04D] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-[#F5F5F5] mb-2">
                      Reserva Inteligente
                    </h3>
                    <p className="text-[#B0B3B8]">
                      Sistema de citas automatizado y eficiente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F5C76A] via-[#D1A04D] to-[#B47B1C] mb-4 font-serif">
                Glaminder
              </h3>
              <p className="text-[#B0B3B8] text-lg leading-relaxed mb-6 max-w-md">
                La plataforma líder para reservar citas de belleza. Conectamos a
                los amantes de la estética con los mejores salones y
                profesionales de su ciudad.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold border border-white/20"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Registrarse
                </Link>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="text-xl font-bold text-[#F5F5F5] mb-6">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/login"
                    className="text-[#B0B3B8] hover:text-[#D1A04D] transition-colors duration-300"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-[#B0B3B8] hover:text-[#D1A04D] transition-colors duration-300"
                  >
                    Crear Cuenta
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cliente/propietario"
                    className="text-[#B0B3B8] hover:text-[#D1A04D] transition-colors duration-300"
                  >
                    Ser Propietario
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-[#B0B3B8] hover:text-[#D1A04D] transition-colors duration-300"
                  >
                    Características
                  </a>
                </li>
              </ul>
            </div>

            {/* Información de contacto */}
            <div>
              <h4 className="text-xl font-bold text-[#F5F5F5] mb-6">
                Contacto
              </h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center mr-3">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#F5F5F5] font-semibold">Horarios</p>
                    <p className="text-[#B0B3B8] text-sm">24/7 Disponible</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center mr-3">
                    <BuildingStorefrontIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#F5F5F5] font-semibold">Soporte</p>
                    <p className="text-[#B0B3B8] text-sm">
                      soporte@glaminder.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center mr-3">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#F5F5F5] font-semibold">Experiencia</p>
                    <p className="text-[#B0B3B8] text-sm">Premium & Segura</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-[#B0B3B8] text-sm mb-4 md:mb-0">
                © 2025 Glaminder. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-[#B0B3B8] hover:text-[#D1A04D] transition-colors duration-300 text-sm"
                >
                  Términos de Servicio
                </a>
                <a
                  href="#"
                  className="text-[#B0B3B8] hover:text-[#D1A04D] transition-colors duration-300 text-sm"
                >
                  Política de Privacidad
                </a>
                <a
                  href="#"
                  className="text-[#B0B3B8] hover:text-[#D1A04D] transition-colors duration-300 text-sm"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
