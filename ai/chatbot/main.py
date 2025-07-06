import json
import random
import re
from typing import Dict, List, Any, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import optional dependencies
try:
    import nltk
    from nltk.tokenize import word_tokenize
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False
    print("Warning: NLTK not available, using fallback text processing")

try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    print("Warning: spaCy not available, using fallback similarity")

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("Warning: OpenAI not available, using fallback responses")

# Download required NLTK data if available
if NLTK_AVAILABLE:
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')

    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')

    try:
        nltk.data.find('corpora/wordnet')
    except LookupError:
        nltk.download('wordnet')

# Load spaCy model if available
if SPACY_AVAILABLE:
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        print("Downloading spaCy model...")
        os.system("python -m spacy download en_core_web_sm")
        nlp = spacy.load("en_core_web_sm")

# Configure OpenAI if available
if OPENAI_AVAILABLE:
    openai.api_key = os.getenv('OPENAI_API_KEY')

class PropertyChatbot:
    def __init__(self):
        if NLTK_AVAILABLE:
            self.lemmatizer = WordNetLemmatizer()
            self.stop_words = set(stopwords.words('english'))
        else:
            self.lemmatizer = None
            self.stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
        
        self.intents = self.load_intents()
        self.context: Dict[str, Any] = {}
        
    def load_intents(self) -> Dict[str, Any]:
        """Load intents from JSON file"""
        try:
            with open('intents.json', 'r', encoding='utf-8') as file:
                return json.load(file)
        except FileNotFoundError:
            print("Warning: intents.json not found, using default intents")
            return self.get_default_intents()
    
    def get_default_intents(self) -> Dict[str, Any]:
        """Default intents for property chatbot"""
        return {
            "intents": [
                {
                    "tag": "greeting",
                    "patterns": [
                        "hello", "hi", "hey", "good morning", "good afternoon",
                        "good evening", "how are you", "what's up"
                    ],
                    "responses": [
                        "Hello! I'm your PropertyConnect assistant. How can I help you today?",
                        "Hi there! Looking for properties? I'm here to help!",
                        "Hey! Welcome to PropertyConnect. What can I assist you with?"
                    ]
                },
                {
                    "tag": "property_search",
                    "patterns": [
                        "I want to buy a house", "looking for properties", "find a home",
                        "search for houses", "property listings", "real estate",
                        "houses for sale", "apartments for rent"
                    ],
                    "responses": [
                        "Great! I can help you find properties. What's your budget and preferred location?",
                        "Perfect! Let's find you the right property. What area are you interested in?",
                        "I'd be happy to help you search for properties. What type of property are you looking for?"
                    ]
                },
                {
                    "tag": "price_inquiry",
                    "patterns": [
                        "how much", "what's the price", "cost", "budget",
                        "expensive", "cheap", "affordable", "price range"
                    ],
                    "responses": [
                        "Property prices vary by location and type. What's your budget range?",
                        "I can help you find properties within your budget. What price range are you considering?",
                        "Let me know your budget and I'll show you suitable properties."
                    ]
                },
                {
                    "tag": "location_inquiry",
                    "patterns": [
                        "where", "location", "area", "neighborhood", "city",
                        "district", "suburb", "downtown", "uptown"
                    ],
                    "responses": [
                        "What area are you interested in? I can help you explore different neighborhoods.",
                        "Location is key! Which city or area would you like to focus on?",
                        "I can show you properties in various locations. Where would you like to look?"
                    ]
                },
                {
                    "tag": "property_type",
                    "patterns": [
                        "house", "apartment", "condo", "townhouse", "villa",
                        "studio", "penthouse", "duplex", "single family"
                    ],
                    "responses": [
                        "What type of property are you looking for? Houses, apartments, condos?",
                        "I can help you find various property types. What's your preference?",
                        "Different property types have different benefits. What interests you?"
                    ]
                },
                {
                    "tag": "agent_inquiry",
                    "patterns": [
                        "agent", "realtor", "broker", "contact agent", "speak to agent",
                        "professional help", "expert advice"
                    ],
                    "responses": [
                        "I can connect you with our professional agents. Would you like to speak with one?",
                        "Our agents are experts in the local market. Should I arrange a consultation?",
                        "Professional guidance can be very helpful. Would you like to talk to an agent?"
                    ]
                },
                {
                    "tag": "market_info",
                    "patterns": [
                        "market", "trends", "prices going up", "market analysis",
                        "investment", "market value", "appreciation"
                    ],
                    "responses": [
                        "I can provide market insights and trends for different areas. What location interests you?",
                        "Market analysis is important for investment decisions. Which area would you like to know about?",
                        "I have access to current market data. What specific information are you looking for?"
                    ]
                },
                {
                    "tag": "viewing_request",
                    "patterns": [
                        "view", "visit", "tour", "see the property", "schedule viewing",
                        "property tour", "open house", "inspection"
                    ],
                    "responses": [
                        "I can help you schedule property viewings. Which property interests you?",
                        "Property viewings are essential! Let me help you arrange a tour.",
                        "Seeing properties in person is important. Would you like to schedule a viewing?"
                    ]
                },
                {
                    "tag": "financing",
                    "patterns": [
                        "mortgage", "loan", "financing", "down payment", "interest rate",
                        "payment", "afford", "credit", "pre-approval"
                    ],
                    "responses": [
                        "I can help you understand financing options and connect you with mortgage experts.",
                        "Financing is a crucial part of buying property. Would you like information about mortgages?",
                        "I can provide guidance on financing options and help you get pre-approved."
                    ]
                },
                {
                    "tag": "goodbye",
                    "patterns": [
                        "bye", "goodbye", "see you", "thank you", "thanks",
                        "that's all", "end", "exit"
                    ],
                    "responses": [
                        "Thank you for using PropertyConnect! Feel free to return anytime.",
                        "Goodbye! I'm here whenever you need help with properties.",
                        "Thanks for chatting! Have a great day and good luck with your property search!"
                    ]
                }
            ]
        }
    
    def preprocess_text(self, text: str) -> List[str]:
        """Preprocess text for intent matching"""
        # Convert to lowercase
        text = text.lower()
        
        if NLTK_AVAILABLE:
            # Tokenize
            tokens = word_tokenize(text)
            
            # Remove stop words and lemmatize
            processed_tokens = []
            for token in tokens:
                if token not in self.stop_words and token.isalnum():
                    lemmatized = self.lemmatizer.lemmatize(token)
                    processed_tokens.append(lemmatized)
        else:
            # Fallback processing
            tokens = text.split()
            processed_tokens = [token for token in tokens if token not in self.stop_words and token.isalnum()]
        
        return processed_tokens
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts"""
        if SPACY_AVAILABLE:
            doc1 = nlp(text1.lower())
            doc2 = nlp(text2.lower())
            return doc1.similarity(doc2)
        else:
            # Fallback similarity using word overlap
            words1 = set(text1.lower().split())
            words2 = set(text2.lower().split())
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            return len(intersection) / len(union) if union else 0.0
    
    def find_best_intent(self, user_input: str) -> Optional[Dict[str, Any]]:
        """Find the best matching intent"""
        processed_input = self.preprocess_text(user_input)
        best_match = None
        highest_score = 0
        
        for intent in self.intents["intents"]:
            for pattern in intent["patterns"]:
                processed_pattern = self.preprocess_text(pattern)
                
                # Calculate similarity using multiple methods
                # 1. Token overlap
                overlap = len(set(processed_input) & set(processed_pattern))
                overlap_score = overlap / max(len(processed_input), len(processed_pattern)) if processed_input and processed_pattern else 0
                
                # 2. spaCy similarity
                similarity_score = self.calculate_similarity(user_input, pattern)
                
                # 3. Exact match bonus
                exact_match_bonus = 1.0 if user_input.lower() == pattern.lower() else 0.0
                
                # Combined score
                total_score = (overlap_score * 0.4 + similarity_score * 0.5 + exact_match_bonus * 0.1)
                
                if total_score > highest_score:
                    highest_score = total_score
                    best_match = intent
        
        return best_match if highest_score > 0.3 else None
    
    def get_response(self, intent: Dict[str, Any]) -> str:
        """Get a random response for the given intent"""
        responses = intent["responses"]
        return random.choice(responses)
    
    def generate_ai_response(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Generate AI-powered response using OpenAI"""
        if not OPENAI_AVAILABLE:
            return "I'm having trouble processing your request right now. Please try again later."
        
        try:
            system_prompt = """You are a helpful real estate assistant for PropertyConnect. 
            You help users find properties, understand market trends, and make informed decisions. 
            Be friendly, professional, and provide accurate information. Keep responses concise and helpful."""
            
            user_prompt = f"User context: {context or {}}\nUser message: {user_input}\n\nProvide a helpful response about real estate."
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"AI response generation failed: {e}")
            return "I'm having trouble processing your request right now. Please try again later."
    
    def process_message(self, user_input: str, use_ai: bool = False) -> str:
        """Process user message and return appropriate response"""
        if not user_input.strip():
            return "I didn't catch that. Could you please repeat?"
        
        # Find best matching intent
        intent = self.find_best_intent(user_input)
        
        if intent:
            # Update context
            self.context['last_intent'] = intent['tag']
            
            if use_ai:
                # Use AI to enhance the response
                base_response = self.get_response(intent)
                ai_response = self.generate_ai_response(user_input, self.context)
                return f"{base_response}\n\n{ai_response}"
            else:
                return self.get_response(intent)
        else:
            if use_ai:
                # Use AI for unknown intents
                return self.generate_ai_response(user_input, self.context)
            else:
                return "I'm not sure I understand. Could you rephrase that or ask about properties, prices, locations, or agents?"
    
    def reset_context(self) -> None:
        """Reset conversation context"""
        self.context = {}

def main():
    """Main function to run the chatbot"""
    chatbot = PropertyChatbot()
    
    print("PropertyConnect Chatbot")
    print("Type 'quit' to exit")
    print("-" * 30)
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("Chatbot: Goodbye! Thanks for using PropertyConnect!")
                break
            
            response = chatbot.process_message(user_input, use_ai=True)
            print(f"Chatbot: {response}")
            
        except KeyboardInterrupt:
            print("\nChatbot: Goodbye!")
            break
        except Exception as e:
            print(f"Chatbot: Sorry, I encountered an error: {e}")

if __name__ == "__main__":
    main()
