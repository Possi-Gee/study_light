# **App Name**: ScholarSage

## Core Features:

- User Authentication: User authentication with email/password login, registration, and password reset functionality using Firebase Authentication.
- Home Dashboard: Home dashboard that welcomes the user and provides navigation to notes, quizzes, and profile sections.
- Notes Section: List of study notes categorized by subject. Admins can add, edit, and delete notes via Firestore, without database component
- Quiz Section: Multiple-choice quizzes, auto-scoring, and immediate result feedback.
- Profile Page: Profile page where users can view their name, email, role, and quiz history, with a logout option.
- AI Study Schedule: Generate study schedules using AI. Students enter when they want to take the exam, their goals, the number of study hours that can commit weekly, and LLM generates study plan. The LLM will use reasoning to decide when or if to focus more time on different parts of the study materials, using the tool that informs it on student historical quizzes data, 

## Style Guidelines:

- Primary color: Deep yellow (#FFC107) for a modern feel. 
- Background color: Dark gray (#212121) to provide a sophisticated dark mode experience.
- Accent color: Teal (#008080) to complement the primary color, standing apart in both brightness and saturation to create good contrast.
- Body and headline font: 'Inter' sans-serif for clear readability and a modern feel
- Custom icons with smooth transitions for a better user experience.
- Modern, clean layout for a visually appealing design.
- Subtle animations for smooth transitions and enhanced user experience.