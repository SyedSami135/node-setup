import { db } from "../src/lib/db";

async function main() {
  await db.$transaction(async (tx: any) => {
    // USERS
    const userCount = await tx.users.count();
    let user1, user2;
    if (userCount === 0) {
      [user1, user2] = await Promise.all([
        tx.users.create({
          data: { name: "Alice Smith", email: "alice@example.com" },
        }),
        tx.users.create({
          data: { name: "Bob Johnson", email: "bob@example.com" },
        }),
      ]);
      console.log("Seeded users: 2");
    } else {
      [user1, user2] = await tx.users.findMany({
        take: 2,
        orderBy: { id: "asc" },
      });
      console.log("Users already exist, skipping user seed.");
    }

    // COURSES
    const courseCount = await tx.courses.count();
    let course1, course2;
    if (courseCount === 0) {
      [course1, course2] = await Promise.all([
        tx.courses.create({
          data: { title: "Introduction to Programming", duration: 40 },
        }),
        tx.courses.create({
          data: { title: "Advanced Databases", duration: 30 },
        }),
      ]);
      console.log("Seeded courses: 2");
    } else {
      [course1, course2] = await tx.courses.findMany({
        take: 2,
        orderBy: { id: "asc" },
      });
      console.log("Courses already exist, skipping course seed.");
    }

    // ENROLLMENTS
    const enrollmentCount = await tx.enrollments.count();
    let enrollment1, enrollment2;
    if (enrollmentCount === 0) {
      [enrollment1, enrollment2] = await Promise.all([
        tx.enrollments.create({
          data: {
            user_id: user1.id,
            course_id: course1.id,
            enrolled_on: new Date("2025-10-01"),
            status: "active",
          },
        }),
        tx.enrollments.create({
          data: {
            user_id: user2.id,
            course_id: course2.id,
            enrolled_on: new Date("2025-10-05"),
            status: "completed",
          },
        }),
      ]);
      console.log("Seeded enrollments: 2");
    } else {
      [enrollment1, enrollment2] = await tx.enrollments.findMany({
        take: 2,
        orderBy: { id: "asc" },
      });
      console.log("Enrollments already exist, skipping enrollment seed.");
    }

    // PAYMENTS
    const paymentCount = await tx.payments.count();
    if (paymentCount === 0) {
      await Promise.all([
        tx.payments.create({
          data: {
            enrollment_id: enrollment1.id,
            amount: 199.99,
            paid_on: new Date("2025-10-02"),
          },
        }),
        tx.payments.create({
          data: {
            enrollment_id: enrollment2.id,
            amount: 299.99,
            paid_on: new Date("2025-10-06"),
          },
        }),
      ]);
      console.log("Seeded payments: 2");
    } else {
      console.log("Payments already exist, skipping payment seed.");
    }
  });
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
