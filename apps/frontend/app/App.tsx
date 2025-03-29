"use client"
import React, { useEffect } from 'react';
import { Activity, Bell, Shield, Clock, ArrowRight, CheckCircle2} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'



function App() {
  const Router = useRouter();

  useEffect(() => {
    // This will only run in the browser, after the component mounts
    document.documentElement.classList.add('dark');
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
      

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Monitor Your Website &apos s Uptime with Confidence
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Get instant notifications when your website goes down. Monitor performance, uptime, and response times all in one place.
            </p>
            <div className="flex space-x-4">
              <button onClick={ ()=>Router.push("./Dashboard")} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition flex items-center">
                Start Monitoring
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition">
                View Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <Image
  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  alt="Dashboard"
  width={800}
  height={600}
  className="rounded-lg shadow-2xl dark:opacity-90"
/>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 dark:bg-gray-800/50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything you need to keep your website running
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
              <Bell className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Instant Alerts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get notified immediately when your website experiences downtime through email, SMS, or Slack.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
              <Shield className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">24/7 Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continuous monitoring from multiple locations worldwide to ensure your website&aposs availability.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
              <Clock className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Response Time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your website&aposs performance and get detailed insights about response times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Simple, transparent pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 dark:border-gray-700 p-8 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Starter</h3>
              <p className="text-4xl font-bold mb-6 dark:text-white">$29<span className="text-lg text-gray-600 dark:text-gray-400">/mo</span></p>
              <ul className="space-y-4 mb-8">
                {['5 websites', '1-minute checks', 'Email notifications', '24/7 support'].map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition">
                Get Started
              </button>
            </div>
            <div className="border-2 border-indigo-600 dark:border-indigo-500 p-8 rounded-lg relative dark:bg-gray-800">
              <div className="absolute top-0 right-0 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Professional</h3>
              <p className="text-4xl font-bold mb-6 dark:text-white">$79<span className="text-lg text-gray-600 dark:text-gray-400">/mo</span></p>
              <ul className="space-y-4 mb-8">
                {['20 websites', '30-second checks', 'SMS & email alerts', 'API access', 'Advanced reporting'].map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition">
                Get Started
              </button>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 p-8 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Enterprise</h3>
              <p className="text-4xl font-bold mb-6 dark:text-white">$199<span className="text-lg text-gray-600 dark:text-gray-400">/mo</span></p>
              <ul className="space-y-4 mb-8">
                {['Unlimited websites', '10-second checks', 'Priority support', 'Custom integrations', 'SLA guarantee'].map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Activity className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold">UptimeGuard</span>
              </div>
              <p className="text-gray-400">
                Keeping your websites online and performing at their best.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 UptimeGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
