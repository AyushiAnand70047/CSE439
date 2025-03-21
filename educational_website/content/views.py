from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request,'home.html')

def english(request):
    return render(request,'english/english.html')

def hindi(request):
    return render(request,'hindi/hindi.html')

def songs(request):
    songs = [
        {'name': 'ABC Song', 'source': "https://www.youtube.com/embed/kpy6QEAuLJw?si=UhYZPNxlv5_yR74X"},
        {'name': 'Numbers Song', 'source': "https://www.youtube.com/embed/JT0MmZcJ2Vw?si=nC39IBQSLWUBGAIa"},
        {'name': 'Hello Song', 'source': "https://www.youtube.com/embed/gghDRJVxFxU?si=Vt39NETDuidhKM_m"},
        {'name': 'ABC Song', 'source': "https://www.youtube.com/embed/kpy6QEAuLJw?si=UhYZPNxlv5_yR74X"},
        {'name': 'Numbers Song', 'source': "https://www.youtube.com/embed/JT0MmZcJ2Vw?si=nC39IBQSLWUBGAIa"},
        {'name': 'Hello Song', 'source': "https://www.youtube.com/embed/gghDRJVxFxU?si=Vt39NETDuidhKM_m"},
        {'name': 'ABC Song', 'source': "https://www.youtube.com/embed/kpy6QEAuLJw?si=UhYZPNxlv5_yR74X"},
        {'name': 'Numbers Song', 'source': "https://www.youtube.com/embed/JT0MmZcJ2Vw?si=nC39IBQSLWUBGAIa"},
        {'name': 'Hello Song', 'source': "https://www.youtube.com/embed/gghDRJVxFxU?si=Vt39NETDuidhKM_m"},
        {'name': 'ABC Song', 'source': "https://www.youtube.com/embed/kpy6QEAuLJw?si=UhYZPNxlv5_yR74X"},
        {'name': 'Numbers Song', 'source': "https://www.youtube.com/embed/JT0MmZcJ2Vw?si=nC39IBQSLWUBGAIa"},
        {'name': 'Hello Song', 'source': "https://www.youtube.com/embed/gghDRJVxFxU?si=Vt39NETDuidhKM_m"},
    ]
    return render(request,'english/songs.html',{'videos':songs})