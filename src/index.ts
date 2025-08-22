// and we dont required to write app.listen(3000) something like this 
// insted of express use hono in the serverless 
import { Hono } from 'hono'

// from the prisma Accelerate 
// for pooling connection 
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// if we use enviornment variable then 
// we have to configure in the clodeflare enviornment variable 
// import {env} from 'hono/adapter';

const app = new Hono();

// in the serverless there is no concept of global variable 



// added midddleware 
app.use(async (c, next) => {
  if (c.req.header("Authorization")) {
    console.log("auth header find");
    await next();  // make sure to return this
  } else {
    return c.text("you dont have access");
  }
});


app.post("/",async (c)=>{
  // Todo add zod validation here 
  const {name, email, password}=await c.req.json();
  
  if(!name || !email || !password){
    return c.json({
      message : "please provide all the entries"
    })
  }

  // take database url from the env 
  // const {DATABASE_URL}=env<{DATABASE_URL:string}>(c)

  //  create prisma client from the that DATABASE_URL
  // ***************
  // why we are creating prismaClient in this why not globally 
  // bacause we are creating the connection with the connection pool so 
  // whenever any request comes it will create new connection 
  const prisma = new PrismaClient({
    // @ts-ignore
    // we have to also update the wrangler.jsonc file m vars so that when we redploy then 
    // theat change into the clodflare are persistent 
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  // create the user in the database 
  const user=await prisma.user.create({
    data:{
      name,
      email,
      password
    }
  });

  // console.log(name,password, email);

  return c.json({
    id: user.id
  })

})

export default app;