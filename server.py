from flask import Flask, jsonify
import requests
import os

app = Flask(__name__)

# Replace with your actual Gemini API key
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyA5MCeq5mS0driJvgHjC6V7vZe7CRUso8o')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY

@app.route('/api/gemini-tips')
def get_gemini_tips():
    prompt = "Give me 4 short fitness tips for a healthy lifestyle."
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    try:
        response = requests.post(GEMINI_API_URL, json=data, headers=headers)
        response.raise_for_status()
        result = response.json()
        # Parse tips from Gemini response
        tips_text = result['candidates'][0]['content']['parts'][0]['text']
        tips = [tip.strip() for tip in tips_text.split('\n') if tip.strip()]
        return jsonify({"tips": tips})
    except Exception as e:
        return jsonify({"tips": ["Could not fetch tips."]}), 500

if __name__ == '__main__':
    app.run(debug=True)
