import { Play, Users, TrendingUp, Globe, Clock, CheckCircle } from 'lucide-react';

export default function DemoScenarios() {
  const scenarios = [
    {
      title: 'Demo 1: "Tokyo Restaurant Permit in 30 Seconds"',
      icon: Clock,
      duration: '30 seconds',
      items: [
        'User speaks in Japanese via Shisa AI',
        'System translates request, verifies business via CrustData',
        'Auto-generates compliance code via Random Labs',
        'Issues digital permit'
      ],
      highlight: 'Complete end-to-end permit processing'
    },
    {
      title: 'Demo 2: "Multi-Department Coordination"',
      icon: Users,
      duration: 'Real-time',
      items: [
        'Show multiple agents working together',
        'Building permit triggers health inspection scheduling',
        'Automatic translation for foreign business owners',
        'Real-time status updates'
      ],
      highlight: 'Seamless inter-agency collaboration'
    },
    {
      title: 'Demo 3: "Scaling Government Efficiency"',
      icon: TrendingUp,
      duration: 'Continuous',
      items: [
        'Dashboard showing 100x speed improvement',
        'Cost reduction metrics',
        'Multi-language support stats',
        'Agent performance analytics'
      ],
      highlight: 'Measurable efficiency gains'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Play className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            The Demo Scenarios
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See our AI agents in action with real-world government service scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {scenarios.map((scenario, index) => {
            const Icon = scenario.icon;
            return (
              <div
                key={scenario.title}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {scenario.duration}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {scenario.title}
                </h3>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-6 border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    {scenario.highlight}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {scenario.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Globe className="h-4 w-4 mr-1" />
                    Live Demo
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    Ready to Try
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-medium">
            <Play className="h-5 w-5 mr-2" />
            Experience the Future of Government Services
          </div>
        </div>
      </div>
    </section>
  );
}