import { Clock, Server, Code, Settings, Globe, Mic } from 'lucide-react';

export default function DemoBuild() {
  const timeline = [
    {
      hour: 'Hour 1',
      title: 'Infrastructure Setup',
      icon: Server,
      items: [
        'Set up Dedalus Labs MCP servers for 3 agent types',
        'Configure API endpoints for agent communication',
        'Create basic orchestration layer'
      ]
    },
    {
      hour: 'Hour 2',
      title: 'Agent Development',
      icon: Code,
      items: [
        'Permit Agent: Processes building permits using Random Labs for code generation',
        'Business License Agent: Verifies companies via CrustData APIs',
        'Citizen Service Agent: Handles inquiries in Japanese/English via Shisa AI'
      ]
    },
    {
      hour: 'Hour 3',
      title: 'Integration & Workflow',
      icon: Settings,
      items: [
        'Connect agents through Dedalus infrastructure',
        'Add Lingo.dev for real-time translation',
        'Implement CrustData for data enrichment',
        'Create voice interface with Shisa AI'
      ]
    },
    {
      hour: 'Hour 4',
      title: 'Demo Preparation',
      icon: Globe,
      items: [
        'Build simple web interface',
        'Create 3 live demos:',
        '• Business license application with auto-verification',
        '• Multi-language permit processing',
        '• Voice-based service inquiry in Japanese'
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Clock className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            The 4-Hour Demo Build
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transforming government services with AI agents in just 4 hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timeline.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.hour}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {step.hour}
                    </h3>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {step.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}