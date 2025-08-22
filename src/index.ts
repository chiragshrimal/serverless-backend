// and we dont required to write app.listen(3000) something like this 
// insted of express use hono in the serverless 
import { Hono } from 'hono'

// from the prisma Accelerate 
// for pooling connection 
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import {env} from 'hono/adapter';

const app = new Hono();

app.post("/",async(c)=>{
  // Todo add zod validation here 
  const {name, email, password}=await c.req.json();
  
  if(!name || !email || !password){
    return c.json({
      message : "please provide all the entries"
    })
  }

  // take database url from the env 
  const {DATABASE_URL}=env<{DATABASE_URL:string}>(c)

  //  create prisma client from the that DATABASE_URL
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  // create the user in the database 
  await prisma.user.create({
    data:{
      name,
      email,
      password
    }
  });

  return c.json({
    message : "user is created"
  })

})