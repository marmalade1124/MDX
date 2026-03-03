interface GithubOwner {
  login: string;
  avatar_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  private: boolean;
  owner: GithubOwner;
}

export async function getRealGithubToken(clerkSessionToken: string): Promise<string> {
  const res = await fetch('/api/github-token', {
    headers: {
      Authorization: `Bearer ${clerkSessionToken}`,
    },
  });
  
  if (!res.ok) {
    let errorMsg = 'Failed to get GitHub token';
    try {
      const err = await res.json();
      if (err.error) errorMsg = err.error;
    } catch (e) {}
    throw new Error(errorMsg);
  }
  
  const data = await res.json();
  return data.token;
}

export async function fetchUserRepositories(token: string): Promise<GithubRepo[]> {
  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data as GithubRepo[];
  } catch (error) {
    throw error;
  }
}

export async function fetchRepositoryContext(token: string, owner: string, repo: string): Promise<string> {
  let context = '';

  try {
    // 1. Fetch languages
    const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (langRes.ok) {
      const languages = await langRes.json();
      const langNames = Object.keys(languages);
      if (langNames.length > 0) {
        context += `\nPrimary Languages: ${langNames.join(', ')}\n`;
      }
    }

    // 2. Fetch package.json if it exists
    const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3.raw' }
    });
    if (pkgRes.ok) {
      const pkgContent = await pkgRes.text();
      try {
        const pkgData = JSON.parse(pkgContent);
        context += `\nProject Type: Node.js / NPM`;
        if (pkgData.dependencies) {
          context += `\nKey Dependencies: ${Object.keys(pkgData.dependencies).slice(0, 15).join(', ')}`;
        }
        if (pkgData.scripts) {
          context += `\nAvailable Scripts: ${Object.keys(pkgData.scripts).join(', ')}`;
        }
      } catch (e) {
        // Not valid JSON, ignore
      }
    }

    // 3. Fetch Directory Structure (Root)
    const dirRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (dirRes.ok) {
      const dirListing = await dirRes.json();
      if (Array.isArray(dirListing)) {
        const files = dirListing.map((item: any) => item.name).slice(0, 20);
        context += `\nRoot Files & Folders: ${files.join(', ')}\n`;
      }
    }

    // 4. Fetch existing README.md if it exists
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3.raw' }
    });
    if (readmeRes.ok) {
      const readmeContent = await readmeRes.text();
      context += `\n--- Existing README Content Preview ---\n${readmeContent.substring(0, 1500)}\n---------------------------------------\n`;
    }

    return context;
  } catch (error) {
    console.warn('Could not fetch full repository context:', error);
    return context; // Return whatever we managed to gather
  }
}

export async function commitReadme(
  token: string, 
  owner: string, 
  repo: string, 
  content: string, 
  message: string = 'docs: Update README.md via AI Generator'
): Promise<string> {
  const path = 'README.md';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  try {
    // 1. Check if README already exists so we can get its SHA (required for updates)
    let sha = undefined;
    const getRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (getRes.ok) {
      const existingFile = await getRes.json();
      sha = existingFile.sha;
    }

    // 2. Base64 encode the content (handling Unicode correctly)
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    // 3. Put the new content
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: base64Content,
        sha // Will be undefined for new files, which is fine
      })
    });

    if (!putRes.ok) {
      const errorData = await putRes.json();
      throw new Error(`GitHub API error: ${errorData.message}`);
    }

    const data = await putRes.json();
    return data.commit.html_url;
  } catch (error) {
    console.error('Failed to commit README:', error);
    throw error;
  }
}
