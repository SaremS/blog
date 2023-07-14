#stage 1
FROM python:3.9-alpine AS pip_installed

COPY ./requirements.txt ./streamer/requirements.txt
RUN pip install -r ./streamer/requirements.txt


#stage 2
FROM pip_installed

COPY ./main.py ./streamer/main.py
COPY ./PrawStreamer.py ./streamer/PrawStreamer.py

WORKDIR ./streamer


CMD ["python", "main.py"]
