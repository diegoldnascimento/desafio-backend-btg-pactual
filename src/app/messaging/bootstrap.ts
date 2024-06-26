import { MongoClient } from "mongodb";
import MongoDBConnectionAdapter from "src/infra/db/mongodb/mongoDbConnectionAdapter";
import { RabbitMQConnectionAdapter } from "src/infra/messaging/rabbitmq/rabbitMqConnectionAdapter";
import OrdersMongoDBRepository from "src/infra/repositories/orders/ordersMongoDbRepository";
import { CreateOrderV1Consumer } from "./rabbitmq/createOrderConsumer";

// mongodb://${DB_HOST}:${MONGO_PORT}/docker-node-mongo

export async function bootstrap() {
  const mqConnection = new RabbitMQConnectionAdapter();
  const mongoDbConnection = new MongoDBConnectionAdapter();
  await mongoDbConnection.connect("mongodb://root:admin@mongo:27017", "btgPactual");
  const orderRepository = new OrdersMongoDBRepository(mongoDbConnection);
  const orderConsumer = new CreateOrderV1Consumer(
    mqConnection,
    orderRepository,
  ).startConsuming();
  // Optionally, you can keep the consumer running in the background
  // For example, in a production environment, you would manage the lifecycle of consumers

  // To stop consuming:
  // await orderConsumer.stopConsuming();
  //
}
