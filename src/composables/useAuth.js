import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase";

const user = ref(null);

export function useUserAuth() {
  const router = useRouter();

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    user.value = data?.user || null;
  };

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;

    // Redirect to home when logged in
    if (session?.user) {
      router.push("/");
    }
  });

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  getUser();

  return { user, login, logout };
}
