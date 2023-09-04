import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import 'dotenv/config';
import fastifyPostgres from '@fastify/postgres';
/**
 * This plugins adds some utilities to handle @fastify/postgres
 *
 */

//PostGres user id , password and postgres database name is passed here to connect with Postgres
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyPostgres,{
    connectionString:`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`
  });
});
