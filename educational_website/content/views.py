from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request,'home.html')

def english(request):
    return render(request,'english/english.html')

def hindi(request):
    return render(request,'hindi/hindi.html')