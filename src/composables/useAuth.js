import { ref } from "vue";
import { supabase } from "@/supabase";

const user = ref(null);
const role = ref("user");

export function useUserAuth() {
  const fetchUserRole = async (userId) => {
    if (!userId) {
      role.value = "user";
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      role.value = "user";
    } else {
      role.value = profile?.role || "user";
    }
  };

  const init = async () => {
    const { data } = await supabase.auth.getUser();
    user.value = data?.user || null;

    if (user.value) {
      await fetchUserRole(user.value.id);
    }

    // Listen for login/logout changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user || null;
      if (user.value) {
        await fetchUserRole(user.value.id);
      } else {
        role.value = "user";
      }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    user.value = null;
    role.value = "user";
  };

  init();

  return { user, role, logout };
}
