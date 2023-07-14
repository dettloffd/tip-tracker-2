build-dev:
	docker build -t tips-client-dev .
build-prod:
	docker build --build-arg REACT_APP_SERVER_URL=http://tips-server-LB-1097983176.us-east-1.elb.amazonaws.com/api -f Dockerfile.prod -t ddettloff/tips-client-ecs-prod .
build-local:
	docker build -t tips-client-prod -f Dockerfile.local .


docker-hub-client:
	$(MAKE) build-prod
	docker push ddettloff/tips-client-ecs-prod