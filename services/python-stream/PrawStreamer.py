import os
import praw
from kafka import KafkaProducer, KafkaClient
from kafka.admin import KafkaAdminClient, NewTopic
import json


class PrawStreamer():

    def __init__(self) -> None:
        self.kafka_host = os.getenv("KAFKA_HOST") if os.getenv("KAFKA_HOST") is not None else "localhost:9092" 

        self.kafka_client = KafkaClient(bootstrap_servers=self.kafka_host)
        self.kafka_admin_client = KafkaAdminClient(bootstrap_servers=self.kafka_host)
        
        self.kafka_target_topic = "reddit_praw"
        self.kafka_producer = KafkaProducer(
                bootstrap_servers=self.kafka_host,
                value_serializer = lambda d: json.dumps(d).encode("utf-8")
        )

        self.create_topics(self.kafka_target_topic)

        self.reddit_client_id = os.getenv("REDDIT_CLIENT_ID")
        self.reddit_client_secret = os.getenv("REDDIT_CLIENT_SECRET")

        self.reddit_client = praw.Reddit(
            client_id=self.reddit_client_id,
            client_secret=self.reddit_client_secret,
            user_agent="Praw Streamer"
        )

    def create_topics(self, topic_name: str) -> None:
        future = self.kafka_client.cluster.request_update()
        self.kafka_client.poll(future=future)
        metadata = self.kafka_client.cluster
        existing_topics = metadata.topics()

        if topic_name not in existing_topics:
            topic = NewTopic(name=topic_name,
                             num_partitions=1,
                             replication_factor=1)
            sentiment_topic = NewTopic(name=topic_name + "_sentimented",
                             num_partitions=1,
                             replication_factor=1)
            aggregated_topic = NewTopic(name=topic_name + "_aggregated",
                             num_partitions=1,
                             replication_factor=1)

            self.kafka_admin_client.create_topics([topic,sentiment_topic,aggregated_topic])

        

    def stream(self, target_subreddit: str = "all") -> None:
        
        subreddit = self.reddit_client.subreddit(target_subreddit)

        for comment in subreddit.stream.comments(skip_existing=True):
            created_utc = int(comment.created_utc)
            comment_body = comment.body
            title = comment.submission.title

            comment_dict = {"created_utc":created_utc, "comment_body": comment_body, "title": title}

            self.kafka_producer.send(self.kafka_target_topic, comment_dict)
              
