FROM python:3.12-slim-bullseye

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    gettext \
    postgresql-client \
    netcat \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip && pip install -r requirements.txt

ENV HOME=/home/app
ENV APP_HOME=/home/app

RUN mkdir -p $APP_HOME/locales \
    $APP_HOME/media \
    $APP_HOME/staticfiles \
    $APP_HOME/logs/backend \
    $APP_HOME/logs/bot

WORKDIR $APP_HOME

COPY . .

RUN chmod +x setup.sh

ENTRYPOINT ["./setup.sh"]

RUN rm -rf /var/cache/apt/*
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN rm -rf /etc/apk/cache
