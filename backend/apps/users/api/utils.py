import random
import jwt
import datetime

from cryptography.fernet import Fernet
from django.conf import settings
from django.core.mail import send_mail
from django.core.cache import cache


cipher_suite = Fernet(settings.ENCRYPTION_KEY)

### JWT Token
def generate_jwt_token(payload):
    
    # Generate access token
    access_payload = payload.copy()
    access_payload['exp'] = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=int(settings.ACCESS_TOKEN_EXPIRATION_MINUTES))
    # Convert datetime to Unix timestamps
    access_payload['exp'] = int(access_payload['exp'].timestamp())
    
    access_token = jwt.encode(payload, settings.JWT_ACCESS_TOKEN_SECRET, algorithm=settings.JWT_ALGORITHM)
    encrypted_access_token = cipher_suite.encrypt(access_token.encode()).decode()
    

    # Generate refresh token
    refresh_payload = {
        'user_id': payload['user_id'],     
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=int(settings.REFRESH_TOKEN_EXPIRATION_DAYS)),
        'iat': payload['iat'],
    }
    # Convert datetime to Unix timestamps
    refresh_payload['exp'] = int(refresh_payload['exp'].timestamp())

    refresh_token = jwt.encode(refresh_payload, settings.JWT_REFRESH_TOKEN_SECRET, algorithm=settings.JWT_ALGORITHM)
    encrypted_refresh_token = cipher_suite.encrypt(refresh_token.encode()).decode()

    return encrypted_access_token, encrypted_refresh_token


def decrypt_access_token(enc_acc_token): 
    try:
        dec_acc_token = cipher_suite.decrypt(enc_acc_token.encode()).decode()
        payload = jwt.decode(dec_acc_token, settings.JWT_ACCESS_TOKEN_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return {'payload': payload, 'status': True}
    except: 
        return {'status': False}

def decrypt_refresh_token(enc_ref_token):
    try:
        dec_ref_token = cipher_suite.decrypt(enc_ref_token.encode()).decode()
        payload = jwt.decode(dec_ref_token, settings.JWT_REFRESH_TOKEN_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return {'payload': payload, 'status': True}
    except:
        return {'status': False}

### OTP 
def generate_otp():
    return str(random.randint(100000, 999999))

def is_otp_unique(email, otp):
    return cache.get(f"{email}_otp") != otp

def send_otp_via_email(email, otp):
    subject = 'Your OTP Code'
    message = f'Your OTP code is {otp}'
    from_email = 'behaletsgo@gmail.com'
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)
