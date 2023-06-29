build-dev:
	cd client && $(MAKE) build-dev
	cd server && $(MAKE) build


run-dev:
	docker-compose -f docker-compose-dev.yml up

rebuild-dev:
	docker-compose -f docker-compose-dev.yml up --build


build-local:
	cd client && $(MAKE) build-local
	cd server && $(MAKE) build

run-local:
	docker-compose up

build-production:
	cd client && $(MAKE) build-prod
	cd server && $(MAKE) build
run-production:
	docker-compose up