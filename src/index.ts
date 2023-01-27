import blogsRouter from "./routes/blogs.route";
import postsRouter from "./routes/posts.route";
import testingRouter from "./routes/testing.route";

import { applicationConfig } from "./middleware/config/application";

const app = applicationConfig();

/**
 *  Routes
 */

app.use("/api/blogs", blogsRouter);
app.use("/api/posts", postsRouter);
app.use("/api/testing", testingRouter);

export { BlogPostInputModel } from "./service-layer/request/requestTypes";
export { PostInputModel } from "./service-layer/request/requestTypes";
export { BlogInputModel } from "./service-layer/request/requestTypes";
export { PostViewModel } from "./service-layer/response/responseTypes";
export { BlogViewModel } from "./service-layer/response/responseTypes";
