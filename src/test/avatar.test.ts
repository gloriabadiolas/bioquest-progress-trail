import { describe, expect, it } from "vitest";
import { avatarFileError, avatarPath } from "@/lib/avatar";

describe("student avatars", () => {
  it("stores each student image inside their own account folder", () => {
    expect(avatarPath("student-a", "photo-1")).toBe("student-a/photo-1.jpg");
    expect(avatarPath("student-b", "photo-1")).toBe("student-b/photo-1.jpg");
  });
  it("accepts only supported images", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      expect(avatarFileError({ type, size: 1024 })).toBeNull();
    }
    expect(avatarFileError({ type: "image/svg+xml", size: 1024 })).not.toBeNull();
    expect(avatarFileError({ type: "application/pdf", size: 1024 })).not.toBeNull();
  });
  it("caps uploads at 5 MB and rejects empty files", () => {
    expect(avatarFileError({ type: "image/jpeg", size: 5 * 1024 * 1024 })).toBeNull();
    expect(avatarFileError({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).not.toBeNull();
    expect(avatarFileError({ type: "image/jpeg", size: 0 })).not.toBeNull();
  });
});