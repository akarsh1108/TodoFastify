import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IParams, Todo } from '../../interfaces/todos.interfaces';


//Validation String keeping title to be not empty
const todoSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 }, 
    completed: { type: 'boolean' },
    dateOfCreation: { type: ['string', 'null'], format: 'date-time' },
    dateOfCompletion: { type: ['string', 'null'], format: 'date-time' }, 
    imageLink: { type: ['string', 'null'] }, 
  },
  required: ['title'],
};



// Get all the todos with keeping todo completed and NotCompleted calls
export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const client = await fastify.pg.connect();
      try {
        //As ids are incrementing with newest todo first sorthing it in desc order will automatically change it to newest first
        const { rows } =  await client.query(`SELECT * from todos ORDER BY id DESC`);
        const totalCompleted = rows.filter((todo) => todo.completed).length;
        const totalNotCompleted = rows.length - totalCompleted;
        const response = {
          totalCompleted,
          totalNotCompleted,
          todos: rows,
        };
        return response;
      } catch (error) {
        //Handling the errors 
        console.error(error);
        reply.code(500).send({error:'Internal Server Error'})
      } finally {
        //Release the client immediately after query resolves
        client.release();
      }
    }
  );

  //   Get one todo by id
  fastify.get(
    '/:id',
    async function (
      request: FastifyRequest<{ Params: IParams }>,
      reply: FastifyReply
    ) {
      //Passing the id parameter and checking in database
      const { id } = request.params;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          `SELECT * from todos WHERE id = $1`,
          [id]
        );
        if(rows.length == 0)
        {
          reply.code(404).send({error:'Todo Not Found'});
        }
        else
        {
        return rows;
        }
      } catch (error) {
        console.error(error);

        if (error.name === 'ValidationError') {
          reply.code(400).send({ error: 'Bad Request' });
        } else {
          reply.code(500).send({ error: 'Internal Server Error' });
        }

      } finally {
        //Release the client immediately after query resolves
        client.release();
      }
    }
  );

  //Add new todo
  fastify.post(
    '/',
    {
      schema: {
        body: todoSchema,
      },
    },
    async function (
      request: FastifyRequest<{ Body: Todo }>,
      reply: FastifyReply
    ) {
      const { title, completed, dateOfCreation, dateOfCompletion, imageLink } =
        request.body;
      const client = await fastify.pg.connect();
      try {

        //If from frontend date of creation is being passed then the data is direclty sent else it is generated here before sending
        if(dateOfCreation!=null)
        {
        const response = await client.query(
          `INSERT INTO todos(title,completed,dateOfCreation,dateOfCompletion,imageLink) VALUES($1,$2,$3,$4,$5) RETURNING id`,
          [title, completed, dateOfCreation, dateOfCompletion, imageLink]
        );
        return response;
        }
        else
        {

          //As dates are in UTC I converted it into ITC 
          const currentDateInUTC = new Date();

       
          const istOffsetMinutes = 330;
  
          const currentDateInIST = new Date(
            currentDateInUTC.getTime() + istOffsetMinutes * 60000
          );
          const creationdate= currentDateInIST.toISOString();
            console.log(creationdate);
            const response = await client.query(
              `INSERT INTO todos(title,completed,dateOfCreation,dateOfCompletion,imageLink) VALUES($1,$2,$3,$4,$5) RETURNING id`,
              [title, completed, creationdate, dateOfCompletion, imageLink]
            );
          return response;
        }
      } catch (error) {
        console.error(error);

        if (error.name === 'ValidationError') {
          reply.code(400).send({ error: 'Bad Request' });
        } else {
          reply.code(500).send({ error: 'Internal Server Error' });
        }

      } finally {
        //Release the client immediately after query resolves
        client.release();
      }
    }
  );

  //Update todo by id
  fastify.put(
    '/:id',
    {
      schema: {
        body: todoSchema, 
      },
    },
    async function (
      request: FastifyRequest<{ Params: IParams; Body: Todo }>,
      reply: FastifyReply
    ) {
      const { id } = request.params;
      const { title, completed, dateOfCreation, dateOfCompletion, imageLink } =
        request.body;
      const client = await fastify.pg.connect();
      try {
        const response = await client.query(
          `UPDATE todos SET title = $1, completed = $2, dateOfCreation = $3, dateOfCompletion = $4, imageLink = $5 WHERE id = $6`,
          [title, completed, dateOfCreation, dateOfCompletion, imageLink, id]
        );
        return response;
      } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
          reply.code(400).send({ error: 'Bad Request' });
        } else {
          reply.code(500).send({ error: 'Internal Server Error' });
        }
      } finally {
        //Release the client immediately after query resolves
        client.release();
      }
    }
  );

  //Mark Completed
  fastify.put(
    '/:id/markComplete',
    async function (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) {
      const { id } = request.params;
      const client = await fastify.pg.connect();
      try {
        //Todo and currentDateUTC parameter is getting changed automatically here without passing the body from frontend
        const completed = true;
        const currentDateInUTC = new Date();

       
        const istOffsetMinutes = 330;

        const currentDateInIST = new Date(
          currentDateInUTC.getTime() + istOffsetMinutes * 60000
        );
        const dateofCompletion= currentDateInIST.toISOString();
          console.log(dateofCompletion);
        const response = await client.query(
          'UPDATE todos SET completed = $1, dateOfCompletion = $2 WHERE id = $3',
          [completed, dateofCompletion, id]
        );
        return response;
      } catch (error) {
        console.log(error);
        reply.code(500).send({ error: 'Internal Server Error' });
      } finally {
        client.release();
      }
    }
  );

  //   Delete todo by id
  fastify.delete(
    '/:id',
    async function (
      request: FastifyRequest<{ Params: IParams }>,
      reply: FastifyReply
    ) {
      const { id } = request.params;
      const client = await fastify.pg.connect();
      try {
        const response = await client.query(`DELETE FROM todos WHERE id = $1`, [
          id,
        ]);
        return response;
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
      } finally {
        //Release the client immediately after query resolves
        client.release();
      }
    }
  );
}
