import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { fetchUserRepositories, getRealGithubToken } from '@/lib/github';
import type { GithubRepo } from '@/lib/github';

interface RepositorySelectorProps {
  onSelect: (repo: GithubRepo) => void;
  selectedRepoUrl: string;
}

export function RepositorySelector({ onSelect, selectedRepoUrl }: RepositorySelectorProps) {
  const { getToken } = useAuth();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadRepos() {
      setLoading(true);
      try {
        // We get the standard Clerk session token
        const sessionToken = await getToken();
        if (!sessionToken) {
          throw new Error("Could not retrieve session token. Ensure you're signed in.");
        }
        
        // Exchange it for the real GitHub token via our serverless backend
        const token = await getRealGithubToken(sessionToken);
        
        const fetchedRepos = await fetchUserRepositories(token);
        setRepos(fetchedRepos);
      } catch (error: any) {
        console.error(error);
        toast.error(`Failed to load GitHub repositories: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen && repos.length === 0) {
      loadRepos();
    }
  }, [isOpen, getToken, repos.length]);

  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
          Connected Repository
        </label>
        {loading && <span className="text-[10px] text-muted-foreground animate-pulse">Fetching...</span>}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-[#161b22] transition-colors focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <svg height="16" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="fill-[#8b949e]">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1v-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.21L7 14.472 5.4 15.71a.25.25 0 0 1-.4-.21Z"></path>
            </svg>
            <span className="text-gray-200 truncate">
              {selectedRepoUrl ? selectedRepoUrl.replace('https://github.com/', '') : 'Select a GitHub Repository...'}
            </span>
          </div>
          <span className="material-symbols-outlined text-[#8b949e] text-[16px]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-[#161b22] border border-[#30363d] rounded-md shadow-xl max-h-64 overflow-y-auto overflow-x-hidden">
            {repos.length === 0 && !loading ? (
               <div className="p-4 text-sm text-[#8b949e] text-center">No repositories found.</div>
            ) : (
              repos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => {
                    onSelect(repo);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#1f242c] transition-colors border-b border-[#30363d]/50 last:border-0 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-200 truncate pr-2">{repo.full_name}</span>
                    {repo.private && (
                      <span className="text-[9px] px-1.5 py-0.5 border border-[#30363d] rounded-full text-muted-foreground flex-none uppercase">Private</span>
                    )}
                  </div>
                  {repo.description && (
                    <span className="text-xs text-[#8b949e] truncate block w-full">{repo.description}</span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
