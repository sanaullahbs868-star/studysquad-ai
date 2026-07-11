import os
import json
import sqlite3
import subprocess
from datetime import datetime
from openai import OpenAI

# Configuration
DB_PATH = "/home/ubuntu/github_agent_v2.db"
MODEL = "gpt-5-mini"

class GitHubStorage:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self._init_db()

    def _init_db(self):
        # Table for general memory (interactions, logs)
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                type TEXT,
                content TEXT
            )
        ''')
        # Table for structured repository data
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS repositories (
                name TEXT PRIMARY KEY,
                description TEXT,
                url TEXT,
                last_synced TEXT
            )
        ''')
        # Table for user info
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_profile (
                login TEXT PRIMARY KEY,
                name TEXT,
                bio TEXT,
                public_repos INTEGER,
                last_updated TEXT
            )
        ''')
        self.conn.commit()

    def update_user(self, user_data):
        timestamp = datetime.now().isoformat()
        self.cursor.execute(
            "INSERT OR REPLACE INTO user_profile (login, name, bio, public_repos, last_updated) VALUES (?, ?, ?, ?, ?)",
            (user_data.get('login'), user_data.get('name'), user_data.get('bio'), user_data.get('public_repos'), timestamp)
        )
        self.conn.commit()

    def update_repos(self, repos_list):
        timestamp = datetime.now().isoformat()
        for repo in repos_list:
            self.cursor.execute(
                "INSERT OR REPLACE INTO repositories (name, description, url, last_synced) VALUES (?, ?, ?, ?)",
                (repo.get('name'), repo.get('description'), repo.get('url'), timestamp)
            )
        self.conn.commit()

    def add_log(self, log_type, content):
        timestamp = datetime.now().isoformat()
        self.cursor.execute(
            "INSERT INTO logs (timestamp, type, content) VALUES (?, ?, ?)",
            (timestamp, log_type, json.dumps(content))
        )
        self.conn.commit()

    def get_context(self):
        self.cursor.execute("SELECT * FROM user_profile LIMIT 1")
        user = self.cursor.fetchone()
        self.cursor.execute("SELECT * FROM repositories")
        repos = self.cursor.fetchall()
        self.cursor.execute("SELECT type, content, timestamp FROM logs ORDER BY id DESC LIMIT 5")
        logs = self.cursor.fetchall()
        
        return {
            "user": user,
            "repositories": repos,
            "recent_logs": logs
        }

class EnhancedGitHubAgent:
    def __init__(self):
        self.client = OpenAI()
        self.storage = GitHubStorage(DB_PATH)

    def run_gh(self, cmd):
        env = os.environ.copy()
        env["NO_COLOR"] = "1"
        env["CLICOLOR"] = "0"
        try:
            result = subprocess.run(f"gh {cmd}", shell=True, capture_output=True, text=True, env=env)
            if result.returncode != 0:
                return {"error": result.stderr}
            
            # Remove ANSI escape sequences manually just in case
            import re
            clean_stdout = re.sub(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])', '', result.stdout)
            
            try:
                return json.loads(clean_stdout)
            except:
                return clean_stdout
        except Exception as e:
            return {"error": str(e)}

    def sync(self):
        print("Syncing with GitHub...")
        user = self.run_gh("api user")
        print(f"User API result type: {type(user)}")
        repos = self.run_gh("repo list --limit 10 --json name,description,url")
        print(f"Repos API result type: {type(repos)}")
        
        if isinstance(user, dict) and 'login' in user:
            print(f"Updating user: {user['login']}")
            self.storage.update_user(user)
        else:
            print(f"Failed to parse user data: {user}")

        if isinstance(repos, list):
            print(f"Updating {len(repos)} repos")
            self.storage.update_repos(repos)
        else:
            print(f"Failed to parse repos data: {repos}")
        
        self.storage.add_log("sync", {"status": "success", "repo_count": len(repos) if isinstance(repos, list) else 0})
        return "Sync completed."

    def execute_action(self, action_type, params):
        """
        AI can call this to perform real actions.
        Example action_type: 'create_issue', 'star_repo'
        """
        print(f"Executing action: {action_type} with {params}")
        if action_type == "create_issue":
            repo = params.get('repo')
            title = params.get('title')
            body = params.get('body', '')
            cmd = f"issue create --repo {repo} --title '{title}' --body '{body}'"
            res = self.run_gh(cmd)
            self.storage.add_log("action", {"action": "create_issue", "repo": repo, "result": res})
            return res
        return "Unknown action."

    def chat(self, user_query):
        context = self.storage.get_context()
        
        system_prompt = f"""You are an Enhanced GitHub AI Agent.
You have a persistent SQL-based storage system.
Current User: {context['user']}
Repositories in Storage: {context['repositories']}
Recent Activity: {context['recent_logs']}

You can answer questions about the user's GitHub account and suggest actions.
If the user wants to perform an action (like creating an issue), describe what you would do.
"""

        response = self.client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ]
        )
        
        answer = response.choices[0].message.content
        self.storage.add_log("chat", {"query": user_query, "response": answer})
        return answer

if __name__ == "__main__":
    agent = EnhancedGitHubAgent()
    
    # 1. Sync data to storage
    print(agent.sync())
    
    # 2. Ask the AI a question that requires storage context
    query = "Summarize my GitHub profile and list my repositories from your storage."
    print(f"\nUser: {query}")
    print(f"AI: {agent.chat(query)}")
    
    # 3. Simulate an action request
    query_action = "I need to keep track of a bug in my 'studysquad-ai' repo. What should I do?"
    print(f"\nUser: {query_action}")
    print(f"AI: {agent.chat(query_action)}")
