# Velvet Stream

Build a Premium Video Streaming Website with Hidden Admin Panel



Act as a Senior Full-Stack Developer, UI/UX Designer, and Cloudflare Developer.



Build a complete, modern, premium video streaming website with a professional gradient background, beautiful animations, and responsive design.



1. Design & UI/UX



- Premium dark theme with beautiful gradient backgrounds.

- Modern glassmorphism UI.

- Smooth animations and hover effects.

- Professional typography.

- Beautiful video thumbnail cards.

- Fully responsive for mobile, tablet, and desktop.

- Clean and minimal interface.

- Premium international streaming platform appearance.



2. Homepage



- Professional website header.

- Website logo and name.

- Featured video section.

- Latest videos section.

- Responsive video card grid.

- Each video card displays thumbnail and video title.

- Clicking a video opens a professional video player.

- Support direct video URLs and supported embedded video links.

- Add search functionality to find videos by title.



3. Hidden Admin Panel



The admin access must remain hidden from normal visitors.



- Add a very small hidden clickable area at the bottom-right corner of the website.

- When the user clicks that area exactly 7 times, open the Admin Login page.

- Reset the click counter if the user stops clicking for a few seconds.

- Do not show any visible Admin button or Admin link.



4. Admin Login



- Secure admin login with password authentication.

- Store the admin password in Cloudflare Environment Variables / Secrets.

- Never expose admin credentials in frontend JavaScript.



5. Admin Dashboard



Keep the dashboard extremely simple.



Only include these fields:



1. Video Title

2. Video Link

3. Submit Button



After clicking Submit:



- Save the video information to the database.

- Automatically display the new video on the homepage.

- Show a success message.

- Validate empty fields and invalid URLs.



Also include a simple video list in the admin dashboard with a Delete button for each video.



Do not add unnecessary settings, categories, descriptions, or complicated options.



6. Backend & Database



Use:



- Cloudflare Pages

- Cloudflare Pages Functions

- Cloudflare D1 Database

- JavaScript or TypeScript

- HTML, CSS, and modern frontend framework if needed.



Create API endpoints for:



- Fetching all videos.

- Adding a new video.

- Deleting a video.

- Admin authentication.



Protect all admin API endpoints with proper authentication and server-side authorization.



7. Cloudflare Deployment



The project must be fully compatible with:



GitHub Repository → Cloudflare Pages → Automatic Deployment.



Provide:



- Complete source code.

- Proper project folder structure.

- Cloudflare Pages configuration.

- D1 database schema and migration SQL.

- Environment variable setup instructions.

- Deployment instructions.

- README.md.



Do not use localStorage as the main video database.



8. Important Requirements



- All features must actually work.

- Do not create a frontend-only demo.

- Do not use fake video data as the permanent database.

- Videos must remain available after refreshing the website.

- Admin authentication must work securely.

- Use Cloudflare D1 for persistent video records.

- Do not expose API secrets or admin passwords.

- Optimize loading speed and mobile performance.

- Use clean, maintainable, production-ready code.



Final Goal



Deliver a complete premium video streaming website with an elegant gradient design, a hidden 7-click admin access system, a simple video upload-by-link dashboard, and full Cloudflare Pages deployment compatibility.



Make the website visually impressive while keeping the admin panel extremely simple.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a4ea5449-b5f8-4002-a1d6-f16ee5c5250d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
