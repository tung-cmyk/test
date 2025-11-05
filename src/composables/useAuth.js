import { ref, onMounted } from "vue";
import { supabase } from "@/supabase"; 

const user = ref(null);
let initialized = false;

export function useAuth() {
  // Initialisiere nur einmal
  if (!initialized) {
    initialized = true;

    onMounted(async () => {
      const { data } = await supabase.auth.getUser();
      user.value = data.user;

      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user ?? null;
      });
    });
  }

  const logout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  return { user, logout };
}
