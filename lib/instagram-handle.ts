export function instagramHandleFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, "");
    const segment = pathname.split("/").filter(Boolean).pop();
    if (!segment) {
      return "kelceebeautyco";
    }
    return segment.replace(/^@/, "");
  } catch {
    return "kelceebeautyco";
  }
}
