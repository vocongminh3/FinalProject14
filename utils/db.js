import knex from 'knex';

export default knex ({
    client: 'pg',
    connection: {
      host : 'dpg-cdmhcg4gqg43l6fo2oog-a.oregon-postgres.render.com',
      port : 5432,
      user : 'finalproject14',
      password : 'qFL0oZgd4XTi6zKYS12wIIYjTEv8v7qS',
      database : 'finalproject14'
    },

    pool: { min: 0, max: 10 }
    
  });