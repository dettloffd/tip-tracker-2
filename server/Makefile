build:
	docker build -t tips-server-dev .

build-prod:
	docker build -f Dockerfile.prod -t ddettloff/tips-server-ex8080 .


docker-hub-server:
	$(MAKE) build-prod
	docker push ddettloff/tips-server-ex8080