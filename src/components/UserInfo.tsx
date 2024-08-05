const UserInfo = () => {
 return (
   <header className="flex gap-10 justify-between items-center px-2 py-5">
     <div className="flex items-center gap-5">
       <img src="/public/avatar.png" alt="Profile photo" className="w-12 h-12 rounded-full" />
       <div className="text-white">John Doe</div>
     </div>
     <div className="flex gap-4">
       <img src="/public/more.png"  className="w-6 h-6 " alt="" />
       <img src="/public/video.png" className="w-6 h-6 "  alt="" />
       <img src="/public/edit.png"  className="w-6 h-6 " alt="" />
     </div>
   </header>
 );
};

export default UserInfo;
