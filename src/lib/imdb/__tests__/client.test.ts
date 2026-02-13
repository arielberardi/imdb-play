import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../client";
import { ImdbHttpError, ImdbNetworkError, ImdbNotFoundError, ImdbRateLimitError } from "../errors";

// Mock process.env for browser environment
const originalEnv = process.env;

describe("apiFetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.env with API key
    process.env = { ...originalEnv, IMDB_API_KEY: "test-api-key" };
  });

  it("makes successful request and returns parsed JSON", async () => {
    const mockData = { id: 1, title: "Test Movie" };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await apiFetch<typeof mockData>("/movie/1");

    expect(response.data).toEqual(mockData);
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/movie/1?api_key=test-api-key",
      expect.objectContaining({}),
    );
  });

  it("appends API key correctly with existing query params", async () => {
    const mockData = { results: [] };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch<typeof mockData>("/search/movie?query=test");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/search/movie?query=test&api_key=test-api-key",
      expect.objectContaining({}),
    );
  });

  it("throws ImdbNotFoundError on 404 status", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/movie/999999")).rejects.toThrow(ImdbNotFoundError);
    await expect(apiFetch("/movie/999999")).rejects.toThrow("Resource not found");
  });

  it("throws ImdbHttpError on 400 status", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
    });
    vi.stubGlobal("fetch", fetchMock);

    const errorPromise = apiFetch("/movie/invalid");

    await expect(errorPromise).rejects.toThrow(ImdbHttpError);
    await expect(errorPromise).rejects.toMatchObject({ status: 400 });
  });

  it("retries and throws ImdbRateLimitError on 429 status after exhausting retries", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    });
    vi.stubGlobal("fetch", fetchMock);

    const promise = apiFetch("/movie/1", { retries: 2, timeout: 100 });

    await expect(promise).rejects.toThrow(ImdbRateLimitError);

    // Should have called fetch 3 times (initial + 2 retries)
    expect(fetchMock).toHaveBeenCalledTimes(3);
  }, 10000);

  it("retries and throws ImdbHttpError on 500 status after exhausting retries", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });
    vi.stubGlobal("fetch", fetchMock);

    const promise = apiFetch("/movie/1", { retries: 2, timeout: 100 });

    await expect(promise).rejects.toThrow(ImdbHttpError);

    // Should have called fetch 3 times (initial + 2 retries)
    expect(fetchMock).toHaveBeenCalledTimes(3);
  }, 10000);

  it("retries and succeeds on second attempt after 500 error", async () => {
    const mockData = { id: 1, title: "Test Movie" };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
    vi.stubGlobal("fetch", fetchMock);

    const response = await apiFetch<typeof mockData>("/movie/1", {
      retries: 2,
      timeout: 100,
    });

    expect(response.data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  }, 10000);

  it("throws ImdbNetworkError on network failure", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("Network error"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/movie/1", { retries: 0 })).rejects.toThrow(ImdbNetworkError);
    await expect(apiFetch("/movie/1", { retries: 0 })).rejects.toThrow("Network error");
  });

  it("throws ImdbNetworkError on timeout", async () => {
    const fetchMock = vi.fn().mockImplementation(
      (_url, options) =>
        new Promise((resolve, reject) => {
          // Simulate slow response that never completes before timeout
          const timeout = setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: async () => ({ data: "too slow" }),
            });
          }, 5000);

          // Respect the abort signal
          if (options?.signal) {
            options.signal.addEventListener("abort", () => {
              clearTimeout(timeout);
              reject(new DOMException("The operation was aborted.", "AbortError"));
            });
          }
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/movie/1", { timeout: 50, retries: 0 })).rejects.toThrow(
      ImdbNetworkError,
    );
    await expect(apiFetch("/movie/1", { timeout: 50, retries: 0 })).rejects.toThrow("timeout");
  }, 10000);

  it("throws ImdbNetworkError when API key is missing", async () => {
    process.env.IMDB_API_KEY = "";

    await expect(apiFetch("/movie/1")).rejects.toThrow(ImdbNetworkError);
    await expect(apiFetch("/movie/1")).rejects.toThrow("not configured");
  });

  it("passes Next.js cache options correctly", async () => {
    const mockData = { id: 1 };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/movie/1", { revalidate: 3600 });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: { revalidate: 3600 },
      }),
    );
  });

  it("passes Next.js force-cache option correctly", async () => {
    const mockData = { id: 1 };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/movie/1", { cache: "force-cache" });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        cache: "force-cache",
      }),
    );
  });
});
