import React, { useState } from 'react'
import { assets,  ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

import toast from 'react-hot-toast';

const Sidebar = () => {

  const {user,axios,fetchUser} = useAppContext()
  const location = useLocation();
  const [image, setImage] = useState(null);

  const updateImage = async () => {
    try{
      const formData = new FormData()
      formData.append('image',image)

      const {data} = await axios.post('/api/owner/update-image', formData)


      if(data.success){
        fetchUser()
        toast.success(data.message)
        setImage('')
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
       toast.error(error.message)
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-8 max-w-[240px] w-full border-borderColor text-sm">
      {/* Profile Image */}
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : user?.image || "/profile.jpg"}
            alt="profile"
            className="h-24 w-24 md:h-28 md:w-28 rounded-full mx-auto object-cover"
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={e => setImage(e.target.files[0])}
          />

          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} alt="edit" />
          </div>
        </label>
      </div>

      {image && (
        <button
          onClick={updateImage}
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer">
          Save
          <img src={assets.check_icon} width={13} alt="save" />
        </button>
      )}

      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      {/* Menu Links */}
      <div className="w-full mt-4">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-2 ${
              link.path === location.pathname
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600'
            }`}
          >
            <img
              src={link.path === location.pathname ? link.coloredIcon : link.icon}
              alt="menu-icon"
            />
            <span className="max-md:hidden">{link.name}</span>

            <div
              className={`w-1.5 h-8 rounded-1 right-0 absolute ${
                link.path === location.pathname ? 'bg-primary' : ''
              }`}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
