import face_recognition
import base64
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.files.base import ContentFile
from .models import UserImages, User
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def register_page(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            face_image_data = request.POST.get('face_image')

            if not username or not face_image_data:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Username and face image are required.'
                })

            # Check if username already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Username already exists!'
                })

            # Process the base64 image
            if ',' in face_image_data:
                face_image_data = face_image_data.split(',')[1]

            # Decode base64 to file
            face_image = ContentFile(
                base64.b64decode(face_image_data),
                name=f'{username}_face.jpg'
            )

            # Create and save user
            user = User.objects.create_user(username=username)
            UserImages.objects.create(user=user, face_image=face_image)

            return JsonResponse({
                'status': 'success',
                'message': 'Registration successful! Redirecting to login...'
            })

        except Exception as e:
            print(f"Registration error: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'message': 'An error occurred during registration. Please try again.'
            })

    return render(request, 'register.html')

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            face_image_data = request.POST.get('face_image')

            # Get the user
            try:
                user = User.objects.get(username=username)
                user_image = UserImages.objects.get(user=user)
            except (User.DoesNotExist, UserImages.DoesNotExist):
                return JsonResponse({
                    'status': 'error',
                    'message': 'User not found.'
                })

            # Process the base64 image
            if ',' in face_image_data:
                face_image_data = face_image_data.split(',')[1]

            # Create temporary file for uploaded image
            uploaded_image = ContentFile(
                base64.b64decode(face_image_data),
                name=f'temp_{username}_face.jpg'
            )

            # Load and encode faces
            try:
                uploaded_face = face_recognition.load_image_file(uploaded_image)
                uploaded_encodings = face_recognition.face_encodings(uploaded_face)

                if not uploaded_encodings:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'No face detected in the uploaded image.'
                    })

                stored_face = face_recognition.load_image_file(user_image.face_image.path)
                stored_encodings = face_recognition.face_encodings(stored_face)

                if not stored_encodings:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Error with stored face image.'
                    })

                # Compare faces
                match = face_recognition.compare_faces(
                    [stored_encodings[0]], 
                    uploaded_encodings[0],
                    tolerance=0.6
                )

                if match[0]:
                    login(request, user)
                    return JsonResponse({
                        'status': 'success',
                        'message': 'Login successful! Redirecting...'
                    })
                else:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Face verification failed.'
                    })

            except Exception as e:
                print(f"Face recognition error: {str(e)}")
                return JsonResponse({
                    'status': 'error',
                    'message': 'Error during face verification.'
                })

        except Exception as e:
            print(f"Login error: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'message': 'An error occurred during login.'
            })

    return render(request, 'login.html')

def home(request):
    if not request.user.is_authenticated:
        return redirect('login_user')
    return render(request, 'home.html')