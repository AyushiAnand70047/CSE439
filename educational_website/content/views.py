from django.shortcuts import render
from django.contrib.auth.decorators import login_required


# Create your views here.
@login_required
def home(request):
    return render(request,'home.html')

@login_required
def alphabet(request):
    return render(request,'basics/alphabet.html')

@login_required
def number(request):
    return render(request,'basics/number.html')

@login_required
def table(request):
    return render(request,'basics/table.html')

# def english(request):
#     return render(request,'english/english.html')

# def hindi(request):
#     return render(request,'hindi/hindi.html')

# def songs(request):
#     songs = [
#         {'name': 'ABC Song', 'source': "https://www.youtube.com/embed/kpy6QEAuLJw?si=UhYZPNxlv5_yR74X"},
#         {'name': 'Numbers Song', 'source': "https://www.youtube.com/embed/JT0MmZcJ2Vw?si=nC39IBQSLWUBGAIa"},
#         {'name': 'Hello Song', 'source': "https://www.youtube.com/embed/gghDRJVxFxU?si=Vt39NETDuidhKM_m"},
#         {'name': 'ABC Song', 'source': "https://www.youtube.com/embed/kpy6QEAuLJw?si=UhYZPNxlv5_yR74X"},
#         {'name': 'Numbers Song', 'source': "https://www.youtube.com/embed/JT0MmZcJ2Vw?si=nC39IBQSLWUBGAIa"},
#         {'name': 'Hello Song', 'source': "https://www.youtube.com/embed/gghDRJVxFxU?si=Vt39NETDuidhKM_m"},
#         {'name': 'ABC Song', 'source': "https://www.youtube.com/embed/kpy6QEAuLJw?si=UhYZPNxlv5_yR74X"},
#         {'name': 'Numbers Song', 'source': "https://www.youtube.com/embed/JT0MmZcJ2Vw?si=nC39IBQSLWUBGAIa"},
#         {'name': 'Hello Song', 'source': "https://www.youtube.com/embed/gghDRJVxFxU?si=Vt39NETDuidhKM_m"},
#         {'name': 'ABC Song', 'source': "https://www.youtube.com/embed/kpy6QEAuLJw?si=UhYZPNxlv5_yR74X"},
#         {'name': 'Numbers Song', 'source': "https://www.youtube.com/embed/JT0MmZcJ2Vw?si=nC39IBQSLWUBGAIa"},
#         {'name': 'Hello Song', 'source': "https://www.youtube.com/embed/gghDRJVxFxU?si=Vt39NETDuidhKM_m"},
#     ]
#     return render(request,'english/songs.html',{'videos':songs})