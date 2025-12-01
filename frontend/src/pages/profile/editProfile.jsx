import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { BiCloset } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isAuth } from "../../redux/authSlice";

const EditProfileModal = ({ user }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    link: user?.link || "",
    newPassword: "",
    currentPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userInfo = useSelector((state) => state.auth.user);
  const {
    isError,
    isSuccess,
    isLoading: isUpdating,
    mutateAsync: updateProfile,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/updateUser/${user?._id}`,
          {
            username: formData.username,
            fullName: formData.fullName,
            email: formData.email,
            bio: formData.bio,
            link: formData.link,
            newPassword: formData.newPassword,
            currentPassword: formData.currentPassword,
          },
          { withCredentials: true }
        );
        console.log(res);
        return res.data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      console.log(data);
      if (data) {
        document.getElementById("edit_profile_modal").close();
      }
      queryClient
        .invalidateQueries(["userProfile"])
        .then(() => {
          console.log("Successfully invalidated 'userProfile' queries.");
        })
        .catch((err) => {
          console.error("Error invalidating 'userProfile' queries:", err);
        });

      setFormData({});
      naviagte(`/profile/${formData.username}`);
      dispatch(isAuth(data));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const naviagte = useNavigate();
  const handleUpdate = () => {
    updateProfile();
  };
  return (
    <>
      <button
        className="px-4 py-1.5 bg-transparent border border-gray-600 rounded-full text-white hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 font-medium text-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box bg-black border border-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  document.getElementById("edit_profile_modal").close()
                }
                className="p-2 hover:bg-gray-900 rounded-full transition-colors duration-200"
              >
                <IoClose className="w-5 h-5 text-white" />
              </button>
              <h3 className="text-xl font-bold text-white">Edit profile</h3>
            </div>
            <button
              onClick={() => handleUpdate()}
              disabled={isUpdating}
              className="px-4 py-1.5 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-6">
            {/* Username */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-900/50 transition-all duration-200"
                  value={formData.username || ""}
                  name="username"
                  onChange={handleInputChange}
                  maxLength={15}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.username?.length || 0}/15</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
              <textarea
                placeholder="Tell us about yourself"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-900/50 transition-all duration-200 resize-none"
                value={formData.bio || ""}
                name="bio"
                onChange={handleInputChange}
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio?.length || 0}/160</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-900/50 transition-all duration-200"
                value={formData.email || ""}
                name="email"
                onChange={handleInputChange}
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Website</label>
              <input
                type="text"
                placeholder="https://yourwebsite.com"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-900/50 transition-all duration-200"
                value={formData.link || ""}
                name="link"
                onChange={handleInputChange}
              />
            </div>

            {/* Password Section */}
            <div className="border-t border-gray-800 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Change password</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-900/50 transition-all duration-200"
                    value={formData.currentPassword}
                    name="currentPassword"
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">New password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-900/50 transition-all duration-200"
                    value={formData.newPassword}
                    name="newPassword"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-black/50">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
