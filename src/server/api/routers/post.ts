import {
  attendingUserProcedure,
  authenticatedProcedure,
  createTRPCRouter,
  sendPagination,
} from "../trpc";
import {
  addPostSchema,
  getNewestPostsSchema,
  getSavedPostsSchema,
  getMyPostsSchema,
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
  // getPost: attendingUserProcedure
  //   .input(getPostSchema)
  //   .query(async ({ ctx, input }) => {
  //     const post = await ctx.db.post.findFirst({
  //       where: { id: input.postId },
  //       include: {
  //         user: {
  //           select: {
  //             username: true,
  //             id: true,
  //             avatarMediaType: true,
  //             avatarUrl: true,
  //           },
  //         },
  //         likes: { where: { userId: ctx.user.id } },
  //         saved: { where: { savedBy: ctx.user.id } },
  //         _count: { select: { likes: true, comments: true } },
  //       },
  //       orderBy: { createdAt: "desc" },
  //     });
  //     if (!post) {
  //       throw new TRPCError({ code: "NOT_FOUND" });
  //     }
  //     return post;
  //   }),

  // getMyPosts: authenticatedProcedure
  //   .input(getMyPostsSchema)
  //   .query(async ({ ctx, input }) => {
  //     const items = await ctx.db.post.findMany({
  //       where: {
  //         createdBy: input.userId,
  //         club: {
  //           participants: {
  //             some: {
  //               userId: ctx.user.id,
  //             },
  //           },
  //         },
  //       },
  //       include: {
  //         likes: { where: { userId: ctx!.user.id } },
  //         _count: { select: { likes: true, comments: true } },
  //         saved: true,
  //         user: {
  //           select: {
  //             username: true,
  //             id: true,
  //             avatarMediaType: true,
  //             avatarUrl: true,
  //           },
  //         },
  //       },
  //       cursor: input.cursor ? { id: input.cursor } : undefined,
  //       take: input.limit + 1,
  //       orderBy: { id: "desc" },
  //     });

  //     return sendPagination<typeof items>({
  //       limit: input.limit,
  //       items,
  //       cursor: input.cursor,
  //     });
  //   }),

  getMyPosts: authenticatedProcedure
    .input(getMyPostsSchema)
    .query(async ({ ctx, input }) => {
      await new Promise((res) => setTimeout(res, 5000));
      const items = await ctx.db.post.findMany({
        where: {
          createdBy: ctx.user.id,
        },
        include: {
          likes: { where: { userId: ctx!.user.id } },
          _count: { select: { likes: true, comments: true } },
          saved: true,
          user: {
            select: {
              username: true,
              id: true,
              avatarMediaType: true,
              avatarUrl: true,
            },
          },
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: input.limit + 1,
        orderBy: { id: "desc" },
      });

      return sendPagination<typeof items>({
        limit: input.limit,
        items,
        cursor: input.cursor,
      });
    }),

  getSavedPosts: authenticatedProcedure
    .input(getSavedPostsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const items = await ctx.db.savedPost.findMany({
          where: {
            savedBy: ctx.user.id,
          },
          include: {
            post: {
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
            },
          },
          take: input.limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          orderBy: { id: "desc" },
        });

        const posts = items.map((v) => v.post);

        return sendPagination<typeof posts>({
          limit: input.limit,
          items: posts,
          cursor: input.cursor,
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  getNewestPosts: attendingUserProcedure
    .input(getNewestPostsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const items = await ctx.db.post.findMany({
          where: { clubId: Number(input.clubId) },
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

          orderBy: { id: "desc" },
          take: input.limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
        });
        return sendPagination({
          items,
          cursor: input.cursor,
          limit: input.limit,
        });
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
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
