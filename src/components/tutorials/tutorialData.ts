export interface TutorialStep {
  id: string;
  title: string;
  instruction: string;
  hint?: string;
  expectedCommand?: string;
  validationFn?: (state: any) => boolean;
  successMessage: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: TutorialStep[];
  icon: string;
}

export const TUTORIALS: Tutorial[] = [
  {
    id: "git-basics",
    title: "Git Basics",
    description: "Learn the fundamental Git commands: init, add, commit, status",
    difficulty: "beginner",
    icon: "🌱",
    steps: [
      {
        id: "init",
        title: "Initialize a Repository",
        instruction: "Create a new Git repository by running `git init`",
        hint: "Type: git init",
        expectedCommand: "git init",
        successMessage: "✅ Repository initialized! You now have an empty Git repo.",
      },
      {
        id: "create-file",
        title: "Create a File",
        instruction: "Create a file called `readme.md` using the touch command",
        hint: "Type: touch readme.md",
        expectedCommand: "touch readme.md",
        successMessage: "✅ File created! Now let's track it with Git.",
      },
      {
        id: "check-status",
        title: "Check Git Status",
        instruction: "Run `git status` to see that readme.md is untracked",
        hint: "Type: git status",
        expectedCommand: "git status",
        successMessage: "✅ You can see readme.md is listed as an untracked file.",
      },
      {
        id: "stage-file",
        title: "Stage the File",
        instruction: "Add readme.md to the staging area with `git add readme.md`",
        hint: "Type: git add readme.md",
        expectedCommand: "git add readme.md",
        successMessage: "✅ File staged! It's now ready to be committed.",
      },
      {
        id: "commit",
        title: "Make Your First Commit",
        instruction: 'Commit the staged file with `git commit -m "Initial commit"`',
        hint: 'Type: git commit -m "Initial commit"',
        expectedCommand: "git commit -m",
        successMessage: "🎉 Congratulations! You've made your first Git commit!",
      },
    ],
  },
  {
    id: "branching",
    title: "Branching & Merging",
    description: "Learn to create branches, switch between them, and merge changes",
    difficulty: "intermediate",
    icon: "🌿",
    steps: [
      {
        id: "init-repo",
        title: "Set Up Repository",
        instruction: "Initialize a repo and create an initial commit:\n```\ngit init\ntouch index.html\ngit add .\ngit commit -m \"Initial\"\n```",
        hint: "Run the four commands to set up your repo",
        successMessage: "✅ Repo ready! We have our first commit on master.",
      },
      {
        id: "create-branch",
        title: "Create a Feature Branch",
        instruction: "Create a new branch called `feature` using `git branch feature`",
        hint: "Type: git branch feature",
        expectedCommand: "git branch feature",
        successMessage: "✅ Branch 'feature' created! Now switch to it.",
      },
      {
        id: "switch-branch",
        title: "Switch Branches",
        instruction: "Switch to the feature branch with `git checkout feature`",
        hint: "Type: git checkout feature",
        expectedCommand: "git checkout feature",
        successMessage: "✅ Switched to feature branch! Any commits here won't affect master.",
      },
      {
        id: "feature-work",
        title: "Work on Feature",
        instruction: "Create a file and commit it on the feature branch:\n```\ntouch feature.js\ngit add .\ngit commit -m \"Add feature\"\n```",
        hint: "Create feature.js, stage, and commit",
        successMessage: "✅ Feature work committed on the feature branch!",
      },
      {
        id: "merge",
        title: "Merge Back to Master",
        instruction: "Switch to master and merge in the feature:\n```\ngit checkout master\ngit merge feature\n```",
        hint: "First checkout master, then merge feature",
        successMessage: "🎉 Feature merged into master! You've completed a branching workflow!",
      },
    ],
  },
  {
    id: "remote-workflow",
    title: "Remote Workflow",
    description: "Simulate working with remote repositories: add, push, pull",
    difficulty: "intermediate",
    icon: "☁️",
    steps: [
      {
        id: "init-remote",
        title: "Prepare Local Repo",
        instruction: "Initialize a repo with an initial commit:\n```\ngit init\ntouch app.js\ngit add .\ngit commit -m \"First\"\n```",
        hint: "Set up the local repository",
        successMessage: "✅ Local repo ready with one commit.",
      },
      {
        id: "add-remote",
        title: "Add a Remote",
        instruction: 'Add a remote called "origin" pointing to a URL:\n```\ngit remote add origin https://github.com/user/my-project.git\n```',
        hint: 'Type: git remote add origin https://github.com/user/my-project.git',
        successMessage: "✅ Remote 'origin' configured! Now push your code.",
      },
      {
        id: "push",
        title: "Push to Remote",
        instruction: "Push your commits to the remote with `git push`",
        hint: "Type: git push",
        expectedCommand: "git push",
        successMessage: "✅ Code pushed to remote! Your local commits are now synced.",
      },
      {
        id: "fetch",
        title: "Fetch from Remote",
        instruction: "Fetch the latest from remote with `git fetch`",
        hint: "Type: git fetch",
        expectedCommand: "git fetch",
        successMessage: "✅ Fetched remote data! You can see remote tracking branches.",
      },
    ],
  },
  {
    id: "merge-conflicts",
    title: "Resolve Merge Conflicts",
    description: "Learn to handle merge conflicts when two branches modify the same file",
    difficulty: "advanced",
    icon: "⚔️",
    steps: [
      {
        id: "setup-conflict",
        title: "Create a Conflict Scenario",
        instruction: "Set up two branches that modify the same file:\n```\ngit init\necho \"Hello\" > app.js\ngit add .\ngit commit -m \"Initial\"\ngit branch feature\necho \"World\" > app.js\ngit add .\ngit commit -m \"Master change\"\ngit checkout feature\necho \"Universe\" > app.js\ngit add .\ngit commit -m \"Feature change\"\ngit checkout master\n```",
        hint: "Run all of these commands to set up conflicting changes",
        successMessage: "✅ Two branches with conflicting changes ready!",
      },
      {
        id: "attempt-merge",
        title: "Attempt the Merge",
        instruction: "Try merging feature into master with `git merge feature`",
        hint: "Type: git merge feature",
        expectedCommand: "git merge feature",
        successMessage: "⚠️ Merge conflict detected! Git can't automatically resolve it.",
      },
      {
        id: "resolve",
        title: "Resolve the Conflict",
        instruction: "View the conflicted file with `cat app.js`, then edit it to resolve the conflict by keeping the content you want, then stage and commit:\n```\ngit add .\ngit commit -m \"Resolve conflict\"\n```",
        hint: "Stage and commit to mark the conflict as resolved",
        successMessage: "🎉 Conflict resolved! You've learned one of Git's most important skills!",
      },
    ],
  },
];
