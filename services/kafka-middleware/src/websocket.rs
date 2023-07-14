use futures::*;
use tokio::net::{TcpStream};
use tokio::sync::watch::{Receiver};
use log::{info};


pub async fn accept_connection(stream: TcpStream, mut receiver: Receiver<String>, mut receiver2: Receiver<String>)  {
    let _addr = stream.peer_addr().expect("stream should have a address");


    let ws_stream = tokio_tungstenite::accept_async(stream)
        .await
        .expect("error during the ws handshake");
    info!("New Web Socket connection: {}", &_addr);

    let (mut write, _) = ws_stream.split();

    
    
    while receiver.changed().await.is_ok() && receiver2.changed().await.is_ok() {
        let y: String;
        let y2: String;
        {   
            let x = receiver.borrow();
            let x2 = receiver2.borrow();
            y = x.to_owned();
            y2 = x2.to_owned();
        }

        let result = format!("[{}, {}]", y, y2);
        let msg = tokio_tungstenite::tungstenite::Message::Text(result.to_string());
            match write.send(msg).await {
                Ok(_) => {}
                Err(_) => continue, // prevents Panic when a broken pipe happens
        }
        

    }

    
}
