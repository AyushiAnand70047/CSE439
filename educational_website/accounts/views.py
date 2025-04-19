import face_recognition
import os
import traceback
import base64
from django.conf import settings
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
            # Get face image data
            face_image_data = request.POST.get('face_image')
            
            # If no face_image in POST, check if it's in raw body
            if not face_image_data:
                import json
                try:
                    body = request.body.decode('utf-8')
                    body_data = json.loads(body)
                    face_image_data = body_data.get('face_image')
                except Exception as body_error:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'No image data received.',
                    })

            # Validate face image data
            if not face_image_data:
                return JsonResponse({
                    'status': 'error',
                    'message': 'No face image data received.'
                })

            # Process the base64 image
            if ',' in face_image_data:
                face_image_data = face_image_data.split(',')[1]

            # Create temporary file for uploaded image
            uploaded_image = ContentFile(
                base64.b64decode(face_image_data),
                name='temp_face.jpg'
            )

            # Load and encode uploaded face
            uploaded_face = face_recognition.load_image_file(uploaded_image)
            uploaded_encodings = face_recognition.face_encodings(uploaded_face)

            if not uploaded_encodings:
                return JsonResponse({
                    'status': 'error',
                    'message': 'No face detected in the uploaded image.'
                })

            # Get all UserImages
            user_images = UserImages.objects.all()

            # Check against stored images in media folder
            for user_image in user_images:
                try:
                    # Verify image file exists
                    if not os.path.exists(user_image.face_image.path):
                        print(f"Image not found: {user_image.face_image.path}")
                        continue

                    # Load stored face
                    stored_face = face_recognition.load_image_file(user_image.face_image.path)
                    stored_encodings = face_recognition.face_encodings(stored_face)

                    if not stored_encodings:
                        continue  # Skip if no face detected in this image

                    # Compare faces with stricter tolerance
                    match = face_recognition.compare_faces(
                        [stored_encodings[0]], 
                        uploaded_encodings[0],
                        tolerance=0.45  # Lowered tolerance for more strict matching
                    )

                    if match[0]:
                        # Find the user associated with this image
                        user = user_image.user
                        login(request, user)
                        # request.session.set_expiry(0)
                        return JsonResponse({
                            'status': 'success',
                            'message': 'Login successful! Redirecting...'
                        })

                except Exception as image_error:
                    print(f"Error processing image: {image_error}")
                    continue

            # If no match found after checking all images
            return JsonResponse({
                'status': 'error',
                'message': 'Face not recognized. Access denied.'
            })

        except Exception as e:
            print(f"Login error: {e}")
            print(traceback.format_exc())
            return JsonResponse({
                'status': 'error',
                'message': 'An error occurred during login.'
            })

    return render(request, 'login.html')

def home(request):
    if not request.user.is_authenticated:
        return redirect('login_user')
    return redirect('content_home')