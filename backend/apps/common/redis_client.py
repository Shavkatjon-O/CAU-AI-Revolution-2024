import redis
from django.conf import settings


redis_instance = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB, decode_responses=True)

def set_otp(email, otp):
    redis_instance.set(f"{email}", otp, ex=settings.OTP_LIFETIME)

def get_otp(email):
    return redis_instance.get(f"{email}")

def delete_otp(email):
    redis_instance.delete(f"{email}")

def set_verify(email, email_verify):
    if email_verify:
        redis_instance.set(f"{email}_verify", 'True', ex=settings.OTP_LIFETIME)

def get_verify(email):
    return redis_instance.get(f"{email}_verify")

def delete_verify(email):
    redis_instance.delete(f"{email}_verify")

def blacklist_token(token):
    redis_instance.set(token, 'blacklisted', ex=settings.JWT_REFRESH_TOKEN_EXPIRATION)

def is_token_blacklisted(token):
    return redis_instance.get(token) == 'blacklisted'
