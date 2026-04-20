"use client";
import { mockContributions, DIVISIONS } from "../../lib/data";

export default function LibraryPage() {
  const accepted = mockContributions.filter((c) => c.status === "accepted");

  const byDivision = DIVISIONS.map((div) => ({
    division: div,
    items: accepted.filter((c) => c.division === div),
  })).filter((d) => d.items.length > 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Library</h1>
        <p className="text-sm mt-1" style={{ color: "#555" }}>
          All accepted contributions organized by division
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div
          className="rounded-2xl p-5 border"
          style={{ background: "#111", borderColor: "#1f1f1f" }}
        >
          <div className="text-3xl font-bold text-white">{accepted.length}</div>
          <div className="text-sm mt-1" style={{ color: "#555" }}>
            Total Resources
          </div>
        </div>
        <div
          className="rounded-2xl p-5 border"
          style={{ background: "#111", borderColor: "#1f1f1f" }}
        >
          <div className="text-3xl font-bold text-white">
            {byDivision.length}
          </div>
          <div className="text-sm mt-1" style={{ color: "#555" }}>
            Active Divisions
          </div>
        </div>
        <div
          className="rounded-2xl p-5 border"
          style={{ background: "#111", borderColor: "#1f1f1f" }}
        >
          <div className="text-3xl font-bold text-white">
            {DIVISIONS.length}
          </div>
          <div className="text-sm mt-1" style={{ color: "#555" }}>
            Total Divisions
          </div>
        </div>
      </div>

      {byDivision.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#444" }}>
          <div className="text-4xl mb-3">📚</div>
          <p className="text-sm">No resources in library yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {byDivision.map(({ division, items }) => (
            <div
              key={division}
              className="rounded-2xl border overflow-hidden"
              style={{ background: "#111", borderColor: "#1f1f1f" }}
            >
              <div
                className="px-5 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "#1a1a1a" }}
              >
                <h2 className="text-white font-semibold text-sm">{division}</h2>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "#00c8ff18", color: "#00c8ff" }}
                >
                  {items.length} resource{items.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: "#1a1a1a" }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="px-5 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "#1a1a1a" }}
                      >
                        <span className="text-sm">📁</span>
                      </div>
                      <div>
                        <div className="text-sm text-white">{item.name}</div>
                        <div className="text-xs" style={{ color: "#555" }}>
                          BAC {item.bacYear} · Score {item.score}
                        </div>
                      </div>
                    </div>
                    <a
                      href={item.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: "#00c8ff18", color: "#00c8ff" }}
                    >
                      Open Drive ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty divisions */}
      <div className="mt-8">
        <h2 className="text-sm font-medium mb-4" style={{ color: "#444" }}>
          Divisions with no content yet
        </h2>
        <div className="flex flex-wrap gap-2">
          {DIVISIONS.filter(
            (d) => !byDivision.find((b) => b.division === d),
          ).map((d) => (
            <span
              key={d}
              className="px-3 py-1.5 rounded-xl text-xs"
              style={{
                background: "#161616",
                color: "#444",
                border: "1px solid #1f1f1f",
              }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
