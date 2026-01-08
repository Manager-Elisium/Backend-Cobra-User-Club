import amqp from 'amqplib';
import { consumeService } from 'src/rabbitmq/client';


export let connection: amqp.Connection | null = null;

export async function createRabbitmqConnection(): Promise<amqp.Connection> {
  if (!connection) {
    const amqpServer = process.env.RABBITMQ_CLIENT;
    connection = await amqp.connect(amqpServer);
  }
  await consumeService();
  return connection;
}