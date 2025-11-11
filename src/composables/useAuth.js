import { ref } from "vue";
import { supabase } from "@/supabase";

const user = ref(null);
const initialized = ref(false);

export function useUserAuth() {
  const init = async () => {
    if (initialized.value) return;
    initialized.value = true;

    const { data } = await supabase.auth.getUser();
    user.value = data?.user || null;

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null;
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  init();

  return { user, logout };
}
