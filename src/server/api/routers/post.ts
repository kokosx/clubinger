import { attendingUserProcedure, createTRPCRouter } from "../trpc";
import {
  addPostSchema,
  getPostSchema,
  likePostSchema,
} from "../../../schemas/post";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  addPost: attendingUserProcedure
    .input(addPostSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          title: input.title,
          description: input.description,
          clubId: ctx.clubId,
          createdBy: ctx.user.id,
        },
      });
      return { message: "Success !", post };
    }),
  likePost: attendingUserProcedure
    .input(likePostSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.postLike.createMany({
        data: { userId: ctx.user.id, postId: input.postId },
      });

      return {};
    }),
  unlikePost: attendingUserProcedure
    .input(likePostSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.postLike.deleteMany({
        where: { userId: ctx.user.id, postId: input.postId },
      });

      return {};
    }),
  getPost: attendingUserProcedure
    .input(getPostSchema)
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId },
        include: {
          user: {
            select: {
              username: true,
              id: true,
              avatarMediaType: true,
              avatarUrl: true,
            },
          },
          likes: { where: { userId: ctx.user.id } },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return post;
    }),
});
