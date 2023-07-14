#stage 1
FROM python:3.9-slim AS pip_installed

COPY ./requirements.txt ./sentimenter/requirements.txt
RUN pip install -r ./sentimenter/requirements.txt


#stage 2
FROM pip_installed

COPY ./main.py ./sentimenter/main.py
COPY ./src/sentiment_model.py ./sentimenter/src/sentiment_model.py

WORKDIR ./sentimenter


CMD ["python", "main.py"]
