"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "./client";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { calculateSearchScore } from "./algorithms/levenshtein";

export const ensureUserExists = async (userId: string) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        let username = clerkUser.username || clerkUser.firstName || `user_${userId.slice(-6)}`;
        const existingUsername = await prisma.user.findUnique({
          where: { username },
        });
        if (existingUsername) {
          username = `${username}_${Math.floor(Math.random() * 1000)}`;
        }
        await prisma.user.create({
          data: {
            id: userId,
            username,
            avatar: clerkUser.imageUrl || "/noAvatar.png",
            cover: "/noCover.png",
          },
        });
      } else {
        await prisma.user.create({
          data: {
            id: userId,
            username: `user_${userId.slice(-6)}`,
            avatar: "/noAvatar.png",
            cover: "/noCover.png",
          },
        });
      }
    } catch (err) {
      console.log("Error auto-inserting user:", err);
    }
  }
};

export const switchFollow = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not authenticated!");
  }

  await ensureUserExists(currentUserId);

  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
    revalidatePath("/");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const switchBlock = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  await ensureUserExists(currentUserId);

  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
    revalidatePath("/");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const acceptFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  await ensureUserExists(currentUserId);

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
    revalidatePath("/");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const declineFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  await ensureUserExists(currentUserId);

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
    revalidatePath("/");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string }
) => {
  const { formData, cover } = payload;
  const fields = Object.fromEntries(formData);

  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value !== "")
  );

  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = Profile.safeParse({ cover, ...filteredFields });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  const { userId } = auth();

  if (!userId) {
    return { success: false, error: true };
  }

  await ensureUserExists(userId);

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const switchLike = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  await ensureUserExists(userId);

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const addComment = async (postId: number, desc: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  await ensureUserExists(userId);

  try {
    const createdComment = await prisma.comment.create({
      data: {
        desc,
        userId,
        postId,
      },
      include: {
        user: true,
      },
    });

    return createdComment;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addPost = async (formData: FormData, img: string, groupId?: string) => {
  const desc = formData.get("desc") as string;
  const pollOptionsStr = formData.get("pollOptions") as string;
  const pollTitle = formData.get("pollTitle") as string;

  const Desc = z.string().max(255);
  const validatedDesc = Desc.safeParse(desc);

  if (!validatedDesc.success) {
    console.log("description is not valid");
    return;
  }
  
  if (!validatedDesc.data && !img && !pollOptionsStr) {
    console.log("Post must have text, image, or a poll");
    return;
  }
  
  let pollOptions: string[] = [];
  if (pollOptionsStr) {
    try {
      pollOptions = JSON.parse(pollOptionsStr);
    } catch (e) {
      console.log("Invalid poll options");
    }
  }

  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  await ensureUserExists(userId);

  try {
    const postData: any = {
      desc: validatedDesc.data,
      userId,
      img,
      groupId: groupId || null,
    };

    if (pollOptions.length >= 2) {
      postData.poll = {
        create: {
          title: pollTitle || null,
          options: {
            create: pollOptions.map(opt => ({ option: opt }))
          }
        }
      };
    }

    await prisma.post.create({
      data: postData,
    });

    revalidatePath("/");
    if (groupId) {
      revalidatePath(`/red-unefa`);
    }
  } catch (err) {
    console.log(err);
  }
};

export const votePoll = async (pollId: number, pollOptionId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  await ensureUserExists(userId);

  try {
    const existingVote = await prisma.pollVote.findUnique({
      where: {
        userId_pollId: {
          userId,
          pollId,
        },
      },
    });

    if (existingVote) {
      // Si el usuario ya votó, podríamos permitirle cambiar su voto, o simplemente ignorarlo.
      // Aquí actualizamos su voto.
      await prisma.pollVote.update({
        where: { id: existingVote.id },
        data: { pollOptionId },
      });
    } else {
      await prisma.pollVote.create({
        data: {
          userId,
          pollId,
          pollOptionId,
        },
      });
    }

    revalidatePath("/");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const addStory = async (img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  await ensureUserExists(userId);

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }
    const createdStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/");
    return createdStory;
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId,
      },
    });
    revalidatePath("/")
  } catch (err) {
    console.log(err);
  }
};

export const searchUsers = async (query: string) => {
  if (!query || query.trim() === "") return [];

  try {
    // Obtenemos todos los usuarios (para un proyecto grande se limitaría la búsqueda en DB primero)
    // Para demostrar el algoritmo, lo hacemos en memoria.
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        avatar: true,
      },
    });

    const scoredUsers = users.map(user => {
      const score = calculateSearchScore(query, user.username, user.name, user.surname);
      return { ...user, score };
    });

    // Filtramos los que tienen un score > 0 y ordenamos de mayor a menor relevancia
    const topUsers = scoredUsers
      .filter(user => user.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Tomamos los 5 mejores resultados

    return topUsers;
  } catch (err) {
    console.log("Error searching users:", err);
    return [];
  }
};

export const sendMessage = async (receiverId: string, content: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User is not authenticated!");

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId: currentUserId,
        receiverId,
        content,
      },
    });
    // Si la UI se basa en RSC, podríamos revalidar el path
    // revalidatePath(`/messages/${receiverId}`);
    return newMessage;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send message");
  }
};

export const getMessages = async (otherUserId: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User is not authenticated!");

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch messages");
  }
};

export const getConversations = async () => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User is not authenticated!");

  try {
    const sentMessages = await prisma.message.findMany({
      where: { senderId: currentUserId },
      select: { receiverId: true, receiver: { select: { id: true, username: true, name: true, surname: true, avatar: true } } },
      distinct: ['receiverId']
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: currentUserId },
      select: { senderId: true, sender: { select: { id: true, username: true, name: true, surname: true, avatar: true } } },
      distinct: ['senderId']
    });

    const usersMap = new Map();
    sentMessages.forEach(m => m.receiver && usersMap.set(m.receiver.id, m.receiver));
    receivedMessages.forEach(m => m.sender && usersMap.set(m.sender.id, m.sender));

    return Array.from(usersMap.values());
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch conversations");
  }
};

export const markMessagesAsRead = async (otherUserId: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) return;

  try {
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  } catch (err) {
    console.log("Error marking messages as read:", err);
  }
};

export const getUnreadMessages = async () => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) return [];

  try {
    const unreadMessages = await prisma.message.findMany({
      where: {
        receiverId: currentUserId,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Agrupar por remitente (solo queremos mostrar la última notificación por usuario)
    const uniqueSenders = new Map();
    unreadMessages.forEach((msg) => {
      if (!uniqueSenders.has(msg.senderId)) {
        uniqueSenders.set(msg.senderId, msg);
      }
    });

    return Array.from(uniqueSenders.values());
  } catch (err) {
    console.log("Error fetching unread messages:", err);
    return [];
  }
};

export const toggleGroupMembership = async (groupId: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  await ensureUserExists(userId);

  try {
    const existingMembership = await prisma.groupMember.findFirst({
      where: {
        userId,
        groupId,
      },
    });

    if (existingMembership) {
      await prisma.groupMember.delete({
        where: {
          id: existingMembership.id,
        },
      });
    } else {
      await prisma.groupMember.create({
        data: {
          userId,
          groupId,
        },
      });
    }

    revalidatePath(`/${groupId}`);
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const updateAuthorityImage = async (key: string, url: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  // Aquí idealmente validaríamos que el usuario es administrador
  try {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: url },
      create: { key, value: url },
    });
    revalidatePath("/info-unefa/linea-mando");
  } catch (err) {
    console.log("Error updating authority image:", err);
    throw new Error("Failed to update authority image");
  }
};

export const createProduct = async (formData: FormData, img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  await ensureUserExists(userId);

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const category = formData.get("category") as string;

  if (!title || !description || !priceStr || !category) {
    throw new Error("Missing required fields");
  }

  const price = parseFloat(priceStr);

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        img,
        userId,
      },
    });

    revalidatePath("/marketplace");
    return product;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const deleteProduct = async (productId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.product.delete({
      where: {
        id: productId,
        userId, // Solo el dueño puede borrarlo
      },
    });
    revalidatePath("/marketplace");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const createGroupChat = async (name: string, memberIds: string[]) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User is not authenticated!");

  try {
    const uniqueMemberIds = Array.from(new Set(memberIds)).filter(id => id !== currentUserId);
    
    const groupChat = await prisma.groupChat.create({
      data: {
        name,
        creatorId: currentUserId,
        members: {
          create: [
            { userId: currentUserId }, // El creador también es miembro
            ...uniqueMemberIds.map(id => ({ userId: id }))
          ]
        }
      }
    });

    revalidatePath("/messages");
    return groupChat;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create group chat");
  }
};

export const sendGroupMessage = async (groupChatId: number, content: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User is not authenticated!");

  try {
    // Verificar si el usuario es miembro del grupo
    const membership = await prisma.groupChatMember.findUnique({
      where: {
        groupChatId_userId: {
          groupChatId,
          userId: currentUserId
        }
      }
    });

    if (!membership) throw new Error("Not a member of this group");

    const newMessage = await prisma.message.create({
      data: {
        senderId: currentUserId,
        groupChatId,
        content,
      },
      include: {
        sender: true
      }
    });

    return newMessage;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send group message");
  }
};

export const getGroupMessages = async (groupChatId: number) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User is not authenticated!");

  try {
    // Verificar si el usuario es miembro
    const membership = await prisma.groupChatMember.findUnique({
      where: {
        groupChatId_userId: {
          groupChatId,
          userId: currentUserId
        }
      }
    });

    if (!membership) throw new Error("Not a member of this group");

    const messages = await prisma.message.findMany({
      where: {
        groupChatId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            surname: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch group messages");
  }
};

export const getMyGroupChats = async () => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User is not authenticated!");

  try {
    const groupMemberships = await prisma.groupChatMember.findMany({
      where: {
        userId: currentUserId
      },
      include: {
        groupChat: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    return groupMemberships.map(m => m.groupChat);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch group chats");
  }
};

export const getGroupChatDetails = async (groupChatId: number) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) return null;

  try {
    const groupChat = await prisma.groupChat.findUnique({
      where: { id: groupChatId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, username: true, name: true, surname: true, avatar: true }
            }
          }
        }
      }
    });

    // Check membership
    if (!groupChat?.members.some(m => m.userId === currentUserId)) {
      return null;
    }

    return groupChat;
  } catch (err) {
    console.log(err);
    return null;
  }
};
