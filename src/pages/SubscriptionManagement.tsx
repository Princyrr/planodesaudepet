import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription, PlanType } from '../contexts/SubscriptionContext';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

function SubscriptionManagement() {
  const navigate = useNavigate();
  const { availablePlans, currentSubscription, changePlan, cancelSubscription, updatePaymentMethod, loading } = useSubscription();
  
  const [selectedPlanId, setSelectedPlanId] = useState<PlanType | null>(
    currentSubscription ? currentSubscription.planId : null
  );
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const handleChangePlan = async () => {
    if (!selectedPlanId || selectedPlanId === currentSubscription?.planId) return;
    
    await changePlan(selectedPlanId);
    navigate('/dashboard');
  };
  
  const handleCancelSubscription = async () => {
    await cancelSubscription();
    setShowCancelConfirm(false);
    navigate('/dashboard');
  };
  
  const handleUpdatePayment = async () => {
    const lastFour = paymentDetails.cardNumber.slice(-4);
    
    await updatePaymentMethod({
      type: 'credit_card',
      lastFour
    });
    
    setShowPaymentForm(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-fade-in">
      <div className="container-custom mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Gerenciar Assinatura</h1>
          
          {/* Current Plan */}
          {currentSubscription && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Plano Atual</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className={`${availablePlans.find(p => p.id === currentSubscription.planId)?.colorClass || 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                    <h3 className="font-bold text-lg">{availablePlans.find(p => p.id === currentSubscription.planId)?.name}</h3>
                    <p className="text-sm">{availablePlans.find(p => p.id === currentSubscription.planId)?.description}</p>
                    <div className="mt-2 font-medium">
                      R$ {availablePlans.find(p => p.id === currentSubscription.planId)?.price.toFixed(2)}/mês
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">Ativo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Data de início:</span>
                      <span className="font-medium">
                        {new Date(currentSubscription.startDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Próxima cobrança:</span>
                      <span className="font-medium">
                        {new Date(currentSubscription.endDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium mb-2">Método de pagamento</h3>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 text-gray-700" size={20} />
                      <span>
                        {currentSubscription.paymentMethod.type === 'credit_card' ? 'Cartão de crédito' : 
                         currentSubscription.paymentMethod.type === 'debit_card' ? 'Cartão de débito' : 'Conta bancária'} 
                        terminando em {currentSubscription.paymentMethod.lastFour}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="btn-outline w-full text-center text-sm"
                      onClick={() => setShowPaymentForm(true)}
                    >
                      Atualizar método de pagamento
                    </button>
                    
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Cancelar assinatura
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Change Plan */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentSubscription ? 'Mudar de Plano' : 'Escolher Plano'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    selectedPlanId === plan.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    {selectedPlanId === plan.id && (
                      <CheckCircle className="text-teal-500" size={20} />
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                className="btn-primary"
                onClick={handleChangePlan}
                disabled={!selectedPlanId || (currentSubscription && selectedPlanId === currentSubscription.planId) || loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : currentSubscription ? (
                  'Mudar de Plano'
                ) : (
                  'Assinar Plano'
                )}
              </button>
            </div>
          </div>
          
          {/* Help Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Precisa de ajuda?</h2>
            <p className="text-gray-600 mb-4">
              Se você tiver dúvidas sobre sua assinatura, planos ou pagamentos, nossa equipe está disponível para ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate('/contact')}
              >
                Falar com Atendimento
              </button>
              <button
                type="button"
                className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => navigate('/faq')}
              >
                Perguntas Frequentes
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold">Cancelar assinatura?</h3>
              <p className="text-gray-600 mt-2">
                Você tem certeza que deseja cancelar sua assinatura? Você perderá acesso a todos os benefícios do plano.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <button
                type="button"
                className="btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500 sm:w-1/2"
                onClick={handleCancelSubscription}
              >
                Sim, cancelar
              </button>
              <button
                type="button"
                className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:w-1/2"
                onClick={() => setShowCancelConfirm(false)}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Atualizar método de pagamento</h3>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="label">Número do cartão</label>
                <input
                  type="text"
                  id="cardNumber"
                  className="input"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="cardName" className="label">Nome no cartão</label>
                <input
                  type="text"
                  id="cardName"
                  className="input"
                  placeholder="Nome como aparece no cartão"
                  value={paymentDetails.cardName}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="label">Data de validade</label>
                  <input
                    type="text"
                    id="expiryDate"
                    className="input"
                    placeholder="MM/AA"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="label">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    className="input"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4">
                <button
                  type="button"
                  className="btn-primary sm:w-1/2"
                  onClick={handleUpdatePayment}
                >
                  Atualizar
                </button>
                <button
                  type="button"
                  className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:w-1/2"
                  onClick={() => setShowPaymentForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionManagement;