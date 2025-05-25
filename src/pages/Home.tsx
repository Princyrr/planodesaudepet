import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Shield, Stethoscope, Clock, Calendar, Award, HeartPulse } from 'lucide-react';

function Home() {
  const { availablePlans } = useSubscription();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-500 to-purple-600 text-white py-20 md:py-32">
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-contain bg-right-top bg-no-repeat opacity-20"
               style={{ backgroundImage: 'url(https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg)' }}></div>
        </div>
        <div className="container-custom mx-auto relative z-10">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Saúde e bem-estar para seu melhor amigo</h1>
            <p className="text-xl mb-8">
              Planos de saúde completos para cuidar do seu pet com o melhor atendimento veterinário, exames e muito mais.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/plans" className="btn bg-white text-teal-700 hover:bg-gray-100">
                Conheça nossos planos
              </Link>
              <Link to="/signup" className="btn bg-purple-700 text-white hover:bg-purple-800">
                Cadastre-se agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a PetCare?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Oferecemos planos completos e flexíveis para garantir o melhor cuidado para seu pet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-teal-500">
                <Shield size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cobertura Completa</h3>
              <p className="text-gray-600">
                Consultas, exames e procedimentos com os melhores profissionais e clínicas parceiras.
              </p>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-teal-500">
                <Stethoscope size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profissionais Qualificados</h3>
              <p className="text-gray-600">
                Equipe de veterinários especialistas, prontos para cuidar do seu pet com excelência.
              </p>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-teal-500">
                <Clock size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Atendimento 24h</h3>
              <p className="text-gray-600">
                Suporte e atendimento de emergência disponíveis 24 horas por dia, 7 dias por semana.
              </p>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-teal-500">
                <Calendar size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Agendamento Online</h3>
              <p className="text-gray-600">
                Marque consultas e exames de forma rápida e prática pelo nosso sistema online.
              </p>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-teal-500">
                <Award size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Planos Flexíveis</h3>
              <p className="text-gray-600">
                Diferentes opções de planos para atender às necessidades específicas do seu pet.
              </p>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-teal-500">
                <HeartPulse size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cuidado Preventivo</h3>
              <p className="text-gray-600">
                Foco em prevenção para garantir uma vida longa e saudável para seu companheiro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nossos Planos</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal para o seu pet e comece a garantir a melhor saúde para ele
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {availablePlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`card border-2 ${plan.id === 'premium' ? 'border-orange-500 transform hover:-translate-y-2' : plan.id === 'intermediate' ? 'border-purple-500 transform hover:-translate-y-1' : 'border-teal-500'} hover:shadow-xl transition-all duration-300`}
              >
                <div className={`${plan.colorClass} px-6 py-4`}>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm">{plan.description}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4 text-center">
                    <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/signup"
                    className={`block text-center btn ${
                      plan.id === 'premium' 
                        ? 'btn-accent' 
                        : plan.id === 'intermediate' 
                          ? 'btn-secondary' 
                          : 'btn-primary'
                    }`}
                  >
                    Assinar agora
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Veja os depoimentos de quem já cuida dos seus pets conosco
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
                  alt="Cliente" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Ana Silva</h4>
                  <p className="text-sm text-gray-500">Plano Premium</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "O atendimento é excelente! Meu cachorro Thor recebe o melhor tratamento e a equipe é super atenciosa. Recomendo demais!"
              </p>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                  alt="Cliente" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Carlos Mendes</h4>
                  <p className="text-sm text-gray-500">Plano Intermediário</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Minha gata teve um problema de saúde e o atendimento foi rápido e eficiente. O plano cobriu todos os exames e ela já está 100% recuperada."
              </p>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                  alt="Cliente" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Juliana Costa</h4>
                  <p className="text-sm text-gray-500">Plano Básico</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Ótimo custo-benefício! Mesmo no plano básico tenho acesso a excelentes veterinários e os descontos em exames são muito bons."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-teal-500 text-white">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para cuidar melhor do seu pet?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Garanta já a saúde e bem-estar do seu melhor amigo com nossos planos de saúde premium.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/plans" className="btn bg-white text-purple-700 hover:bg-gray-100">
              Ver detalhes dos planos
            </Link>
            <Link to="/signup" className="btn bg-purple-800 text-white hover:bg-purple-900">
              Cadastre-se agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;