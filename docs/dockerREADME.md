Creating the docker image to push to dockerhub. 

For server

Within server directory:

`docker build -t {USERNAME}/tips-server-ecs .`

`docker push {USERNAME}/tips-server-ecs`

To build with a specific '.prod' Dockerfile for instance, use the -f flag:

`docker build -f Dockerfile.prod -t {USERNAME}/tips-server-ecs .`