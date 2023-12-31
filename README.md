### Youtube Backend Clone Project

[Data Model](https://app.eraser.io/workspace/lkif0q3Vx40o6nSNcuhB?origin=share)

### Endpoints (Created):
1. Register the user:
\
 `http://localhost:8000/api/v1/users/register` 
 \
 (POST: fullName, username, password, email, avatar, coverImage)

2. User Login:
\
 `http://localhost:8000/api/v1/login` 
 \
 (POST: email, password)

3. User Logout: \
`http://localhost:8000/api/v1/users/logout` 
\
(POST)

4. Refresh Token:
\
`http://localhost:8000/api/v1/users/refresh-token` 
\
(POST)

5. Change Current Password: 
\
`http://localhost:8000/api/v1/users/change-password` 
\
(POST: New-password, old-password)

6. Current User: 
\
`http://localhost:8000/api/v1/users/current-user` 
\
(GET: New-password, old-password)

7. Update Account Details:
\
`http://localhost:8000/api/v1/users/update-account` 
\
(PATCH: fullName, email)

8. Update Avatar: 
\
`http://localhost:8000/api/v1/users/avatar` 
\
(PATCH: avatar)

9. Update cover image: 
\
`http://localhost:8000/api/v1/users/cover-image` 
\
(PATCH: coverImage)

10. Get user channel profile: 
\
`http://localhost:8000/api/v1/c/{username}` 
\
(GET)

11. Upload Video File: 
\
`http://localhost:8000/api/v1/users/upload-video` 
\
(POST: title, description, videoFile, thumbnail(Image))

12. Retrieve Video Files associated with a channel:
\
`http://localhost:8000/api/v1/users/channel-videos`
\
(GET)

13. Retrieve Channel details without logging in:
\
`http://localhost:8000/api/v1/search/profile/{username}`
\
(GET)

14. Like Video
\
`http://localhost:8000/api/v1/users/v/{videoId}/like`
\
(POST)

15. Dislike Video
\
`http://localhost:8000/api/v1/users/v/{videoId}/dislike`
\
(POST)

16. Search video while user is logged in
\
`http://localhost:8000/api/v1/users/v/{videoId}`
\
(POST)

17. Comment on Videos
\
`http://localhost:8000/api/v1/users/v/{videoId}/comment`
\
(POST: comment)

18. Like comments
\
`http://localhost:8000/api/v1/users/v/{videoId}/like/comment/{commentId}`
\
(POST)

### Pending Tasks:
1. User must be able to retrieve the history.
2. Creating playlists according to video titles provided. Associated with user profile.
3. Publishing and unpublishing of video from User end.




