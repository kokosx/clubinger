import { TRPCError } from "@trpc/server";
import { createCommentSchema, likeComment } from "../../../schemas/comment";
import { attendingUserProcedure, createTRPCRouter } from "../trpc";

export const commentRouter = createTRPCRouter({
  createComment: attendingUserProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await ctx.db.postComment.create({
          data: {
            message: input.message,
            postId: input.parentId,
            createdBy: ctx.user.id,
          },
          include: { user: true },
        });
        return { data: comment };
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  createReply: attendingUserProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await ctx.db.postCommentReply.create({
          data: {
            message: input.message,
            postCommentId: input.parentId,
            createdBy: ctx.user.id,
          },
          include: {
            user: true,
          },
        });
        return { data: comment };
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  likeComment: attendingUserProcedure
    .input(likeComment)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.postCommentLike.createMany({
          data: {
            commentId: input.id,
            userId: ctx.user.id,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  unlikeComment: attendingUserProcedure
    .input(likeComment)
    .mutation(async ({ ctx, input }) => {
      console.log("hallo");
      try {
        await ctx.db.postCommentLike.deleteMany({
          where: {
            commentId: input.id,
            userId: ctx.user.id,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  likeCommentReply: attendingUserProcedure
    .input(likeComment)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.postCommentReplyLike.createMany({
          data: {
            replyId: input.id,
            userId: ctx.user.id,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  unlikeCommentReply: attendingUserProcedure
    .input(likeComment)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.postCommentReplyLike.deleteMany({
          where: {
            replyId: input.id,
            userId: ctx.user.id,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});
