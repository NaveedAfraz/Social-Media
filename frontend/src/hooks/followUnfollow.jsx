import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await axios.post(
          `https://social-media-85xj.onrender.com/api/user/follow/${userId}`,
          {},
          { withCredentials: true }
        );

        console.log(res.data);

        return res.data;
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong!");
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient
          .invalidateQueries({ queryKey: ["userProfile"] })
          .then(() => {
            console.log("Invalidated userProfile query");
          }),
      ]);
    },
    onError: (error) => {
      console.error("Mutation error:", error.message);
    },
  });

  return { follow, isPending };
};

export default useFollow;
