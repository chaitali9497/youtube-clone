import { BiLike, BiDislike } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { MdPlaylistAdd } from "react-icons/md";

function VideoActions() {
  return (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-full">
        <BiLike /> 2.3K
      </button>
      <button className="bg-gray-100 px-4 py-2 rounded-full">
        <BiDislike />
      </button>
      <button className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-full">
        <FiShare /> Share
      </button>
      <button className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-full">
        <MdPlaylistAdd /> Save
      </button>
    </div>
  );
}

export default VideoActions;
