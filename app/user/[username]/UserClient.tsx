
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LeetCodeProfile {
  username: string;
  name: string;
  avatar: string;
  ranking: number;
  reputation: number;
  school?: string;
}

interface SolvedProblem {
  title: string;
  lang: string;
  statusDisplay: string;
}

interface SuggestedProblem {
  title: string;
  difficulty: string;
  concept: string;
}

export default function UserPage({ username }: { username: string }) {
  const router = useRouter();

  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [solved, setSolved] = useState<SolvedProblem[]>([]);
  const [suggested, setSuggested] = useState<SuggestedProblem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const [excluded, setExcluded] = useState<string[]>([]);

  // Fetch profile and solved problems
  useEffect(() => {
    // User of the controller is that it cancel the fetch request when componenet unmounts 
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        //we are using Promise.all here to fetch both profile and recent solved problems at the same time
        // we can also use encodeURIComponent with username so if username contain any space so it enode it to something percentage same as happens in te browser but in our case i am sure that username does not contain any space so i am not going to use it
        const [profileRes, solvedRes] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/${username}`, {
            signal: controller.signal,
          }),
          fetch(
            `https://alfa-leetcode-api.onrender.com/${username}/acsubmission`,
            { signal: controller.signal }
          ),
        ]);
        // here .ok check that server returned a successful http status between range 200-299 or give an bad response
        if (!profileRes.ok || !solvedRes.ok) {
          throw new Error("Failed to fetch LeetCode data.");
        }
        // Using await here again because in previous fetch we obtain response object may the body still in the route so for the check we do await again
        const profileData: LeetCodeProfile = await profileRes.json();
        const solvedData: { submission: SolvedProblem[] } =
          await solvedRes.json();

        if (!profileData.username) {
          throw new Error("LeetCode user not found.");
        }

        setProfile(profileData);
        setSolved(solvedData.submission.slice(0, 10) ?? []);

        setSuggested([]);
        setExcluded([]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
        setProfile(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [username]);

  // Fetch AI suggestions
  const fetchSuggestions = async (replace = false) => {
    if (suggestionsLoading || solved.length === 0) return;

    setSuggestionsLoading(true);

    try {
      const res = await fetch("/api/mistral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SolvedProblems: solved.map((p) => p.title),
          ExcludedProblems: excluded,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate suggestions.");
      }

      const data: { suggestions?: SuggestedProblem[] } = await res.json();
      // Here ?? means that return empty array if value is null or not defined
      const newSuggestions = (data.suggestions ?? []).filter(
        (problem) =>
          problem.title &&
          !excluded.includes(problem.title) &&
          !solved.some(
            (solvedProblem) =>
              solvedProblem.title.toLowerCase() ===
              problem.title.toLowerCase()
          )
      );

      setSuggested(newSuggestions);

      setExcluded((prev) => [
        ...prev,
        ...newSuggestions.map((p) => p.title),
      ]);

    } catch (err) {
      console.error("Suggestion error:", err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Change username
  const handleChangeUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = newUsername.trim();

    if (!value) return;

    setShowModal(false);
    router.push(`/user/${value}`);
  };

  // Loading
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  // Error
  if (error || !profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">
          {error || "User not found."}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-300 text-black px-4 py-6 md:px-12">

      {/* Profile */}
      <section className="relative mx-auto max-w-4xl bg-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">

        <button
          onClick={() => setShowModal(true)}
          className="static sm:absolute top-4 right-4 px-4 py-2 text-sm rounded-full border hover:bg-gray-100"
        >
          Change User
        </button>

        {/* We user && here because we not want to render the image if profile.avtar is empty */}
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={`${profile.username}'s avatar`}
            width={120}
            height={120}
            />
        )}

        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">
            {profile.name || profile.username}
          </h1>

          <p className="text-gray-500">@{profile.username}</p>

          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-700">
            <span>Rank: {profile.ranking}</span>
            <span>Reputation: {profile.reputation}</span>

            {profile.school && <span>School: {profile.school}</span>}
          </div>
        </div>
      </section>

      {/* Recently Solved */}
      <section className="mx-auto max-w-4xl mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8">

        <h2 className="text-xl font-semibold mb-4">
          Recently Solved
        </h2>

        {solved.length > 0 ? (
          <ul className="space-y-2">
            {solved.map((problem, index) => (
              <li
                key={`${problem.title}-${index}`}
                className="px-3 py-2 rounded-lg bg-gray-50 border text-gray-700"
              >
                {problem.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recently solved problems found.</p>
        )}
      </section>

      {/* Suggestions Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            const shouldShow = !showSuggestions;
            setShowSuggestions(shouldShow);

            if (shouldShow && suggested.length === 0) {
              fetchSuggestions();
            }
          }}
          className="px-6 py-2 rounded-full bg-yellow-400 font-medium hover:bg-yellow-500 transition"
        >
          {showSuggestions ? "Hide" : "Show"} Suggestions
        </button>
      </div>

      {/* Replace Suggestions */}
      {showSuggestions && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => fetchSuggestions(true)}
            disabled={suggestionsLoading}
            className="px-5 py-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            {suggestionsLoading ? "Loading..." : "Replace Suggestions"}
          </button>
        </div>
      )}

      {/* Recommended Problems */}
      {showSuggestions && (
        <section className="mx-auto max-w-4xl mt-8">

          <h2 className="text-xl font-semibold mb-5">
            Recommended Problems
          </h2>

          {suggestionsLoading && suggested.length === 0 ? (
            <p className="text-center text-gray-600">
              Generating suggestions...
            </p>
          ) : suggested.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {suggested.map((problem) => (
                <div
                  key={problem.title}
                  className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {problem.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    <strong>Difficulty:</strong> {problem.difficulty}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Concept:</strong> {problem.concept}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !suggestionsLoading && (
              <p className="text-center text-gray-500">
                No suggestions available.
              </p>
            )
          )}
        </section>
      )}

      {/* Change User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <form
            onSubmit={handleChangeUser}
            className="bg-white rounded-2xl w-[90%] max-w-sm p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              Change LeetCode User
            </h3>

            <input
              type="text"
              placeholder="Enter username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoFocus
            />

            <div className="mt-5 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!newUsername.trim()}
                className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 font-medium disabled:opacity-50"
              >
                Search
              </button>

            </div>
          </form>
        </div>
      )}

    </main>
  );
}
