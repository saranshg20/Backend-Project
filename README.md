### Youtube Backend Clone Project

Data model: [Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

### Endpoints (Created):
1. Register the user: `http://localhost:8000/api/v1/users/register` (POST: fullName, username, password, email, avatar, coverImage)

2. User Login: `http://localhost:8000/api/v1/login` (POST: email, password)

3. User Logout: `http://localhost:8000/api/v1/users/logout` (POST)

4. Refresh Token: `http://localhost:8000/api/v1/users/refresh-token` (POST)

5. Change Current Password: `http://localhost:8000/api/v1/users/change-password` (POST: New-password, old-password)

6. Current User: `http://localhost:8000/api/v1/users/current-user` (GET: New-password, old-password)

7. Update Account Details: `http://localhost:8000/api/v1/users/update-account` (PATCH: fullName, email)

8. Update Avatar: `http://localhost:8000/api/v1/users/avatar` (PATCH: avatar)

9. Update cover image: `http://localhost:8000/api/v1/users/cover-image` (PATCH: coverImage)

10. Get user channel profile: `http://localhost:8000/api/v1/c/{username}` (GET)

11. Upload Video File: `http://localhost:8000/api/v1/users/upload-video` (POST: title, description, videoFile, thumbnail(Image))

### Endpoints (Pending):
1. User must be able to retrive the history.
2. Return video details according to title of video provided in request. Independent of user.
3. Creating playlists according to video titles provided. Associated with user profile.
4. Comments in videos uploaded. 
5. Likes in videos and comments.
6. Publishing and unpublishing of video from User end.




