import json
import urllib.request
import urllib.parse
import urllib.error
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import VoiceSession

# Add API credentials to settings or use environment variables
API_KEY = "VZZqx4ocVD7kQYfQ"  # You'll need to obtain this from the service you choose

def index(request):
    """Render the main page"""
    return render(request, 'voice_grammar/index.html')

@csrf_exempt
def process_text(request):
    """Process text and correct grammar using external API"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            original_text = data.get('text', '')
            
            # Call external grammar checking API
            corrected_text = grammar_check_api(original_text)
            
            # Save the session
            session = VoiceSession.objects.create(
                original_text=original_text,
                corrected_text=corrected_text
            )
            
            return JsonResponse({
                'success': True,
                'session_id': session.id,
                'original_text': original_text,
                'corrected_text': corrected_text
            })
                
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})

def grammar_check_api(text):
    """Call TextGears API for grammar checking"""
    try:
        base_url = "https://api.textgears.com/grammar"
        query_params = urllib.parse.urlencode({
            'text': text,
            'language': 'en-US',
            'key': API_KEY
        })
        
        url = f"{base_url}?{query_params}"
        
        req = urllib.request.Request(url)
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if result.get('status') and result.get('response'):
                corrected_text = text
                offset_adjustment = 0
                
                for error in sorted(result['response'].get('errors', []), key=lambda x: x['offset']):
                    from_pos = error['offset'] + offset_adjustment
                    to_pos = from_pos + error['length']
                    
                    if error.get('better') and len(error['better']) > 0:
                        replacement = error['better'][0]
                        
                        corrected_text = corrected_text[:from_pos] + replacement + corrected_text[to_pos:]
                        offset_adjustment += len(replacement) - error['length']
                
                return corrected_text
            
            return text
            
    except Exception as e:
        print(f"TextGears API error: {str(e)}")
        return text