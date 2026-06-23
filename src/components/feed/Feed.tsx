import { auth } from "@clerk/nextjs/server";
import Post from "./Post";
import prisma from "@/lib/client";

const Feed = async ({ username, groupId }: { username?: string, groupId?: string }) => {
  const { userId } = auth();

  let posts:any[] =[];

  if (groupId) {
    posts = await prisma.post.findMany({
      where: {
        groupId: groupId,
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        poll: {
          include: {
            options: {
              include: {
                _count: { select: { votes: true } },
              },
            },
            votes: {
              where: { userId: userId || "" },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (username) {
    posts = await prisma.post.findMany({
      where: {
        user: {
          username: username,
        },
        groupId: null,
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        poll: {
          include: {
            options: {
              include: {
                _count: { select: { votes: true } },
              },
            },
            votes: {
              where: { userId: userId || "" },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (!username && userId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);
    const ids = [userId,...followingIds]

    posts = await prisma.post.findMany({
      where: {
        userId: {
          in: ids,
        },
        groupId: null,
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        poll: {
          include: {
            options: {
              include: {
                _count: { select: { votes: true } },
              },
            },
            votes: {
              where: { userId: userId || "" },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (!username && !userId) {
    posts = await prisma.post.findMany({
      where: {
        groupId: null,
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        poll: {
          include: {
            options: {
              include: {
                _count: { select: { votes: true } },
              },
            },
            votes: {
              where: { userId: userId || "" },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
      {posts.length ? (posts.map(post=>(
        <Post key={post.id} post={post}/>
      ))) : "No posts found!"}
    </div>
  );
};

export default Feed;
