from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
import os
from dotenv import load_dotenv
import google.generativeai as genai
import requests

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

app = Flask(__name__)

# Scholarship and grants information database (simplified)
scholarship_info = {
    "undergraduate": [
        "Pell Grant: Federal grant for undergraduate students with financial need.",
        "Academic Competitive Grant: For first-year and second-year students who completed a rigorous high school program.",
        "SMART Grant: For third-year and fourth-year students in STEM fields.",
        "Federal SEOG: Supplemental Educational Opportunity Grant for students with exceptional financial need."
    ],
    "graduate": [
        "TEACH Grant: For students completing coursework to begin a teaching career.",
        "Fulbright Program: International exchange program for graduate students.",
        "NSF Graduate Research Fellowship: For graduate students in STEM fields.",
        "Ford Foundation Fellowship: For diverse Ph.D. students."
    ],
    "international": [
        "Chevening Scholarship: For international students to study in the UK.",
        "DAAD Scholarship: For international students to study in Germany.",
        "Fulbright Foreign Student Program: For international students to study in the US.",
        "Erasmus Mundus Joint Master Degree: For students to study in multiple European countries."
    ],
    "minorities": [
        "United Negro College Fund: For African American students.",
        "Hispanic Scholarship Fund: For Hispanic and Latino students.",
        "American Indian College Fund: For Native American students.",
        "Asian & Pacific Islander American Scholarship Fund: For Asian and Pacific Islander students."
    ]
}

def get_gemini_response(prompt):
    """Generate a response using Gemini API"""
    try:
        # System prompt to set context
        system_prompt = """You are a helpful academic advisor specializing in scholarships and grants for students. 
        Provide accurate, concise information about financial aid opportunities. Keep responses focused on educational 
        funding and under 200 words. Always be encouraging and professional."""
        
        # Generate response
        response = model.generate_content(
            [system_prompt, prompt]
        )
        
        return response.text
    except Exception as e:
        print(f"Error with Gemini API: {e}")
        return None

def get_response(user_message):
    """Generate a response based on the user's message"""
    user_message = user_message.lower()
    
    # Welcome message
    if any(word in user_message for word in ["hello", "hi", "hey", "start"]):
        return ("👋 Welcome to the Scholarship Bot! I can help you find scholarships and grants. "
                "Try asking about:\n\n"
                "• Undergraduate scholarships\n"
                "• Graduate scholarships\n"
                "• International scholarships\n"
                "• Scholarships for minorities\n"
                "• How to apply for scholarships\n"
                "• Scholarship deadlines\n"
                "\nOr type 'help' to see this menu again.")
    
    # Help command
    elif "help" in user_message:
        return ("I can provide information about:\n\n"
                "• Undergraduate scholarships\n"
                "• Graduate scholarships\n"
                "• International scholarships\n"
                "• Scholarships for minorities\n"
                "• Application processes\n"
                "• Deadlines\n"
                "\nJust ask me a question!")
    
    # Category specific responses
    elif "undergraduate" in user_message:
        return "Here are some undergraduate scholarships and grants:\n\n• " + "\n• ".join(scholarship_info["undergraduate"])
    
    elif "graduate" in user_message:
        return "Here are some graduate scholarships and grants:\n\n• " + "\n• ".join(scholarship_info["graduate"])
    
    elif "international" in user_message:
        return "Here are some scholarships for international students:\n\n• " + "\n• ".join(scholarship_info["international"])
    
    elif "minorities" in user_message or "minority" in user_message:
        return "Here are some scholarships for minority students:\n\n• " + "\n• ".join(scholarship_info["minorities"])
    
    # Application advice
    elif "apply" in user_message or "application" in user_message:
        return ("General application tips for scholarships:\n\n"
                "1. Start early and note all deadlines\n"
                "2. Prepare required documents (transcripts, letters of recommendation)\n"
                "3. Write a compelling personal statement\n"
                "4. Highlight your achievements and community service\n"
                "5. Apply to multiple scholarships to increase your chances")
    
    # Deadlines information
    elif "deadline" in user_message:
        return ("Most scholarship deadlines fall into these periods:\n\n"
                "• Fall scholarships: July - September\n"
                "• Spring scholarships: October - December\n"
                "• Summer scholarships: January - March\n\n"
                "Always check the specific deadlines for each scholarship you're interested in!")
    
    # Use Gemini API for other scholarship-related questions
    else:
        # First, check if the message is related to scholarships or grants
        if any(word in user_message for word in ["scholarship", "grant", "financial aid", "funding", "money", "education", "college", "university", "student", "loan"]):
            prompt = f"The user has asked about scholarships or grants with this message: '{user_message}'. Provide a helpful response about relevant scholarship or grant opportunities."
            gemini_response = get_gemini_response(prompt)
            
            # If Gemini response is available, use it
            if gemini_response:
                return gemini_response
        
        # Default response if not scholarship related or Gemini fails
        return ("I'm not sure I understand your question about scholarships. "
                "Try asking about undergraduate, graduate, or international scholarships, "
                "or type 'help' to see what I can assist with.")

@app.route('/webhook', methods=['POST'])
def webhook():
    # Get the incoming message
    incoming_msg = request.values.get('Body', '').strip()
    
    # Create Twilio response
    resp = MessagingResponse()
    
    # Add the response message
    resp.message(get_response(incoming_msg))
    
    return str(resp)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
