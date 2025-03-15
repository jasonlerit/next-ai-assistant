import { QueryKey } from "@/common/types/query-key.type"
import { authClient } from "@/lib/auth-client"
import { getQueryClient } from "@/lib/react-query"
import { useQuery } from "@tanstack/react-query"

export function useAuthSession() {
  const queryClient = getQueryClient()

  const { data, isPending } = useQuery({
    queryKey: [QueryKey.USER],
    queryFn: async () => await authClient.getSession(),
  })

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QueryKey.USER] })
        },
      },
    })
  }

  return {
    user: data?.data?.user,
    isPending,
    handleLogout,
  }
}
