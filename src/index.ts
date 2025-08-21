// and we dont required to write app.listen(3000) something like this 
import { Hono } from 'hono'

const app = new Hono();

app.post("/api/v1/signup", async (c)=>{
  const body= await c.req.json();
  console.log(body);
  console.log(c.req.query());
  console.log(c.req.header("Authorization"));
  // console.log(c.req.param())
  // console.log(c.req,)
  return c.json({
    message : "User is chirag"
  })
});

app.post("/api/v1/signin",(c)=>{
  return c.json({
    message : "User is chirag"
  })
});


app.post("/api/v1/todo",(c)=>{
  return c.json({
    message : "User is chirag"
  })
});

export default app