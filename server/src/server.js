import app from "./app/app.js";
import { connectDb } from "./config/db.js";
import ENV from "./ENV/index.js";


await connectDb();

app.listen(ENV.PORT, ()=>{
    console.log(`Server is running on port ${ENV.PORT}`);
})