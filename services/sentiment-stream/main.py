import json
import os
from kafka import KafkaConsumer, KafkaProducer
from kafka.admin import KafkaAdminClient, NewTopic
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

from src.sentiment_model import SentimentModel

KAFKA_HOST = os.getenv("KAFKA_HOST") if os.getenv("KAFKA_HOST") is not None else "localhost:29092" 
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC") if os.getenv("KAFKA_TOPIC") is not None else "reddit_praw"



model = SentimentModel()

consumer = KafkaConsumer(KAFKA_TOPIC,
                         bootstrap_servers=[KAFKA_HOST])
producer = KafkaProducer(bootstrap_servers=KAFKA_HOST,
        value_serializer = lambda d: json.dumps(d).encode("utf-8"))

df = pd.DataFrame(columns=["created_utc", "title", "comment_body",
                           "sentiment"])

for message in consumer:
    message_dict = json.loads(message.value.decode())
    
    created_utc = message_dict["created_utc"]
    comment_body = message_dict["comment_body"]
    title = message_dict["title"]

    sentiment = model.predict(comment_body)
    result_dict = {"created_utc": created_utc,"title": title,
                  "comment_body": comment_body,"sentiment": sentiment}

    df_next = pd.DataFrame([result_dict])

    df = df.append(df_next)
    
    now_utc = int((datetime.now() - datetime(1970, 1, 1)) / timedelta(seconds=1))
    df = df[(now_utc - df["created_utc"]) <= 900]

    sentimented = float(np.mean(df["sentiment"]))
    grouped = df.groupby("title")

    counts = grouped.count()[["sentiment"]]
    counts.columns = ["count"]
    means = grouped.mean()[["sentiment"]]
    means.columns = ["mean"]

    aggregated = pd.concat([counts,means],1) \
            .reset_index()\
            .to_dict(orient="records")

    producer.send(KAFKA_TOPIC + "_sentimented",{"time":now_utc,
        "sentiment_moving_avg": sentimented})

    producer.send(KAFKA_TOPIC + "_aggregated", aggregated)
    





    
