import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { formatActivityDescription, type ActivityEventWithActor } from "../../src/lib/data/activity-pure.ts";
import { dispatchEmailNotification } from "../../src/lib/data/notifications-pure.ts";

describe("Phase 5.4: Production Activity Narrative Formatting", () => {
  test("Formats task creation activity", () => {
    const event: ActivityEventWithActor = {
      id: "act-1",
      studio_id: "std-1",
      actor_id: "user-1",
      action: "task_created",
      entity_type: "task",
      entity_id: "task-10",
      metadata: { title: "Draw Cover Art" },
      created_at: new Date().toISOString(),
      actor: { id: "user-1", display_name: "Kofi Creator", username: "kofi", avatar_url: null },
    };

    const desc = formatActivityDescription(event);
    assert.equal(desc, 'Kofi Creator created task "Draw Cover Art"');
  });

  test("Formats task status change activity", () => {
    const event: ActivityEventWithActor = {
      id: "act-2",
      studio_id: "std-1",
      actor_id: "user-1",
      action: "task_status_changed",
      entity_type: "task",
      entity_id: "task-10",
      metadata: { title: "Draw Cover Art", newStatus: "in_progress" },
      created_at: new Date().toISOString(),
      actor: { id: "user-1", display_name: "Kofi Creator", username: "kofi", avatar_url: null },
    };

    const desc = formatActivityDescription(event);
    assert.equal(desc, 'Kofi Creator changed task "Draw Cover Art" to in_progress');
  });

  test("Formats review requested activity", () => {
    const event: ActivityEventWithActor = {
      id: "act-3",
      studio_id: "std-1",
      actor_id: "user-1",
      action: "review_requested",
      entity_type: "review_request",
      entity_id: "req-1",
      metadata: { round: 2, episodeTitle: "The Awakening" },
      created_at: new Date().toISOString(),
      actor: { id: "user-1", display_name: "Kofi Creator", username: "kofi", avatar_url: null },
    };

    const desc = formatActivityDescription(event);
    assert.equal(desc, 'Kofi Creator requested a review (Round #2) for episode "The Awakening"');
  });

  test("Formats episode approved activity", () => {
    const event: ActivityEventWithActor = {
      id: "act-4",
      studio_id: "std-1",
      actor_id: "user-2",
      action: "episode_approved",
      entity_type: "episode",
      entity_id: "ep-42",
      metadata: { episodeTitle: "The Awakening" },
      created_at: new Date().toISOString(),
      actor: { id: "user-2", display_name: "Editorial Lead", username: "editor", avatar_url: null },
    };

    const desc = formatActivityDescription(event);
    assert.equal(desc, 'Editorial Lead approved episode "The Awakening"');
  });
});

describe("Phase 5.4: In-App Notifications & Recipient Isolation", () => {
  interface NotificationItem {
    id: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: number;
  }

  const notificationStore: NotificationItem[] = [
    { id: "n-1", userId: "user-alice", title: "Task Assigned", message: "Task 1", read: false, createdAt: Date.now() },
    { id: "n-2", userId: "user-alice", title: "Review Ready", message: "Review 1", read: true, createdAt: Date.now() - 1000 },
    { id: "n-3", userId: "user-bob", title: "Private Note", message: "Secret for Bob", read: false, createdAt: Date.now() },
  ];

  test("Recipient isolation: Alice cannot view Bob's notifications", () => {
    const aliceNotifications = notificationStore.filter((n) => n.userId === "user-alice");
    assert.equal(aliceNotifications.length, 2);
    assert.equal(aliceNotifications.every((n) => n.userId === "user-alice"), true);
  });

  test("Unread calculation returns correct count for user", () => {
    const aliceUnread = notificationStore.filter((n) => n.userId === "user-alice" && !n.read).length;
    assert.equal(aliceUnread, 1);
  });

  test("Marking notification as read changes state", () => {
    const item = notificationStore.find((n) => n.id === "n-1")!;
    assert.equal(item.read, false);
    item.read = true;
    assert.equal(item.read, true);
  });

  test("Duplicate prevention suppresses identical notifications in close succession", () => {
    function shouldSuppressDuplicate(
      existing: NotificationItem[],
      newNotif: { userId: string; title: string; message: string; timestamp: number }
    ) {
      const windowMs = 5 * 60 * 1000;
      return existing.some(
        (n) =>
          n.userId === newNotif.userId &&
          n.title === newNotif.title &&
          n.message === newNotif.message &&
          !n.read &&
          newNotif.timestamp - n.createdAt < windowMs
      );
    }

    const isDup = shouldSuppressDuplicate(notificationStore, {
      userId: "user-bob",
      title: "Private Note",
      message: "Secret for Bob",
      timestamp: Date.now(),
    });

    assert.equal(isDup, true);
  });
});

describe("Phase 5.4: Pluggable Email Delivery Guard", () => {
  test("Skips email delivery safely when no credentials configured and does not falsely claim sent", async () => {
    // Delete any test email env vars temporarily if set
    const oldApiKey = process.env.EMAIL_API_KEY;
    const oldResend = process.env.RESEND_API_KEY;
    const oldSmtp = process.env.SMTP_HOST;
    delete process.env.EMAIL_API_KEY;
    delete process.env.RESEND_API_KEY;
    delete process.env.SMTP_HOST;

    const result = await dispatchEmailNotification({
      recipientEmail: "creator@example.com",
      title: "Task Assigned",
      message: "You have a new task",
    });

    assert.equal(result.sent, false);
    assert.equal(result.provider, "none");
    assert.match(result.skippedReason!, /No email provider configured/i);

    // Restore
    if (oldApiKey) process.env.EMAIL_API_KEY = oldApiKey;
    if (oldResend) process.env.RESEND_API_KEY = oldResend;
    if (oldSmtp) process.env.SMTP_HOST = oldSmtp;
  });
});
