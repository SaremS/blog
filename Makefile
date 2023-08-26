static_only:
	quarto render
	docker-compose -f docker-compose-dev.yml build nginx
	docker-compose -f docker-compose-dev.yml up nginx
run_kubernetes:
	cd environment
	export $( grep -vE "^(#.*|\s*)$" .env )
	cd ../kubernetes
	envsubst < mono_config_template.yaml > mono_config.yaml
	kubectl apply -f mono_config.yaml
	cd ..