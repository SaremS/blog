import unittest
import numpy as np

from src.sentiment_model import SentimentModel

class TestSentimentModel(unittest.TestCase):

    def test_long_text(self):
        """
            long text shouldn't cause any issues due to truncation
            and output a valid np.float32
        """

        model = SentimentModel()
        text = "heavy metal "*1000

        sentiment = model.predict(text)
        
        self.assertTrue(type(sentiment) == np.float32)
