import os

from transformers import AutoModelForSequenceClassification
from transformers import TFAutoModelForSequenceClassification
from transformers import AutoTokenizer
import numpy as np
from scipy.special import softmax



class SentimentModel:
    
    def __init__(self):    
        self.model = None
        self.tokenizer = None
        self._load_tokenizer_and_model()
        self._save_model()
        
        
        
    def _load_tokenizer_and_model(self):
        MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL)

        if not "saved_model" in os.listdir():
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL)
        else:
            if not "config.json" in os.listdir("saved_model"):
                self.model = AutoModelForSequenceClassification.from_pretrained(MODEL)
            else:
                self.model = AutoModelForSequenceClassification.from_pretrained("saved_model")

    
    
    def _save_model(self):
        self.model.save_pretrained("saved_model")
    
    
        
    def predict(self, text):
        text = self.preprocess(text)[:280]
        encoded_input = self.tokenizer(text, return_tensors='pt')
        output = self.model(**encoded_input)
        scores = output[0][0].detach().numpy()
        scores = softmax(scores)
        
        return -scores[0] + scores[2]
    
    
        
    def preprocess(self, text):
        new_text = []

        for t in text.split(" "):
            t = '@user' if t.startswith('@') and len(t) > 1 else t
            t = 'http' if t.startswith('http') else t
            new_text.append(t)
        return " ".join(new_text)
