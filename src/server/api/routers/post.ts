import { attendingUserProcedure, createTRPCRouter } from "../trpc";
import {
  addPostSchema,
  getPostSchema,
  likePostSchema,
  savePostSchema,
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
          saved: { where: { savedBy: ctx.user.id } },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return post;
    }),

  savePost: attendingUserProcedure
    .input(savePostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.savedPost.create({
          data: {
            postId: input.postId,
            savedBy: ctx.user.id,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  unsavePost: attendingUserProcedure
    .input(savePostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.savedPost.deleteMany({
          where: {
            postId: input.postId,
            savedBy: ctx.user.id,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});
