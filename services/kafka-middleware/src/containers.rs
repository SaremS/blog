use tokio::sync::watch::{Sender, Receiver};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;



#[derive(Serialize, Deserialize)]
pub struct OutputMessage<T> {
    name: String,
    content: T
}



#[derive(Serialize, Deserialize, Clone)]
struct SentimentMAValue {
    time: i32,
    sentiment_moving_avg: f32
}



pub struct SentimentMAProcessor {
    data: Vec<SentimentMAValue>,
    receiver: Receiver<String>,
    sender: Sender<String>
}



impl SentimentMAProcessor {
    pub fn new(receiver: Receiver<String>, sender: Sender<String>) -> Self {
        let data: Vec<SentimentMAValue> = Vec::new();
        Self { data, receiver, sender }
    }

    async fn save_to_fs(&self) {
        let serialized = serde_json::to_string(&self.data).unwrap();
        fs::write("./persist/sentiment_ma", serialized).ok();
    }

    pub fn load_from_fs(&mut self) {
        let file_content = fs::read_to_string("./persist/sentiment_ma").or(Err("Error".to_string()));
        let unserialized = file_content.and_then(|a| self.serde_load_from_string(a));
        
        match unserialized{
            Ok(data) => {
                for (_, e) in data.iter().enumerate() {
                    self.data.push(e.clone());
                }
            },
            Err(_) => {}
        }
    }

    fn serde_load_from_string(&self, input: String) -> Result<Vec<SentimentMAValue>, String> {
        return serde_json::from_str(&input).or(Err("Error".to_string()));
    }

    pub async fn start_processing(&mut self) { 
        let output = self.get_data_as_output_json();
        self.sender.send(output).ok();
        while self.receiver.changed().await.is_ok() {
            let datum_str: String;
            {
                datum_str = self.receiver
                    .borrow()
                    .to_owned();
            }
            self.append_data(datum_str).await;
            
            let output = self.get_data_as_output_json();
            self.sender.send(output).ok();

            self.save_to_fs().await;
        } 
    }



    async fn append_data(&mut self, datum_str: String) {
        let datum_result = serde_json::from_str(&datum_str.to_string());
        match datum_result {
            Ok(datum) => {
                self.data.push(datum);
                if self.data.len() > 1500 {
                    self.data.drain(0..1);
                }
            },
            Err(e) => println!("{}", e)
        }
    }



    fn get_data_as_output_json(&self) -> String {
        let output = OutputMessage {name: "sentiment_moving_average".to_string(), content:&self.data};
        let result = serde_json::to_string(&output);
        match result {
            Ok(s) => return s,
            Err(_) => return "Internal error".to_string()
        }
    }

}

//----------------
#[derive(Serialize, Deserialize, Clone)]
struct TitleMeanCount {
    title: String,
    mean: f32,
    count: i32
}


pub struct TitleMeanCountProcessor {
    min_sentiment: TitleMeanCount,
    max_sentiment: TitleMeanCount,
    max_count: TitleMeanCount,
    receiver: Receiver<String>,
    sender: Sender<String>
}


impl TitleMeanCountProcessor {
    pub fn new(receiver: Receiver<String>, sender: Sender<String>) -> Self {
        let min_sentiment = TitleMeanCount{title:"<WAITING FOR DATA".to_string(), mean:0.0,count:0};
        let max_sentiment = TitleMeanCount{title:"<WAITING FOR DATA".to_string(), mean:0.0,count:0};    
        let max_count = TitleMeanCount{title:"<WAITING FOR DATA".to_string(), mean:0.0,count:0};
        Self { min_sentiment, max_sentiment, max_count, receiver, sender }
    }

    pub async fn start_processing(&mut self) {
        let output = self.get_data_as_output_json();
        self.sender.send(output).ok();

        while self.receiver.changed().await.is_ok() {
            let datum_str: String;
            {
                datum_str = self.receiver
                    .borrow()
                    .to_owned();
            }

            self.append_data(datum_str).await;
            
            let output = self.get_data_as_output_json();    
            self.sender.send(output).ok();

            self.save_to_fs().await;
        } 
    }


    async fn save_to_fs(&self) {
        let serialized_min = serde_json::to_string(&self.min_sentiment).unwrap();
        fs::write("./persist/sentiment_agg_min", serialized_min).ok();

        let serialized_max = serde_json::to_string(&self.max_sentiment).unwrap();
        fs::write("./persist/sentiment_agg_max", serialized_max).ok();

        let serialized_cnt = serde_json::to_string(&self.max_count).unwrap();
        fs::write("./persist/sentiment_agg_cnt", serialized_cnt).ok();
    }


    pub fn load_from_fs(&mut self) {
        let file_content_min = fs::read_to_string("./persist/sentiment_agg_min").or(Err("Error".to_string()));
        let unserialized_min = file_content_min.and_then(|a| self.serde_load_from_string(a));
        
        match unserialized_min{
            Ok(data) => {
                self.min_sentiment = data    
            },
            Err(_) => {}
        }

        let file_content_max = fs::read_to_string("./persist/sentiment_agg_max").or(Err("Error".to_string()));
        let unserialized_max = file_content_max.and_then(|a| self.serde_load_from_string(a));
        
        match unserialized_max{
            Ok(data) => {
                self.max_sentiment = data    
            },
            Err(_) => {}
        }

        let file_content_cnt = fs::read_to_string("./persist/sentiment_agg_cnt").or(Err("Error".to_string()));
        let unserialized_cnt = file_content_cnt.and_then(|a| self.serde_load_from_string(a));
        
        match unserialized_cnt{
            Ok(data) => {
                self.max_count = data    
            },
            Err(_) => {}
        }
    }

    fn serde_load_from_string(&self, input: String) -> Result<TitleMeanCount, String> {
        return serde_json::from_str(&input).or(Err("Error".to_string()));
    }



    async fn append_data(&mut self, datum_str: String) {
        let result = serde_json::from_str::<Vec<TitleMeanCount>>(&datum_str.to_string());
        match result{
            Ok(mut data) => {
                data.sort_by(|a,b| a.mean.partial_cmp(&b.mean).unwrap());
                let n = data.len();

                self.min_sentiment = data[0].clone();
                self.max_sentiment = data[n-1].clone();

                data.sort_by(|a,b| a.count.partial_cmp(&b.count).unwrap());
                self.max_count = data[n-1].clone();


            },
            Err(_) => {}
        }
    }
            

    fn get_data_as_output_json(&self) -> String {
        let mut map = HashMap::new();

        map.insert("min", self.min_sentiment.clone());
        map.insert("max", self.max_sentiment.clone());
        map.insert("count", self.max_count.clone());


        let output = OutputMessage {name: "sentiment_title_aggregated".to_string(), content:&map};
        let result = serde_json::to_string(&output);
        match result {
            Ok(s) => return s,
            Err(_) => return "Internal error".to_string()
        }
    }

}


