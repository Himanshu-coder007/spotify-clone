import React, { useState } from 'react';
import { FaCheck, FaSpotify } from 'react-icons/fa';

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);

  const plans = [
    {
      id: 'individual',
      title: 'Premium Individual',
      price: '₹119 for 2 months',
      monthlyAfter: '₹119 / month after',
      features: [
        'Ad-free music listening',
        'Download to listen offline',
        'Play songs in any order',
        'High audio quality',
        'Cancel anytime'
      ],
      popular: false,
      terms: '₹119 for 2 months, then ₹119 per month after. Offer only available if you haven\'t tried Premium before. Terms apply.'
    },
    {
      id: 'family',
      title: 'Premium Family',
      price: '₹179 for 2 months',
      monthlyAfter: '₹179 / month after',
      features: [
        'Up to 6 Premium accounts',
        'Block explicit music',
        'Ad-free music listening',
        'Download to listen offline',
        'Play songs in any order',
        'High audio quality',
        'Cancel anytime'
      ],
      popular: true,
      terms: '₹179 for 2 months, then ₹179 per month after. Offer only available if you haven\'t tried Premium before. For up to 6 family members residing at the same address. Terms apply.'
    },
    {
      id: 'duo',
      title: 'Premium Duo',
      price: '₹149 for 2 months',
      monthlyAfter: '₹149 / month after',
      features: [
        '2 Premium accounts',
        'Ad-free music listening',
        'Download to listen offline',
        'Play songs in any order',
        'High audio quality',
        'Cancel anytime'
      ],
      popular: false,
      terms: '₹149 for 2 months, then ₹149 per month after. Offer only available if you haven\'t tried Premium before. For couples who reside at the same address. Terms apply.'
    },
    {
      id: 'student',
      title: 'Premium Student',
      price: '₹59 for 2 months',
      monthlyAfter: '₹59 / month after',
      features: [
        'Special discount for students',
        'Ad-free music listening',
        'Download to listen offline',
        'Play songs in any order',
        'High audio quality',
        'Cancel anytime'
      ],
      popular: false,
      terms: '₹59 for 2 months, then ₹59 per month after. Offer available only to students at an accredited higher education institution and if you haven\'t tried Premium before. Terms apply.'
    }
  ];

  const allFeatures = [
    'Ad-free music listening',
    'Download to listen offline',
    'Play songs in any order',
    'High audio quality',
    'Listen with friends in real time',
    'Organize listening queue',
    'Listening insights'
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const toggleExpandPlan = (planId) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const handleGetStarted = () => {
    if (selectedPlan) {
      const plan = plans.find(p => p.id === selectedPlan);
      alert(`Redirecting to payment for ${plan.title}`);
      // In a real app: navigate('/payment', { state: { plan } });
    } else {
      alert('Please select a plan first');
    }
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1db954] to-[#121212] pb-20 pt-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <FaSpotify className="text-5xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Listen without limits.</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Try 2 months of Premium for ₹119.</h2>
          <p className="text-xl mb-6">Only ₹119/month after. Cancel anytime.</p>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            ₹119 for 2 months, then ₹119 per month after. Offer only available if you haven't tried Premium before. Terms apply.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-black hover:bg-gray-900 text-white font-bold py-4 px-12 rounded-full text-lg transition duration-300"
          >
            GET STARTED
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        {/* Plans Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Choose your Premium plan</h2>
          <p className="text-gray-400 mb-8 max-w-3xl">
            Get started with 2 months free. Enjoy ad-free music, offline listening, and more. Cancel anytime.
          </p>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-[#181818] rounded-lg transition-all duration-300 overflow-hidden h-full flex flex-col ${
                  selectedPlan === plan.id
                    ? 'ring-2 ring-green-500 shadow-lg'
                    : 'hover:ring-1 hover:ring-gray-600'
                } ${plan.popular ? 'border-t-4 border-green-500' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-green-500 text-black text-xs font-bold text-center py-1">
                    MOST POPULAR
                  </div>
                )}
               
                <div className="p-6 flex-grow">
                  <div className="mb-4">
                    <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">
                      {plan.price}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-gray-400 mb-4">{plan.monthlyAfter}</p>
                 
                  <ul className="mb-6 space-y-3">
                    {plan.features.slice(0, expandedPlan === plan.id ? plan.features.length : 3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.features.length > 3 && (
                    <button
                      onClick={() => toggleExpandPlan(plan.id)}
                      className="text-green-500 text-sm mb-4 hover:underline"
                    >
                      {expandedPlan === plan.id ? 'Show less' : `+${plan.features.length - 3} more`}
                    </button>
                  )}
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full font-bold py-3 px-4 rounded-full transition duration-300 ${
                      selectedPlan === plan.id
                        ? 'bg-green-500 text-black shadow-md'
                        : 'bg-white hover:bg-gray-200 text-black'
                    }`}
                  >
                    {selectedPlan === plan.id ? '✓ Selected' : 'Select plan'}
                  </button>
                  <p className="text-xs text-gray-400 mt-4">{plan.terms}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16 bg-[#181818] p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-8">All Premium plans include:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="text-center py-12">
          <div className="bg-[#181818] p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-6">
              {selectedPlan
                ? `Ready for ${plans.find(p => p.id === selectedPlan)?.title}?`
                : 'Ready to experience Premium?'}
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              {selectedPlan
                ? 'Continue to payment and start your Premium experience today.'
                : 'Select a plan to enjoy ad-free music, offline listening, and more.'}
            </p>
            <button
              onClick={handleGetStarted}
              className={`font-bold py-4 px-12 rounded-full text-lg transition duration-300 ${
                selectedPlan
                  ? 'bg-green-500 hover:bg-green-600 text-black'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!selectedPlan}
            >
              {selectedPlan ? 'CONTINUE TO PAYMENT' : 'SELECT A PLAN FIRST'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Premium;