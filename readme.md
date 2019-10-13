# Order Management System

Sample projects to demonstrate microservices, restful web api as well as ui.
The system consists of 3 following projects:
- Order Microservices
- Payment Microservices
- Order Web

## Order Microservices

It is responsible for orders management. When an order is created, it triggers the payment microservice to proceed the payment. It also has the endpoints to list, cancel and check the order status.

The project developed in NestJS, backed by Mongodb, handles both TCP and HTTP requests (mixed mode) and used web sockets to update clients on the status of orders.

### Technologies

- Event-based and Message-based microservices on TCP:8876
- REST api on port HTTP:8877
- Swagger (http://localhost:8877/doc)
- WebSocket
- Mongodb
- Docker

## Payment Microservices

This service is responsible for handling requests made by orders app to verify payment transaction and confirm or decline it. When the service proceed the payment, it emits an event and let the order app to know the result of payment, so, the order service will update the status of that specific order.

### Technologies

- Nestjs microservices on TCP:8875
- Mongodb
- Docker

## Order Web

A Single Page Application developed using Angular which is the client-side interface for users to manage and to check the orders.
A user can see the list of orders, check their statuses in real-time (websocket), and create or cancel an order.

### Technologies

- Angular
- socket-io
- rxjs
- docker

## Running the app

Install Docker Desktop if you do not have it. Run docker package using docker-compose command

```bash
# docker
$ docker-compose up #--build 
```

Then browse http://localhost:8085/orders

Web Api can be checked through http://localhost:8877/api/orders and you can access api documentation through http://localhost:8877/doc

Note: port 8875 and 8876 are not exposed by default in docker-compose.yml configuration. If you need them, you easily can change the config.

## License

MIT licensed.
