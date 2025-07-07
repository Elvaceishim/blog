   // src/lib/__mocks__/supabaseClient.js
   export const supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          // Return mock data and no error
          data: [],
          error: null,
        }),
      }),
    }),
  };