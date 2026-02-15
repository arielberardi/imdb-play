import { render } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { YouTubeEmbed } from "./YouTubeEmbed";

describe("YouTubeEmbed", () => {
  it("renders iframe with expected video key", () => {
    const { container } = render(<YouTubeEmbed videoKey="abc123" title="Trailer" />);

    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/abc123?autoplay=1");
    expect(iframe).toHaveAttribute("title", "Trailer");
  });
});
