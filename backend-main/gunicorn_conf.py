import multiprocessing
import os

from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())


wsgi_app = "core.wsgi:application"

bind = f"0.0.0.0:8000"

# workers = multiprocessing.cpu_count() * 2 + 1
workers = 1

accesslog = "logs/backend/access.log"
errorlog = "logs/backend/error.log"

os.makedirs("logs/backend", exist_ok=True)

if not os.path.exists(accesslog):
    open(accesslog, "w").close()
if not os.path.exists(errorlog):
    open(errorlog, "w").close()


timeout = 30
