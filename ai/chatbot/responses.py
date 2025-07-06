"""
PropertyConnect Chatbot Responses Module
Contains predefined responses and response generation functions for the property chatbot
"""

import random
from typing import Dict, List, Any, Optional
from datetime import datetime

class ResponseGenerator:
    """Generates contextual responses for property-related queries"""
    
    def __init__(self):
        self.greetings = [
            "Hello! I'm your PropertyConnect assistant. How can I help you today?",
            "Hi there! Looking for properties? I'm here to help!",
            "Hey! Welcome to PropertyConnect. What can I assist you with?",
            "Good day! I'm here to help you find your perfect property.",
            "Welcome to PropertyConnect! How can I make your property search easier?"
        ]
        
        self.property_search_responses = [
            "Great! I can help you find properties. What's your budget and preferred location?",
            "Perfect! Let's find you the right property. What area are you interested in?",
            "I'd be happy to help you search for properties. What type of property are you looking for?",
            "Excellent! I can show you various properties. What's your price range?",
            "Let's find your dream property! What location are you considering?"
        ]
        
        self.price_responses = [
            "Property prices vary by location and type. What's your budget range?",
            "I can help you find properties within your budget. What price range are you considering?",
            "Let me know your budget and I'll show you suitable properties.",
            "Prices depend on location, size, and amenities. What's your target price?",
            "I can filter properties by price range. What's your budget?"
        ]
        
        self.location_responses = [
            "What area are you interested in? I can help you explore different neighborhoods.",
            "Location is key! Which city or area would you like to focus on?",
            "I can show you properties in various locations. Where would you like to look?",
            "Different areas have different advantages. What type of neighborhood appeals to you?",
            "I can help you compare different locations. What's important to you in a location?"
        ]
        
        self.property_type_responses = [
            "What type of property are you looking for? Houses, apartments, condos?",
            "I can help you find various property types. What's your preference?",
            "Different property types have different benefits. What interests you?",
            "Each property type has unique advantages. What fits your lifestyle?",
            "I can show you houses, condos, townhouses, and more. What appeals to you?"
        ]
        
        self.agent_responses = [
            "I can connect you with our professional agents. Would you like to speak with one?",
            "Our agents are experts in the local market. Should I arrange a consultation?",
            "Professional guidance can be very helpful. Would you like to talk to an agent?",
            "Our agents can provide valuable insights. Would you like to be contacted?",
            "I can schedule a call with a local expert. When would be convenient?"
        ]
        
        self.market_responses = [
            "I can provide market insights and trends for different areas. What location interests you?",
            "Market analysis is important for investment decisions. Which area would you like to know about?",
            "I have access to current market data. What specific information are you looking for?",
            "Market trends vary by location. Which area would you like to explore?",
            "I can help you understand local market conditions. What area interests you?"
        ]
        
        self.viewing_responses = [
            "I can help you schedule property viewings. Which property interests you?",
            "Property viewings are essential! Let me help you arrange a tour.",
            "Seeing properties in person is important. Would you like to schedule a viewing?",
            "I can coordinate property tours for you. Which property would you like to see?",
            "Viewings help you make informed decisions. Should I arrange a tour?"
        ]
        
        self.financing_responses = [
            "I can help you understand financing options and connect you with mortgage experts.",
            "Financing is a crucial part of buying property. Would you like information about mortgages?",
            "I can provide guidance on financing options and help you get pre-approved.",
            "Understanding financing is key. Would you like to learn about mortgage options?",
            "I can connect you with financing experts. Would you like more information?"
        ]
        
        self.goodbye_responses = [
            "Thank you for using PropertyConnect! Feel free to return anytime.",
            "Goodbye! I'm here whenever you need help with properties.",
            "Thanks for chatting! Have a great day and good luck with your property search!",
            "Take care! I'm here when you need property assistance.",
            "Goodbye! Best of luck with your property journey!"
        ]
        
        self.fallback_responses = [
            "I'm not sure I understand. Could you rephrase that or ask about properties, prices, locations, or agents?",
            "I didn't catch that. Could you ask about properties, financing, or market information?",
            "I'm here to help with property-related questions. What would you like to know?",
            "Could you clarify? I can help with property search, market info, or agent connections.",
            "I'm not following. Try asking about properties, prices, or locations."
        ]
    
    def get_greeting(self) -> str:
        """Get a random greeting response"""
        return random.choice(self.greetings)
    
    def get_property_search_response(self) -> str:
        """Get a random property search response"""
        return random.choice(self.property_search_responses)
    
    def get_price_response(self) -> str:
        """Get a random price-related response"""
        return random.choice(self.price_responses)
    
    def get_location_response(self) -> str:
        """Get a random location-related response"""
        return random.choice(self.location_responses)
    
    def get_property_type_response(self) -> str:
        """Get a random property type response"""
        return random.choice(self.property_type_responses)
    
    def get_agent_response(self) -> str:
        """Get a random agent-related response"""
        return random.choice(self.agent_responses)
    
    def get_market_response(self) -> str:
        """Get a random market-related response"""
        return random.choice(self.market_responses)
    
    def get_viewing_response(self) -> str:
        """Get a random viewing-related response"""
        return random.choice(self.viewing_responses)
    
    def get_financing_response(self) -> str:
        """Get a random financing-related response"""
        return random.choice(self.financing_responses)
    
    def get_goodbye(self) -> str:
        """Get a random goodbye response"""
        return random.choice(self.goodbye_responses)
    
    def get_fallback(self) -> str:
        """Get a random fallback response"""
        return random.choice(self.fallback_responses)
    
    def generate_contextual_response(self, intent: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Generate a contextual response based on intent and context"""
        base_response = self.get_response_by_intent(intent)
        
        if context:
            # Add contextual information
            if 'user_name' in context:
                base_response = f"Hi {context['user_name']}! " + base_response
            
            if 'last_property' in context:
                base_response += f"\n\nI noticed you were looking at {context['last_property']} recently."
            
            if 'budget' in context:
                base_response += f"\n\nBased on your budget of ${context['budget']:,}, I can show you suitable options."
        
        return base_response
    
    def get_response_by_intent(self, intent: str) -> str:
        """Get response based on intent tag"""
        intent_responses = {
            'greeting': self.get_greeting,
            'property_search': self.get_property_search_response,
            'price_inquiry': self.get_price_response,
            'location_inquiry': self.get_location_response,
            'property_type': self.get_property_type_response,
            'agent_inquiry': self.get_agent_response,
            'market_info': self.get_market_response,
            'viewing_request': self.get_viewing_response,
            'financing': self.get_financing_response,
            'goodbye': self.get_goodbye
        }
        
        return intent_responses.get(intent, self.get_fallback)()
    
    def generate_property_recommendation(self, preferences: Dict[str, Any]) -> str:
        """Generate a property recommendation based on user preferences"""
        response = "Based on your preferences, here are some recommendations:\n\n"
        
        if 'budget' in preferences:
            response += f"• Budget: ${preferences['budget']:,}\n"
        
        if 'location' in preferences:
            response += f"• Location: {preferences['location']}\n"
        
        if 'property_type' in preferences:
            response += f"• Property Type: {preferences['property_type']}\n"
        
        if 'bedrooms' in preferences:
            response += f"• Bedrooms: {preferences['bedrooms']}+\n"
        
        response += "\nI can show you properties that match these criteria. Would you like to see them?"
        
        return response
    
    def generate_market_insight(self, location: str, data: Optional[Dict[str, Any]] = None) -> str:
        """Generate market insight response"""
        response = f"Here's what I know about the {location} market:\n\n"
        
        if data:
            if 'avg_price' in data:
                response += f"• Average Price: ${data['avg_price']:,}\n"
            
            if 'trend' in data:
                response += f"• Market Trend: {data['trend']}\n"
            
            if 'days_on_market' in data:
                response += f"• Average Days on Market: {data['days_on_market']}\n"
            
            if 'inventory' in data:
                response += f"• Available Properties: {data['inventory']}\n"
        else:
            response += "• Market conditions vary by neighborhood\n"
            response += "• Prices are influenced by location and property type\n"
            response += "• I can provide specific data for areas you're interested in\n"
        
        response += "\nWould you like more detailed information about specific areas?"
        
        return response
    
    def generate_financing_info(self, budget: Optional[float] = None) -> str:
        """Generate financing information response"""
        response = "Here's some helpful financing information:\n\n"
        
        if budget:
            down_payment = budget * 0.20  # 20% down payment
            monthly_payment = (budget - down_payment) * 0.005  # Rough estimate
            
            response += f"• For a ${budget:,} property:\n"
            response += f"  - Down Payment: ${down_payment:,.0f}\n"
            response += f"  - Estimated Monthly Payment: ${monthly_payment:,.0f}\n\n"
        
        response += "• Typical down payments range from 3.5% to 20%\n"
        response += "• Credit score affects interest rates\n"
        response += "• Pre-approval helps with offers\n\n"
        
        response += "Would you like to speak with a mortgage expert?"
        
        return response
    
    def generate_viewing_schedule(self, property_info: Optional[Dict[str, Any]] = None) -> str:
        """Generate viewing schedule response"""
        response = "I can help you schedule a viewing!\n\n"
        
        if property_info:
            response += f"Property: {property_info.get('title', 'Selected Property')}\n"
            response += f"Address: {property_info.get('address', 'Address available')}\n"
            response += f"Price: ${property_info.get('price', 0):,}\n\n"
        
        response += "Available viewing times:\n"
        response += "• Weekdays: 9 AM - 6 PM\n"
        response += "• Weekends: 10 AM - 4 PM\n"
        response += "• Virtual tours available\n\n"
        
        response += "When would you like to schedule a viewing?"
        
        return response

# Global response generator instance
response_generator = ResponseGenerator()

def get_response(intent: str, context: Optional[Dict[str, Any]] = None) -> str:
    """Get a response for the given intent"""
    return response_generator.generate_contextual_response(intent, context)

def get_property_recommendation(preferences: Dict[str, Any]) -> str:
    """Get a property recommendation response"""
    return response_generator.generate_property_recommendation(preferences)

def get_market_insight(location: str, data: Optional[Dict[str, Any]] = None) -> str:
    """Get a market insight response"""
    return response_generator.generate_market_insight(location, data)

def get_financing_info(budget: Optional[float] = None) -> str:
    """Get financing information response"""
    return response_generator.generate_financing_info(budget)

def get_viewing_schedule(property_info: Optional[Dict[str, Any]] = None) -> str:
    """Get viewing schedule response"""
    return response_generator.generate_viewing_schedule(property_info)
