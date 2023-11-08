FROM rust:1.67

WORKDIR /kafka-middleware

COPY Cargo.toml Cargo.toml
COPY ./src/ ./src/

RUN apt-get update
RUN apt install -y libprotobuf-dev protobuf-compiler cmake

RUN cargo build --release

RUN rm -f target/release/deps/kafka-middleware*

COPY . .

RUN cargo build --release

RUN cargo install --path .

CMD ["kafka-middleware"] 
