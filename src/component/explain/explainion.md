

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


//Slow or Unindexed Database Queries
```js
User.find({ email: "test@mail.com" });



// example Bottleneck  (N+1)

const posts = await Post.find();// 10 posts
for (const post of posts) {
  post.author = await User.findById(post.authorId);
}

```
// Blocking the Node.js Event Loop
```js
crypto.pbkdf2Sync("pass", "salt", 100000, 64, "sha512");

```
DataBase Opimization slides

1- Create Indexes on Frequently Filtered Fields 
```js
db.users.createIndex({ email: 1 });
```
2 - Use Projection (Don’t Return Full Documents)
```js
❌ غلط
User.find({ isActive: true });// get all document

✅ صح
User.find(
  { isActive: true },
  { email: 1, username: 1 }
);
```
3- Pagination by Default (Always)
```js
User.find()
  .limit(20)
  .skip(40);
```




Reduce Database Calls

Merge Multiple Queries
```js
 ❌
const user = await User.findById(id);
const posts = await Post.find({ userId: id });


✅
const [user, posts] = await Promise.all([
  User.findById(id),
  Post.find({ userId: id }),
]);


// 4 -- Cache Frequently Accessed Data

const cached = await redis.get("user:123");

if (cached) return JSON.parse(cached);

const user = await User.findById(123);
await redis.set("user:123", JSON.stringify(user), "EX", 60);





///Measure Response Time per Route

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});


