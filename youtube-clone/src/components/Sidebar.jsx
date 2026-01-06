import {
  FiHome,
  FiClock,
  FiSettings,
  FiHelpCircle,
  FiFlag,
} from "react-icons/fi";
import { MdOutlineSubscriptions, MdMusicNote } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { RiMovie2Line, RiShoppingBagLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";
import { BsPlayBtn } from "react-icons/bs";

function Sidebar({ isOpen }) {
  return (
    <aside
      className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-white 
  overflow-y-auto transition-all duration-300 sidebar-scroll
  ${isOpen ? "w-60" : "w-20"}`}
    >
      {isOpen ? <FullSidebar /> : <MiniSidebar />}
    </aside>
  );
}

export default Sidebar;

function MiniSidebar() {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <MiniItem icon={<FiHome />} label="Home" />
      <MiniItem icon={<SiYoutubeshorts />} label="Shorts" />
      <MiniItem icon={<MdOutlineSubscriptions />} label="Subscriptions" />
      <MiniItem icon={<BiUserCircle className="text-xl" />} label="sign in" />
    </div>
  );
}

function MiniItem({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg">
      <span className="text-2xl text-gray-700">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function FullSidebar() {
  return (
    <>
      <Section>
        <Item icon={<FiHome />} label="Home" active />
        <Item icon={<SiYoutubeshorts />} label="Shorts" />
        <Item icon={<MdOutlineSubscriptions />} label="Subscriptions" />
        <Item icon={<BiUserCircle />} label="You" />
        <Item icon={<FiClock />} label="History" />
      </Section>

      <Divider />

      <div className="px-4 py-3 text-sm text-gray-700">
        <p>Sign in to like videos,</p>
        <p>comment, and subscribe.</p>
        <button className="mt-3 flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-full text-blue-600 hover:bg-gray-100">
          <BiUserCircle className="text-xl" />
          Sign in
        </button>
      </div>

      <Divider />

      <Section title="Explore">
        <Item icon={<RiShoppingBagLine />} label="Shopping" />
        <Item icon={<MdMusicNote />} label="Music" />
        <Item icon={<RiMovie2Line />} label="Movies" />
      </Section>

      <Divider />

      <Section title="More from YouTube">
        <Item icon={<FaYoutube className="text-red-600" />} label="YouTube Premium" />
        <Item icon={<BsPlayBtn className="text-red-600" />} label="YouTube Music" />
        <Item icon={<FaYoutube className="text-red-600" />} label="YouTube Kids" />
      </Section>

      <Divider />

      <Section>
        <Item icon={<FiSettings />} label="Settings" />
        <Item icon={<FiFlag />} label="Report history" />
        <Item icon={<FiHelpCircle />} label="Help" />
      </Section>

      <div className="px-4 py-4 text-xs text-gray-500 space-y-2">
        <p>About · Press · Copyright · Contact us · Creators · Advertise · Developers</p>
        <p>Terms · Privacy · Policy & Safety · How YouTube works · Test new features</p>
        <p>© 2026 Google LLC</p>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="px-2 py-2">
      {title && (
        <h3 className="px-3 py-2 text-sm font-semibold text-gray-600">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function Item({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer
      ${active ? "bg-gray-100 font-medium" : "hover:bg-gray-100"}`}
    >
      <span className="text-xl text-gray-700">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-200 my-2" />;
}
