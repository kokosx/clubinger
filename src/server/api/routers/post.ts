import { attendingUserProcedure, createTRPCRouter } from "../trpc";
import { addPostSchema, likePostSchema } from "../../../schemas/post";

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
});
