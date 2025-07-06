import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export const SupportHub: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Need Help?</h2>
      <p className="text-gray-600">Our support team is available 24/7.</p>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <span>Start a live chat (bottom right corner)</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <span>Email us: support@propertyconnect.com</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-blue-600" />
          <span>Call us: +1 (800) 123-4567</span>
        </div>
      </div>
    </div>
  );
};

export default SupportHub;