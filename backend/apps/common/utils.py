import os
from rest_framework.response import Response
from rest_framework import status

from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError

from PIL import Image
from io import BytesIO

def success_response(data=None, message="Success", code=status.HTTP_200_OK):
    return Response({
        "success": True, 
        "code": code,
        "message": message,
        "data": data if data is not None else {}
    }, status=code)

def error_response(data=None, message="Error", code=status.HTTP_400_BAD_REQUEST):
    return Response({
        "success": False, 
        "code": code, 
        "message": message,
        "data": data if data is not None else {}
    }, status=code)

def process_image(image, new_width, new_height):
    try:
        img = Image.open(image)
        img.verify()
        img = Image.open(image)

        # convert png to RGB
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")
        # Calculate new dimensions to maintain aspect ratio with a width of 800
        max_size = (new_width, new_height)
        # Resize the image
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        # img = img.resize((new_width, new_height), Image.LANCZOS)
        # Prepare the image for saving
        temp_img = BytesIO()
        img.save(temp_img, format="JPEG", quality=100, optimize=True)
        temp_img.seek(0)

        # Change file extension to .jpg
        base_name = os.path.basename(image.name)
        if '.' in image.name:
            base_name = base_name.rsplit('.', 1)[0]
        new_filename = f"{base_name}.jpg"
        return new_filename, ContentFile(temp_img.read())
        

    except (IOError, SyntaxError) as e:
        raise ValueError(f"Invalid image. -- {e}")


def process_logo(logo, new_width, new_height):
    try:
        img = Image.open(logo)
        img.verify()
        img = Image.open(logo)

        max_size = (new_width, new_height)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)

        img_io = BytesIO()
        img_format = img.format
        img.save(img_io, format=img_format, quality=85, optimize=True)
        img_io.seek(0)

        if '.' in logo.name:
            original_name = logo.name.rsplit('.', 1)[0]
        
        new_filename = f"{original_name}.{img_format.lower()}"
        
        return new_filename, ContentFile(img_io.getvalue())
    
    except (IOError, SyntaxError) as e:
        raise ValueError(f"Invalid logo. -- {e}")

def process_document(file, user_id):
    if file.size > 2 * 1024 * 1024:
        raise ValidationError("The file size is too large. It should be less than 2 MB.")
    ext = os.path.splitext(file.name)[1].lower()
    if ext != '.pdf':
        raise ValidationError("Unsupported document file type")
    # new filename
    if '.' in file.name:
        original_name = file.name.rsplit('.', 1)[0]
    
    new_filename = f"{original_name}.{ext}"
    return new_filename, file