import React from 'react';
import VideoCard from './VideoCard';
import axios from 'axios';

// const videos = [
//   {
//     id: 1,
//     thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn-48Gw8eVAildx0KaLDHxIQ1lnIE4tj6itZRN8LTS8xt2gvSUL6DDvwll2L0aze2JVh32Zkrn_VQmQYxbL_LwYUOFtpFt_duNHfB3fBA_e-TcLnmix9FsfV54g3dP5z6E_m0Z1GehsY6gi9jtv6X_Um7HBTxGM3GalETJ5ENeZWOXdjqACdglbBWp96dxuv6inyaZOPGknaydMlGdrY8Wvl4PoS-JkuiBA1bZQoLX64lji3W3NKkuYg',
//     duration: '12:45',
//     title: 'The Next Generation of Mobile Computing is Here',
//     channel: 'TechVision',
//     views: '1.2M views',
//     timestamp: '2 days ago',
//     avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpMKaeSIixKz5j1BtMbkYpw6wxogPDJ_e-cgDPe7cwASj7DOlMroGf-UDLX9rHkLLQ1VrvGTBU1zLvb4TVTR8CjG5-Tmnkuoq0iAY3iWWTk6XiGTKo9sTt7z0_WLfY9I0sZPd7LA3vF9VfaZJj5BjUSHZDE7ah9w97rf1dhcDbP74kDsGxZkunt_Bir0fkONu-o4KqL0vCdZo8N4Pr12Em0dj6UXvLVBAV0naKS2vN01nY3GvHZdL_A',
//   },
//   {
//     id: 2,
//     thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3L3Hlw2A8d8eV_CTMW3EpQnxOX87qn4DHU8h9Z2CRU9Tct1wpUkH2ilShcfmbcIqx1k37EMftRq1ikb1JZ1JMW3kbYOqe4DLJ0Xq3Gp2uK_O6FaUtM8gQyYqkHxOoc0yviCbfKlMMYy8QuMVOA-TueJ5ADL92KAVineo1IP3iPTD4WJkvc-h2Q0-cKWOM-QLUOtkIlWI38bxfjBsvXsQIdkFNQulAdEToamegyuTtsmP-ajXiv4jtrQ',
//     duration: '4:20',
//     title: 'Echoes - Live at The Grand Arena 2024',
//     channel: 'SoundScape',
//     views: '850K views',
//     timestamp: '5 hours ago',
//     avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDEhIZShRImbH8ntHnCqiEXPgvZc1NsrzUsw1HedMaqzyXllax6KZ2X1OU-MdNVKyxewKSl9atgSz3MiNk2YHzB0u9F_3Cb_O4HlSLE72SwJVlHLuoTbPfD06ZYXrEzgnFtw44zmemki075JsiXbl3RSzh9wGf0rViVSG-h52TKBiyC2h5B9MY2155vZEVcOxfSArcArYP7b75o_ckDDdvLRC3QlZJ_TnkJT4qOhftuc7asO6tCFibYQ',
//   },
//   {
//     id: 3,
//     thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiRcXO-qXk-FPeQxj4svqVqPANrYFJ5a0F_y7yZR5uwH13uGQAemhWdvxrHPTp0NgtVnBJASexYI5IrMKbhPG_sY5YO604rFnu_Jp2Iippj8boNkAd2ER9HTYO4_thqe-4MM8I94luBW3Hrm2ZtEuKSz-l571Ab_LI6Z2gFu2jcnR-62LqDpagB-JlkapnA1pmrF-f64lt9QId1hCP67L75NiLihjRWm68dTabzNmLlCaVxE8dsPzRCw',
//     duration: '28:15',
//     title: 'CyberCity 2077 - Max Settings 4K Gameplay Walkthrough Part 1',
//     channel: 'PixelPlay',
//     views: '3.4M views',
//     timestamp: '1 week ago',
//     avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHUOkskAyOkN2Oyo_L5eGpmdhOsRjbobmt6C926AixPX3fIPWsgTmYDzpfMSPNDM9oQWaIkjtxDKGvLm69XRHX_Es-0mnQJwtZ-u21vgQePsOIfTgDejqRhS_eQAlXz06SGn3wMlVOBHzZN_VY4qxpPvKQk_eTK2jvitMZ9u0tLWY-rcRWhLzZ3m4Y8CqTiBEVjq2x6jtfeYCCnTeoE5DTp4VmC4KGkjPJyAgwYaDNdu7UR234S-DIow',
//   },
//   {
//     id: 4,
//     thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwwbTBX2MlrE3EMUaikcZaWrYaTvT32d4bDBkO8GmK3LVv40-ndVJVX981vsIWrrDzXw6UKndrTtjB3aFDuIbq5pz0bOP4SEJUGfeBVTzav5CKjYFuGdVzKFCckmSjeq7MX43Dzo3h1mysV3huWnAyNyiNjv2aT75rZqeqVnlhceslei9_mX0vl7HHiVkycDbII3oPrPQSgeuHsbn9E4z2zMfBv8WS4TVdyjuCsgQfdEaoVAI1g8qrdQ',
//     duration: '15:30',
//     title: 'Designing the Perfect Modern Minimalist Home',
//     channel: 'ArchDigest',
//     views: '420K views',
//     timestamp: '3 weeks ago',
//     avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa2hnmCKyjCWf2tQXcIuBZC99CE1iv3kJYhy9IEleh8Zw5YCRU_cbubCO6ckDVfHNmi6C5dxdogfxxa0J1LLqMf6tm3QXjXPIB73aAcVM_czwHyxS8WrjSvt8VUYnJQ7A1YpOpw-DSnquQbJxrVb7GIxeO9nGNsJrp2aFd4aMhIYPZ8SNChlqPnF2LrWtE_UW5fdSOe2U6woacaBftaksdM2FHeQO6BukiIik2ethyyXSYaR8pMe4T_g',
//   },
// ];

const videos = {
    "data": {
        "docs": [
            {
                "_id": "6a79b68f20aaeaed1269593f",
                "videoFile": "http://res.cloudinary.com/dnuu0gvwr/video/upload/v1786361485/o3vvzgpajddebskakl3f.mp4",
                "thumbnail": "http://res.cloudinary.com/dnuu0gvwr/image/upload/v1786361486/xpjkrrkuxu7jjjfaowht.jpg",
                "owner": {
                    "_id": "6a5fa0986a99e90aac76515a",
                    "username": "john",
                    "fullName": "John Doe",
                    "avatar": "https://res.cloudinary.com/dnuu0gvwr/image/upload/v1784651700/images_yz2vis.png"
                },
                "title": "roblox",
                "description": "playing roblox",
                "duration": 0.21,
                "views": 0,
                "isPublished": true,
                "createdAt": "2026-08-10T11:31:27.168Z",
                "updatedAt": "2026-08-10T11:31:27.168Z",
                "__v": 0
            }
        ],
        "totalDocs": 1,
        "limit": 10,
        "page": 1,
        "totalPages": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prevPage": null,
        "nextPage": null
    }
}

// const videos = await axios.get("http://localhost:8080/api/videos")

function VideoGrid() {
  return (
    <div className="p-4 md:p-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
      {videos.data.docs.map((video) => (
        <VideoCard key={video._id} {...video} />
      ))}
    </div>
  );
}

export default VideoGrid;