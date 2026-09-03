import "dotenv/config";
import mongoose from "mongoose";
import Meditation from "../model/meditation.model.js";
import Inspiration from "../model/inspiration.model.js";
import Reflection from "../model/reflection.model.js";
import Announcement from "../model/announcement.model.js";
import Learn from "../model/learn.model.js";
import Notification from "../model/notification.model.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log("MongoDB connected for seeding");

  await Promise.all([
    Meditation.deleteMany({}),
    Inspiration.deleteMany({}),
    Reflection.deleteMany({}),
    Announcement.deleteMany({}),
    Learn.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const meditations = await Meditation.insertMany([
    {
      title: "Crescent Lunge",
      image: "https://example.com/images/crescent-lunge-1.jpg",
      durationMinutes: 15,
      times: 1,
      breakTimeMinutes: 5,
      category: "yoga",
      process:
        "Crescent Lunge is a dynamic yoga posture where one foot steps forward with the front knee bent at about 90°, the back leg stays straight and strong, and the arms reach overhead. The pose opens the hips, stretches the hip flexors, and strengthens the legs and core while improving balance and posture.",
      benefits: [
        "Strengthens the legs, glutes, and core",
        "Stretches the hips, hip flexors, and calves",
        "Improves balance and stability",
        "Opens the chest and shoulders",
        "Enhances focus and body awareness",
      ],
    },
    {
      title: "Crescent Lunge",
      image: "https://example.com/images/crescent-lunge-2.jpg",
      durationMinutes: 15,
      times: 2,
      breakTimeMinutes: 5,
      category: "yoga",
      process:
        "Crescent Lunge is a dynamic yoga posture where one foot steps forward with the front knee bent at about 90°, the back leg stays straight and strong, and the arms reach overhead.",
      benefits: [
        "Strengthens the legs, glutes, and core",
        "Stretches the hips, hip flexors, and calves",
        "Improves balance and stability",
      ],
    },
    {
      title: "Crescent Lunge",
      image: "https://example.com/images/crescent-lunge-3.jpg",
      durationMinutes: 15,
      times: 3,
      breakTimeMinutes: 5,
      category: "yoga",
      process:
        "Crescent Lunge is a dynamic yoga posture where one foot steps forward with the front knee bent at about 90°, the back leg stays straight and strong, and the arms reach overhead.",
      benefits: [
        "Strengthens the legs, glutes, and core",
        "Stretches the hips, hip flexors, and calves",
        "Improves balance and stability",
        "Opens the chest and shoulders",
      ],
    },
  ]);

  const inspirations = await Inspiration.insertMany([
    {
      title: "River Flows in You",
      artist: "Yiruma",
      image: "https://example.com/images/river-flows-in-you.jpg",
      audioUrl: "https://example.com/audio/river-flows-in-you.mp3",
      duration: 203,
    },
    {
      title: "River Flows in You",
      artist: "Yiruma",
      image: "https://example.com/images/river-flows-in-you-2.jpg",
      audioUrl: "https://example.com/audio/river-flows-in-you-2.mp3",
      duration: 203,
    },
  ]);

  await Reflection.create({
    quote: "Breathe deeply. Your soul already knows the way.",
    image: "https://example.com/images/lily-reflection.jpg",
  });

  await Announcement.create({
    title: "New Meditation",
    description: "Letting Go of Anxiety",
    durationMinutes: 15,
    ctaLabel: "Start now",
    linkedMeditation: meditations[0]._id,
  });

  await Learn.insertMany([
    {
      type: "book",
      title: "SOUL Activation For The Week Starting Monday 30th Dec 2024",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-12-30"),
      contentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      type: "book",
      title: "The First 90 Days — Magnificence Reset",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-11-18"),
      contentUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      type: "book",
      title: "Breathwork Guide For Inner Calm",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-10-05"),
      contentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      type: "book",
      title: "Weekly Journal Prompts For Self Love",
      thumbnail: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-09-12"),
      contentUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
      type: "book",
      title: "Sacred Morning Rituals For Women",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-08-22"),
      contentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      type: "book",
      title: "Letting Go Of Anxiety — Workbook",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-07-01"),
      contentUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
  ]);

  await Learn.insertMany([
    {
      type: "video",
      title: "SOUL Activation Guided Session",
      thumbnail: "https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-12-30"),
      contentUrl: "https://www.youtube.com/watch?v=inpok4MKVLM",
    },
    {
      type: "video",
      title: "15 Minute Morning Meditation",
      thumbnail: "https://img.youtube.com/vi/ZToicYcHIOU/hqdefault.jpg",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-11-10"),
      contentUrl: "https://www.youtube.com/watch?v=ZToicYcHIOU",
    },
    {
      type: "video",
      title: "Breath & Body Flow Practice",
      thumbnail: "https://img.youtube.com/vi/1ZYbU82GVz4/hqdefault.jpg",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-10-02"),
      contentUrl: "https://www.youtube.com/watch?v=1ZYbU82GVz4",
    },
    {
      type: "video",
      title: "Evening Wind Down Ritual",
      thumbnail: "https://img.youtube.com/vi/WPni755-Krg/hqdefault.jpg",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-09-08"),
      contentUrl: "https://www.youtube.com/watch?v=WPni755-Krg",
    },
    {
      type: "video",
      title: "Heart Opening Yoga Flow",
      thumbnail: "https://img.youtube.com/vi/v7AYKMP6rOE/hqdefault.jpg",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-08-15"),
      contentUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
    },
    {
      type: "video",
      title: "Confidence Activation Workshop",
      thumbnail: "https://img.youtube.com/vi/DWcJFNfaw9c/hqdefault.jpg",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-07-20"),
      contentUrl: "https://www.youtube.com/watch?v=DWcJFNfaw9c",
    },
  ]);

  await Notification.insertMany([
    { type: "meditation", title: "New Meditation", message: "Letting Go of Anxiety" },
    { type: "inspiration", title: "New Inspiration", message: "Letting Go of Anxiety" },
    { type: "book", title: "New Book", message: "Letting Go of Anxiety", createdAt: new Date(Date.now() - 2 * 86400000) },
    { type: "community", title: "New Community", message: "Letting Go of Anxiety", createdAt: new Date(Date.now() - 5 * 86400000) },
    { type: "podcast", title: "New Podcast", message: "Letting Go of Anxiety", createdAt: new Date(Date.now() - 8 * 86400000) },
    { type: "quote", title: "New Quote", message: "Letting Go of Anxiety", createdAt: new Date(Date.now() - 10 * 86400000) },
  ]);

  console.log("Seed data inserted successfully");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
