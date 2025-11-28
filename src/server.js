import { env } from './config/env.js';
import { connectDB } from './db/mongoose.js';
import app from './app.js';


(async () => {
try {
// Connect to MongoDB
await connectDB();
console.log('✅ MongoDB Connected');


// Start Express server
app.listen(env.port, () => {
console.log(`🚀 Server running at http://localhost:${env.port}`);
});
} catch (err) {
console.error('❌ Server startup failed:', err);
process.exit(1);
}
})();