from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI
import redis
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI client
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

# Configure Redis
redis_client = redis.Redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379'))

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'ai-service'
    })

@app.route('/api/analyze-property', methods=['POST'])
def analyze_property():
    """Analyze property data and provide insights"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        property_data = data.get('property', {})
        
        # Create analysis prompt
        prompt = f"""
        Analyze the following property and provide market insights:
        
        Property Details:
        - Type: {property_data.get('type', 'Unknown')}
        - Price: ${property_data.get('price', 0):,}
        - Location: {property_data.get('address', 'Unknown')}
        - Bedrooms: {property_data.get('bedrooms', 'Unknown')}
        - Bathrooms: {property_data.get('bathrooms', 'Unknown')}
        - Area: {property_data.get('area', 'Unknown')} sqft
        
        Please provide:
        1. Market analysis
        2. Price comparison
        3. Investment potential
        4. Neighborhood insights
        5. Recommendations
        """
        
        # Get AI analysis using new OpenAI client
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a real estate market analyst. Provide detailed, professional analysis of properties."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        analysis = response.choices[0].message.content
        
        # Cache the analysis
        cache_key = f"property_analysis:{property_data.get('id', 'unknown')}"
        redis_client.setex(cache_key, 3600, json.dumps({
            'analysis': analysis,
            'timestamp': datetime.utcnow().isoformat()
        }))
        
        return jsonify({
            'success': True,
            'data': {
                'analysis': analysis,
                'property_id': property_data.get('id'),
                'timestamp': datetime.utcnow().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages with AI"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        context = data.get('context', {})
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Create context-aware prompt
        system_prompt = """You are a helpful real estate assistant. You help users find properties, understand market trends, and make informed decisions. Be friendly, professional, and provide accurate information."""
        
        user_prompt = f"""
        User Context: {context}
        User Message: {message}
        
        Please provide a helpful response about real estate.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'data': {
                'response': ai_response,
                'timestamp': datetime.utcnow().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/market-insights', methods=['GET'])
def market_insights():
    """Get market insights for a location"""
    try:
        location = request.args.get('location', '')
        
        if not location:
            return jsonify({'error': 'Location parameter required'}), 400
        
        # Check cache first
        cache_key = f"market_insights:{location.lower().replace(' ', '_')}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return jsonify(json.loads(cached_data))
        
        # Generate market insights
        prompt = f"""
        Provide market insights for {location}:
        
        1. Current market trends
        2. Average property prices
        3. Market demand
        4. Investment opportunities
        5. Future outlook
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a real estate market analyst. Provide detailed market insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        insights = response.choices[0].message.content
        
        result = {
            'success': True,
            'data': {
                'location': location,
                'insights': insights,
                'timestamp': datetime.utcnow().isoformat()
            }
        }
        
        # Cache the insights for 24 hours
        redis_client.setex(cache_key, 86400, json.dumps(result))
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/property-recommendations', methods=['POST'])
def property_recommendations():
    """Get personalized property recommendations"""
    try:
        data = request.get_json()
        user_preferences = data.get('preferences', {})
        
        prompt = f"""
        Based on these user preferences, provide property recommendations:
        
        Preferences:
        - Budget: ${user_preferences.get('budget', 'Not specified')}
        - Location: {user_preferences.get('location', 'Not specified')}
        - Property Type: {user_preferences.get('propertyType', 'Not specified')}
        - Bedrooms: {user_preferences.get('bedrooms', 'Not specified')}
        - Bathrooms: {user_preferences.get('bathrooms', 'Not specified')}
        
        Please provide:
        1. Recommended property types
        2. Suggested locations
        3. Price range recommendations
        4. Key features to look for
        5. Investment tips
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a real estate advisor. Provide personalized property recommendations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        recommendations = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'data': {
                'recommendations': recommendations,
                'timestamp': datetime.utcnow().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/property-valuation', methods=['POST'])
def property_valuation():
    """Get AI-powered property valuation"""
    try:
        data = request.get_json()
        property_data = data.get('property', {})
        
        if not property_data:
            return jsonify({'error': 'No property data provided'}), 400
        
        prompt = f"""
        Provide a detailed property valuation analysis for:
        
        Property Details:
        - Type: {property_data.get('type', 'Unknown')}
        - Location: {property_data.get('address', 'Unknown')}
        - Bedrooms: {property_data.get('bedrooms', 'Unknown')}
        - Bathrooms: {property_data.get('bathrooms', 'Unknown')}
        - Area: {property_data.get('area', 'Unknown')} sqft
        - Year Built: {property_data.get('yearBuilt', 'Unknown')}
        - Lot Size: {property_data.get('lotSize', 'Unknown')}
        - Amenities: {', '.join(property_data.get('amenities', []))}
        
        Please provide:
        1. Estimated market value range
        2. Factors affecting valuation
        3. Comparable properties analysis
        4. Market conditions impact
        5. Investment potential score (1-10)
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a certified property appraiser with expertise in real estate valuation."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        valuation = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'data': {
                'valuation': valuation,
                'property_id': property_data.get('id'),
                'timestamp': datetime.utcnow().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_ENV') == 'development')
