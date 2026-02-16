import enMessages from "@/messages/en.json";
import "@testing-library/jest-dom";
import { render, RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ReactElement } from "react";
import { vi } from "vitest";

// Mock process.env for Next.js components in browser tests
if (
  typeof window !== "undefined" &&
  typeof (globalThis as unknown as { process?: unknown }).process === "undefined"
) {
  (globalThis as unknown as { process: { env: Record<string, string> } }).process = {
    env: {
      NODE_ENV: "test",
    },
  };
}

// Mock Next.js Image and Link components
vi.mock("next/image", () => {
  return {
    default: (props: {
      src: string;
      alt: string;
      fill?: boolean;
      sizes?: string;
      className?: string;
      [key: string]: unknown;
    }) => {
      const { src, alt, fill, className, ...rest } = props;
      if (fill) {
        return (
          <img src={src} alt={alt} className={className} style={{ objectFit: "cover" }} {...rest} />
        );
      }
      return <img src={src} alt={alt} className={className} {...rest} />;
    },
  };
});

vi.mock("next/link", () => {
  return {
    default: ({
      href,
      children,
      className,
      ...props
    }: {
      href: string;
      children: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    },
  };
});

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {children}
    </NextIntlClientProvider>
  );
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
