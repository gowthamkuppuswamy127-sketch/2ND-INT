@AGENTS.md

# Deployment

Vercel deploys production from this repo's GitHub **default branch**
(currently `claude/epic-shannon-r70j3l` — there is no `main`). It does not
track any other branch. Every session works on its own fresh `claude/...`
branch, so pushing that branch alone does not put the work on Vercel —
this has already caused a "why isn't my change live" confusion once.

Before treating a task as finished, merge the session's working branch
into the default branch and push that too:

    default_branch=$(git remote show origin | sed -n 's/.*HEAD branch: //p')
    git fetch origin "$default_branch"
    git checkout -B "$default_branch" "origin/$default_branch"
    git merge --no-edit <your-working-branch>
    git push origin "$default_branch"

Then switch back to the session's designated working branch for anything
further. Do this for every change, not just the first one in a session.
