static_only:
	quarto render
	docker-compose -f docker-compose-dev.yml build nginx
	docker-compose -f docker-compose-dev.yml up nginx