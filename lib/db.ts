// Simplified database utilities - replace with actual database later
export const db = {
  ticket: {
    findMany: async () => [],
    create: async (data: any) => ({ id: "1", ...data }),
    update: async (id: string, data: any) => ({ id, ...data }),
    delete: async (id: string) => ({ id }),
  },
  user: {
    findMany: async () => [],
    create: async (data: any) => ({ id: "1", ...data }),
    update: async (id: string, data: any) => ({ id, ...data }),
    delete: async (id: string) => ({ id }),
  },
}
