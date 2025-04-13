from django.shortcuts import render
from .forms import QueryForm
from google import generativeai as genai
from django.http import JsonResponse

genai.configure(api_key="AIzaSyBLcHKg7-Lbr3OzwfNd3Zubj0hbWuruv-Y")

def talk(request):
    if request.method == 'POST':
        form = QueryForm(request.POST)
        if form.is_valid():
            question = form.cleaned_data['question']

            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction="I am building a chatbot for visually impaired kids so they can learn basic language speaking skills by talking with you."
            )

            response = model.generate_content(
                contents=question,
                generation_config={
                    "max_output_tokens": 100,
                    "temperature": 1
                }
            )

            response_text = response.text

            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'response': response_text})
            
            return render(request, 'bot.html', {
                'form': form,
                'response': response_text
            })

    return render(request, 'bot.html', {'form': QueryForm()})
