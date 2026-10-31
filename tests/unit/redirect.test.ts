import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getSafeRedirectUrl } from "../../src/lib/auth/redirect.ts";

describe("Open Redirect Prevention & Destination Validation (getSafeRedirectUrl)", () => {
  test("Valid relative paths are preserved", () => {
    assert.equal(getSafeRedirectUrl("/studio"), "/studio");
    assert.equal(getSafeRedirectUrl("/studio/series/new"), "/studio/series/new");
    assert.equal(
      getSafeRedirectUrl("/studio/series/series-123/episodes/ep-456"),
      "/studio/series/series-123/episodes/ep-456"
    );
    assert.equal(getSafeRedirectUrl("/browse?genre=Action"), "/browse?genre=Action");
  });

  test("Query parameters and hash fragments are preserved on valid internal paths", () => {
    assert.equal(
      getSafeRedirectUrl("/studio/reviews?status=in_review#comment-12"),
      "/studio/reviews?status=in_review#comment-12"
    );
  });

  test("Protocol-relative URLs are rejected", () => {
    assert.equal(getSafeRedirectUrl("//evil.com"), "/studio");
    assert.equal(getSafeRedirectUrl("//evil.com/phishing"), "/studio");
    assert.equal(getSafeRedirectUrl("///evil.com"), "/studio");
  });

  test("External absolute URLs are rejected", () => {
    assert.equal(getSafeRedirectUrl("https://evil.com"), "/studio");
    assert.equal(getSafeRedirectUrl("http://attacker.com/steal-token"), "/studio");
    assert.equal(getSafeRedirectUrl("ftp://files.com"), "/studio");
  });

  test("JavaScript and data URI vectors are rejected", () => {
    assert.equal(getSafeRedirectUrl("javascript:alert(1)"), "/studio");
    assert.equal(getSafeRedirectUrl("data:text/html,<script>alert(1)</script>"), "/studio");
  });

  test("Backslash bypasses and escape attempts are rejected", () => {
    assert.equal(getSafeRedirectUrl("/\\evil.com"), "/studio");
    assert.equal(getSafeRedirectUrl("/studio\\..\\evil.com"), "/studio");
    assert.equal(getSafeRedirectUrl("\\evil.com"), "/studio");
  });

  test("Control characters and whitespace attacks are rejected", () => {
    assert.equal(getSafeRedirectUrl("/studio\r\n/evil"), "/studio");
    assert.equal(getSafeRedirectUrl("/studio\0/evil"), "/studio");
  });

  test("Self-referential redirects to /login or /signup are neutralized to fallback", () => {
    assert.equal(getSafeRedirectUrl("/login"), "/studio");
    assert.equal(getSafeRedirectUrl("/signup"), "/studio");
  });

  test("Null, undefined, or empty inputs return fallback", () => {
    assert.equal(getSafeRedirectUrl(null), "/studio");
    assert.equal(getSafeRedirectUrl(undefined), "/studio");
    assert.equal(getSafeRedirectUrl(""), "/studio");
    assert.equal(getSafeRedirectUrl("   "), "/studio");
  });

  test("Custom fallback URL is respected when provided", () => {
    assert.equal(getSafeRedirectUrl("https://evil.com", "/browse"), "/browse");
    assert.equal(getSafeRedirectUrl(null, "/series/demon-slayer"), "/series/demon-slayer");
  });
});
