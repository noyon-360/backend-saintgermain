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

  await Learn.insertMany(
    Array.from({ length: 6 }).map(() => ({
      type: "book",
      title: "SOUL Activation For The Week Starting Monday 30th Dec 2024",
      thumbnail: "https://example.com/images/soul-activation.jpg",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-12-30"),
      contentUrl: "https://example.com/content/soul-activation.pdf",
    }))
  );

  await Learn.insertMany(
    Array.from({ length: 6 }).map(() => ({
      type: "video",
      title: "SOUL Activation For The Week Starting Monday 30th Dec 2024",
      thumbnail: "https://example.com/images/soul-activation.jpg",
      authorLabel: "MAGNIFICENT WOMAN",
      publishedDate: new Date("2024-12-30"),
      contentUrl: "https://example.com/content/soul-activation.mp4",
    }))
  );

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
