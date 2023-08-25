cd environment
source .env
export KAFKA_BROKER SERVER_ADDRESS KAFKA_HOST REDDIT_CLIENT_ID REDDIT_CLIENT_SECRET KAFKA_TOPIC IMAGE_VERSION
cd ../kubernetes
envsubst < mono_config_template.yaml | kubectl apply -f - 
cd ..