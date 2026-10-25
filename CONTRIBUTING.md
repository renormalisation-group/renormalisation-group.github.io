# GitHub setup and editorial workflow

## 1. Shared repository

The site repository is https://github.com/renormalisation-group/renormalisation-group.github.io.
Clone it with GitHub Desktop or Git, then follow the local preview instructions in README.md.
The production configuration uses `https://renormalisation-group.github.io` with an empty `baseurl`.

## 2. Invite writers and set review rules

In repository Settings → Collaborators (or organization team access), invite
writers. Give writers Write access and keep Admin access limited to maintainers.
For contributors without repository access, use forks and pull requests.

In Settings → Rules → Rulesets (or branch protection), protect `main`: require
pull requests, one approval, resolved conversations, and the `build` status check
once the first workflow has run. Avoid allowing routine direct pushes. Availability
of enforcement depends on repository visibility and your GitHub plan.
Add real editor handles to `.github/CODEOWNERS` if you want automatic review requests;
no placeholder owner file is installed. Require code-owner review if appropriate.

In Settings → Pages, select **GitHub Actions** as the publishing source.
Restrict the `github-pages` deployment environment to `main`. The included workflow
builds PRs and publishes only after a merge/push to `main`. The public site follows
GitHub Pages visibility rules; a private repository does not automatically mean a
private website.

## 3. Add an author

Replace the empty `{}` in `_data/authors.yml` with entries such as:

```yaml
writer-id:
  name: "Writer Name"
  home: /authors/writer-id/
  bio: "A short biography."
  # avatar: /assets/images/authors/writer-id.jpg
  links:
    - label: GitHub
      icon: fab fa-fw fa-github
      url: https://github.com/WRITER-HANDLE
```

Create `_pages/authors/writer-id.md`:

```yaml
---
layout: contributor
title: "Writer Name"
permalink: /authors/writer-id/
contributor_id: writer-id
author_profile: true
---
```

The author directory and personal archive update automatically. Optional rotating
biographies use `rotating_bio: true` and a `bios` list in that author's entry.
`_data/author_bios.yml` remains an optional shared fallback and is empty initially.

## 4. Write a flow on a branch

Follow the [README collaboration workflow](README.md#collaboration-workflow).
Copy [templates/flow.md](templates/flow.md) to
`_posts/YYYY-MM-DD-your-topic.md`, then replace its sample content and metadata.
See [Writing a flow in Markdown](README.md#writing-a-flow-in-markdown) for
footnotes, short reference labels, coauthorship, and draft previews.

Contributor IDs must match `_data/authors.yml`; their order determines byline
order. Categories are case-sensitive subject areas. Use `tags` for the authors
cited in the flow. Keep each flow's permalink unique.

Commit, push the branch, and open a pull request into `main`. Ask the other editor
to review. Further commits on the same branch update the pull request.

## 5. Review and publish

Check the build result, inspect the local preview, and review spelling, attribution,
images, equations and references. The workflow validates contributor IDs and builds
the site; it does not create a public PR preview. An editor approves and merges the
PR. Actions deploys the result to Pages. If publication fails, inspect Actions → Site.
Other writers pull the updated `main` before starting their next branch.

GitHub's browser editor also works: choose/create a branch, edit Markdown, commit
to that branch, then open a PR. Nobody needs to edit HTML for ordinary flows.

## Official references

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Categories and author tags

Use subject areas for categories (for example, `Philosophy of Science`).
Include all authors cited in the article in `tags`, using consistent names across posts.

Cited-author tags are displayed as plain text; no individual cited-author archive pages are generated for now. Subject categories retain dedicated article indexes.
