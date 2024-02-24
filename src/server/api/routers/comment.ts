import { TRPCError } from "@trpc/server";
import { createCommentSchema } from "../../../schemas/comment";
import { attendingUserProcedure, createTRPCRouter } from "../trpc";

export const commentRouter = createTRPCRouter({
  createComment: attendingUserProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await ctx.db.postComment.create({
          data: {
            message: input.message,
            postId: input.postId,
            createdBy: ctx.user.id,
          },
        });
        return { data: comment };
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});
