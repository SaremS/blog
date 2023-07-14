use tokio::sync::watch;
use tokio::net::{TcpListener};
use std::env;

mod kafka;
mod containers;
mod websocket;

use crate::kafka::{consume_and_process};
use crate::containers::{SentimentMAProcessor, TitleMeanCountProcessor};
use crate::websocket::{accept_connection};


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let broker_addr = match env::var_os("KAFKA_BROKER") {
        Some(v) => v.into_string().unwrap(),
        None => "localhost:29092".to_string()
    };
    let server_addr = match env::var_os("SERVER_ADDRESS") {
        Some(v) => v.into_string().unwrap(),
        None => "127.0.0.1:9988".to_string()
    };

    let rt = tokio::runtime::Runtime::new().unwrap();
    let group_id = "sentiments";


    let (sma_data_sender, sma_data_receiver) = watch::channel("init".to_string());
    let (sma_string_sender, sma_string_receiver) = watch::channel("init".to_string());
    
    
    let mut sma_processor = SentimentMAProcessor::new(sma_data_receiver, sma_string_sender);
    sma_processor.load_from_fs();

    let sma_topics = vec!["reddit_praw_sentimented"];
    let brkr_addr_c1 = broker_addr.clone();
    let sma_kafka_task =  async move {
        consume_and_process(&brkr_addr_c1, &sma_topics, group_id, sma_data_sender).await;
    };
    rt.spawn(sma_kafka_task);

    let sma_processor_task = async move{
        sma_processor.start_processing().await;
    };
    rt.spawn(sma_processor_task);

//-----------

    let (tmc_data_sender, tmc_data_receiver) = watch::channel("init".to_string());
    let (tmc_string_sender, tmc_string_receiver) = watch::channel("init".to_string());
    
    let mut tmc_processor = TitleMeanCountProcessor::new(tmc_data_receiver, tmc_string_sender);
    tmc_processor.load_from_fs();

    let tmc_topics = vec!["reddit_praw_aggregated"];
    let brkr_addr_c2 = broker_addr.clone();
    let tmc_kafka_task =  async move {
        consume_and_process(&brkr_addr_c2, &tmc_topics, group_id, tmc_data_sender).await;
    };
    rt.spawn(tmc_kafka_task);

    let tmc_processor_task = async move{
        tmc_processor.start_processing().await;
    };
    rt.spawn(tmc_processor_task);

//----------
    let try_socket = TcpListener::bind(&server_addr).await;
    let listener = try_socket.expect("Failed to bind");

     while let Ok((stream, _)) = listener.accept().await {
        let sma_clone = sma_string_receiver.clone();
        let tmc_clone = tmc_string_receiver.clone();
        tokio::spawn(  {
            accept_connection(stream,  sma_clone, tmc_clone)
        });
    }

    tokio::signal::ctrl_c().await?;
    println!("Ending stuff!");
    Ok(())
    
}
