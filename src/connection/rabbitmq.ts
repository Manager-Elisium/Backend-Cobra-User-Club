import amqp from 'amqplib';
import { consumeService } from 'src/rabbitmq/client';


export let connection: amqp.ChannelModel | null = null;

export async function createRabbitmqConnection(): Promise<amqp.ChannelModel> {
  if (!connection) {
    const amqpServer = process.env.RABBITMQ_CLIENT;
    connection = await amqp.connect(amqpServer);
  }
  await consumeService();
  return connection;
}