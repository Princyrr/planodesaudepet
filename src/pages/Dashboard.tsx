import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePets } from '../contexts/PetContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAppointments } from '../contexts/AppointmentContext';
import { Calendar, Clock, CreditCard, AlertCircle, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Dashboard() {
  const { currentUser } = useAuth();
  const { pets } = usePets();
  const { currentSubscription, availablePlans } = useSubscription();
  const { getUpcomingAppointments, getDoctor, getLocation } = useAppointments();

  const upcomingAppointments = getUpcomingAppointments();
  const currentPlan = availablePlans.find(plan => plan.id === currentSubscription?.planId);

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-12 animate-fade-in">
      <div className="container-custom mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 md:p-8 mb-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Olá, {currentUser?.name}!</h1>
          <p className="text-teal-100">Bem-vindo ao seu painel de controle PetCare</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Appointment */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Próximo Agendamento</h2>
                <Link to="/schedule-appointment" className="text-sm text-teal-600 hover:text-teal-700 flex items-center">
                  <PlusCircle size={16} className="mr-1" />
                  Agendar
                </Link>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-100 p-3 rounded-lg mr-4">
                      <Calendar size={24} className="text-teal-700" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {pets.find(pet => pet.id === upcomingAppointments[0].petId)?.name || 'Seu pet'}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {getDoctor(upcomingAppointments[0].doctorId)?.name || 'Veterinário'} - {upcomingAppointments[0].type}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>
                          {format(new Date(upcomingAppointments[0].date), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {getLocation(upcomingAppointments[0].locationId)?.name} - {getLocation(upcomingAppointments[0].locationId)?.address}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmado
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={40} className="mx-auto mb-2 text-gray-400" />
                  <p>Você não tem agendamentos próximos</p>
                  <Link to="/schedule-appointment" className="btn-primary mt-4 inline-flex">
                    Agendar consulta
                  </Link>
                </div>
              )}

              {upcomingAppointments.length > 1 && (
                <div className="mt-4">
                  <Link to="/schedule-appointment" className="text-teal-600 hover:text-teal-700 text-sm">
                    Ver todos os {upcomingAppointments.length} agendamentos
                  </Link>
                </div>
              )}
            </div>

            {/* Pets */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Meus Pets</h2>
                <Link to="/pet-profile" className="text-sm text-teal-600 hover:text-teal-700 flex items-center">
                  <PlusCircle size={16} className="mr-1" />
                  Adicionar
                </Link>
              </div>

              {pets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div key={pet.id} className="border border-gray-100 rounded-lg p-4 flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        {pet.imageUrl ? (
                          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-700">
                            {pet.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pet.name}</p>
                        <p className="text-sm text-gray-600">{pet.species} • {pet.breed}</p>
                        <p className="text-xs text-gray-500">{pet.age} {pet.age === 1 ? 'ano' : 'anos'} • {pet.weight}kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Você ainda não adicionou nenhum pet</p>
                  <Link to="/pet-profile" className="btn-primary mt-4 inline-flex">
                    Adicionar pet
                  </Link>
                </div>
              )}

              {pets.length > 0 && (
                <div className="mt-4">
                  <Link to="/pet-profile" className="text-teal-600 hover:text-teal-700 text-sm">
                    Gerenciar pets
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Meu Plano</h2>

              {currentSubscription ? (
                <div>
                  <div className={`${currentPlan?.colorClass || 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                    <h3 className="font-bold text-lg">{currentPlan?.name || 'Plano'}</h3>
                    <p className="text-sm">{currentPlan?.description}</p>
                    <div className="mt-2 font-medium">
                      R$ {currentPlan?.price.toFixed(2)}/mês
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">Ativo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Próxima cobrança:</span>
                      <span className="font-medium">
                        {format(new Date(currentSubscription.endDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Método de pagamento:</span>
                      <span className="font-medium flex items-center">
                        <CreditCard size={14} className="mr-1" />
                        **** {currentSubscription.paymentMethod.lastFour}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Link to="/subscription" className="btn-outline w-full text-center text-sm">
                      Gerenciar plano
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <AlertCircle size={40} className="mx-auto mb-2 text-gray-400" />
                  <p>Você não possui um plano ativo</p>
                  <Link to="/plans" className="btn-primary mt-4 inline-flex">
                    Ver planos
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
              <div className="space-y-2">
                <Link to="/schedule-appointment" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors duration-200">
                  Agendar consulta
                </Link>
                <Link to="/subscription" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors duration-200">
                  Gerenciar assinatura
                </Link>
                <Link to="/pet-profile" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors duration-200">
                  Adicionar pet
                </Link>
                <Link to="/contact" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors duration-200">
                  Falar com atendimento
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;