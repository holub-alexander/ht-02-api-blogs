import { BlogsQueryRepository } from "./repositories/blogs/blogs-query-repository";
import { BlogsWriteRepository } from "./repositories/blogs/blogs-write-repository";
import { BlogsService } from "../service-layer/services/blogs-service";
import { BlogsController } from "../service-layer/controllers/blogs-controller";
import { PostsQueryRepository } from "./repositories/posts/posts-query-repository";
import { PostsWriteRepository } from "./repositories/posts/posts-write-repository";
import { PostsService } from "../service-layer/services/posts-service";
import { PostsController } from "../service-layer/controllers/posts-controller";
import { CommentsQueryRepository } from "./repositories/comments/comments-query-repository";
import { CommentsWriteRepository } from "./repositories/comments/comments-write-repository";
import { CommentsService } from "../service-layer/services/comments-service";
import { CommentsController } from "../service-layer/controllers/comments-controller";
import { TestingController } from "../service-layer/controllers/testing-controller";
import { UsersQueryRepository } from "./repositories/users/users-query-repository";
import { UsersWriteRepository } from "./repositories/users/users-write-repository";
import { UsersController } from "../service-layer/controllers/users-controller";
import { UsersService } from "../service-layer/services/users-service";
import { SecurityQueryRepository } from "./repositories/security/security-query-repository";
import { SecurityWriteRepository } from "./repositories/security/security-write-repository";
import { SecurityService } from "../service-layer/services/security-service";
import { SecurityController } from "../service-layer/controllers/security-controller";
import { AuthService } from "../service-layer/services/auth-service";
import { AuthController } from "../service-layer/controllers/auth-controller";
import { ReactionsQueryRepository } from "./repositories/reactions/reactions-query-repository";
import { ReactionsWriteRepository } from "./repositories/reactions/reactions-write-repository";

/**
 * Blogs
 */

const blogsQueryRepository = new BlogsQueryRepository();
const blogsWriteRepository = new BlogsWriteRepository(blogsQueryRepository);
export const blogsService = new BlogsService(blogsQueryRepository, blogsWriteRepository);

/**
 * Users
 */

const usersQueryRepository = new UsersQueryRepository();
const usersWriteRepository = new UsersWriteRepository(usersQueryRepository);
const usersService = new UsersService(usersQueryRepository, usersWriteRepository);

/* Reactions */

const reactionsQueryRepository = new ReactionsQueryRepository();
const reactionsWriteRepository = new ReactionsWriteRepository();

/**
 * Comments
 */

const commentsQueryRepository = new CommentsQueryRepository();
const commentsWriteRepository = new CommentsWriteRepository(commentsQueryRepository);
const commentsService = new CommentsService(
  commentsQueryRepository,
  commentsWriteRepository,
  usersQueryRepository,
  reactionsQueryRepository,
  reactionsWriteRepository
);

/**
 * Posts
 */

const postsQueryRepository = new PostsQueryRepository();
const postsWriteRepository = new PostsWriteRepository(blogsQueryRepository, postsQueryRepository, blogsService);
const postsService = new PostsService(
  postsQueryRepository,
  postsWriteRepository,
  commentsQueryRepository,
  commentsWriteRepository,
  usersQueryRepository,
  reactionsQueryRepository
);

/**
 * Security devices
 */

export const securityDevicesQueryRepository = new SecurityQueryRepository();
const securityDevicesWriteRepository = new SecurityWriteRepository();
const securityDevicesService = new SecurityService(securityDevicesWriteRepository);

/* Auth */
const authService = new AuthService(
  usersQueryRepository,
  usersWriteRepository,
  securityDevicesWriteRepository,
  securityDevicesService
);

/**
 * Testing
 */

export const testingController = new TestingController(
  blogsWriteRepository,
  postsWriteRepository,
  usersWriteRepository
);

/**
 * Controllers
 */

export const blogsController = new BlogsController(blogsService, postsService, blogsWriteRepository);
export const postsController = new PostsController(postsService, postsWriteRepository);
export const commentsController = new CommentsController(
  commentsQueryRepository,
  commentsWriteRepository,
  commentsService,
  usersQueryRepository
);
export const usersController = new UsersController(usersWriteRepository, usersService);
export const securityDevicesController = new SecurityController(
  securityDevicesQueryRepository,
  securityDevicesWriteRepository,
  usersQueryRepository
);
export const authController = new AuthController(authService);
