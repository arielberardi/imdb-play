-- Create enums
CREATE TYPE "TitleType" AS ENUM ('MOVIE', 'SERIES');

-- Create catalog tables
CREATE TABLE "Title" (
    "id" TEXT NOT NULL,
    "titleType" "TitleType" NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "runtimeMinutes" INTEGER,
    "posterUrl" TEXT,
    "backdropUrl" TEXT,
    "voteAverage" DOUBLE PRECISION,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "popularity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tagline" TEXT,
    "status" TEXT,
    "originalLanguage" TEXT DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TitleGenre" (
    "id" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TitleGenre_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TitleCast" (
    "id" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "character" TEXT,
    "castOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TitleCast_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Trailer" (
    "id" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "official" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trailer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "posterPath" TEXT,
    "episodeCount" INTEGER NOT NULL DEFAULT 0,
    "airDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "stillPath" TEXT,
    "airDate" TIMESTAMP(3),
    "runtime" INTEGER,
    "voteAverage" DOUBLE PRECISION,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- Migrate user tables from imdbId -> titleId
ALTER TABLE "Favorite" RENAME COLUMN "imdbId" TO "titleId";
ALTER TABLE "Watchlist" RENAME COLUMN "imdbId" TO "titleId";
ALTER TABLE "ContinueWatching" RENAME COLUMN "imdbId" TO "titleId";

ALTER INDEX "Favorite_imdbId_idx" RENAME TO "Favorite_titleId_idx";
ALTER INDEX "Watchlist_imdbId_idx" RENAME TO "Watchlist_titleId_idx";
ALTER INDEX "ContinueWatching_imdbId_idx" RENAME TO "ContinueWatching_titleId_idx";

ALTER INDEX "Favorite_userId_imdbId_key" RENAME TO "Favorite_userId_titleId_key";
ALTER INDEX "Watchlist_userId_imdbId_key" RENAME TO "Watchlist_userId_titleId_key";
ALTER INDEX "ContinueWatching_userId_imdbId_key" RENAME TO "ContinueWatching_userId_titleId_key";

-- Catalog indexes
CREATE INDEX "Title_titleType_idx" ON "Title"("titleType");
CREATE INDEX "Title_voteCount_voteAverage_idx" ON "Title"("voteCount" DESC, "voteAverage" DESC);
CREATE INDEX "Title_popularity_idx" ON "Title"("popularity" DESC);
CREATE INDEX "Title_releaseDate_idx" ON "Title"("releaseDate" DESC);
CREATE UNIQUE INDEX "TitleGenre_titleId_genreId_key" ON "TitleGenre"("titleId", "genreId");
CREATE INDEX "TitleGenre_genreId_idx" ON "TitleGenre"("genreId");
CREATE UNIQUE INDEX "TitleCast_titleId_personId_character_key" ON "TitleCast"("titleId", "personId", "character");
CREATE INDEX "TitleCast_titleId_castOrder_idx" ON "TitleCast"("titleId", "castOrder");
CREATE INDEX "Trailer_titleId_idx" ON "Trailer"("titleId");
CREATE UNIQUE INDEX "Season_titleId_seasonNumber_key" ON "Season"("titleId", "seasonNumber");
CREATE INDEX "Season_titleId_idx" ON "Season"("titleId");
CREATE UNIQUE INDEX "Episode_seasonId_episodeNumber_key" ON "Episode"("seasonId", "episodeNumber");
CREATE INDEX "Episode_seasonId_idx" ON "Episode"("seasonId");

-- Foreign keys
ALTER TABLE "TitleGenre"
    ADD CONSTRAINT "TitleGenre_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "TitleGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TitleCast"
    ADD CONSTRAINT "TitleCast_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "TitleCast_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Trailer"
    ADD CONSTRAINT "Trailer_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Season"
    ADD CONSTRAINT "Season_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Episode"
    ADD CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Favorite"
    ADD CONSTRAINT "Favorite_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Watchlist"
    ADD CONSTRAINT "Watchlist_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContinueWatching"
    ADD CONSTRAINT "ContinueWatching_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;
